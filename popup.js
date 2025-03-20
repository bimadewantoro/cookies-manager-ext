// Cookie Manager Extension - Educational Purposes Only

document.addEventListener("DOMContentLoaded", function () {
  // Initialize the UI
  loadProfileList();

  // Event listeners
  document
    .getElementById("addCookieField")
    .addEventListener("click", addCookieField);
  document.getElementById("saveProfile").addEventListener("click", saveProfile);
  document
    .getElementById("loadProfile")
    .addEventListener("click", loadSelectedProfile);
  document
    .getElementById("deleteProfile")
    .addEventListener("click", deleteSelectedProfile);
  document
    .getElementById("applyAndOpen")
    .addEventListener("click", applyAndOpenTab);
  document
    .getElementById("exportProfiles")
    .addEventListener("click", exportProfilesToJson);
  document
    .getElementById("importProfiles")
    .addEventListener("click", function () {
      document.getElementById("importFile").click();
    });
  document
    .getElementById("importFile")
    .addEventListener("change", importProfilesFromJson);

  // Add first cookie field if none exist
  if (document.querySelectorAll(".cookie-entry").length === 0) {
    addCookieField();
  }

  // Add event delegation for remove buttons
  document
    .getElementById("cookieFields")
    .addEventListener("click", function (e) {
      if (e.target.classList.contains("remove-cookie")) {
        e.target.parentNode.remove();
      }
    });
});

// Add a new cookie input field
function addCookieField() {
  const cookieFields = document.getElementById("cookieFields");
  const cookieEntry = document.createElement("div");
  cookieEntry.className = "cookie-entry";
  cookieEntry.innerHTML = `
      <input type="text" class="cookie-name" placeholder="Cookie name">
      <input type="text" class="cookie-value" placeholder="Cookie value">
      <button class="remove-cookie">×</button>
    `;
  cookieFields.appendChild(cookieEntry);
}

// Save the current profile
function saveProfile() {
  const profileName = document.getElementById("profileName").value;
  if (!profileName) {
    alert("Please enter a profile name");
    return;
  }

  const domain = document.getElementById("domain").value;
  if (!domain) {
    alert("Please enter a domain");
    return;
  }

  const urlToOpen = document.getElementById("urlToOpen").value;
  if (!urlToOpen) {
    alert("Please enter a URL to open");
    return;
  }

  // Collect cookies
  const cookieEntries = document.querySelectorAll(".cookie-entry");
  const cookies = [];

  for (let entry of cookieEntries) {
    const name = entry.querySelector(".cookie-name").value;
    const value = entry.querySelector(".cookie-value").value;

    if (name && value) {
      cookies.push({ name, value });
    }
  }

  if (cookies.length === 0) {
    alert("Please add at least one cookie");
    return;
  }

  // Save to Chrome storage
  chrome.storage.sync.get("cookieProfiles", function (data) {
    const profiles = data.cookieProfiles || {};
    profiles[profileName] = { domain, urlToOpen, cookies };

    chrome.storage.sync.set({ cookieProfiles: profiles }, function () {
      alert("Profile saved successfully!");
      loadProfileList();
    });
  });
}

// Load the list of saved profiles
function loadProfileList() {
  const profileSelect = document.getElementById("profileSelect");

  // Clear existing options except the first one
  while (profileSelect.options.length > 1) {
    profileSelect.remove(1);
  }

  // Load profiles from storage
  chrome.storage.sync.get("cookieProfiles", function (data) {
    const profiles = data.cookieProfiles || {};

    for (let name in profiles) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      profileSelect.appendChild(option);
    }
  });
}

// Load a selected profile
function loadSelectedProfile() {
  const profileName = document.getElementById("profileSelect").value;
  if (!profileName) {
    alert("Please select a profile");
    return;
  }

  chrome.storage.sync.get("cookieProfiles", function (data) {
    const profiles = data.cookieProfiles || {};
    const profile = profiles[profileName];

    if (!profile) {
      alert("Profile not found");
      return;
    }

    // Fill the form with profile data
    document.getElementById("profileName").value = profileName;
    document.getElementById("domain").value = profile.domain;
    document.getElementById("urlToOpen").value = profile.urlToOpen;

    // Clear existing cookie fields
    const cookieFields = document.getElementById("cookieFields");
    cookieFields.innerHTML = "";

    // Add cookie fields for each cookie
    profile.cookies.forEach((cookie) => {
      const cookieEntry = document.createElement("div");
      cookieEntry.className = "cookie-entry";
      cookieEntry.innerHTML = `
          <input type="text" class="cookie-name" value="${escapeHtml(
            cookie.name
          )}" placeholder="Cookie name">
          <input type="text" class="cookie-value" value="${escapeHtml(
            cookie.value
          )}" placeholder="Cookie value">
          <button class="remove-cookie">×</button>
        `;
      cookieFields.appendChild(cookieEntry);
    });
  });
}

// Delete a selected profile
function deleteSelectedProfile() {
  const profileName = document.getElementById("profileSelect").value;
  if (!profileName) {
    alert("Please select a profile");
    return;
  }

  if (
    confirm(`Are you sure you want to delete the profile "${profileName}"?`)
  ) {
    chrome.storage.sync.get("cookieProfiles", function (data) {
      const profiles = data.cookieProfiles || {};
      delete profiles[profileName];

      chrome.storage.sync.set({ cookieProfiles: profiles }, function () {
        alert("Profile deleted successfully!");
        loadProfileList();
      });
    });
  }
}

// Apply cookies and open a new tab
function applyAndOpenTab() {
  const domain = document.getElementById("domain").value;
  const urlToOpen = document.getElementById("urlToOpen").value;

  if (!domain || !urlToOpen) {
    alert("Please enter a domain and URL");
    return;
  }

  // Collect cookies
  const cookieEntries = document.querySelectorAll(".cookie-entry");
  const cookies = [];

  for (let entry of cookieEntries) {
    const name = entry.querySelector(".cookie-name").value;
    const value = entry.querySelector(".cookie-value").value;

    if (name && value) {
      cookies.push({ name, value });
    }
  }

  if (cookies.length === 0) {
    alert("Please add at least one cookie");
    return;
  }

  // Set cookies
  let cookiesSet = 0;
  const totalCookies = cookies.length;

  for (let cookie of cookies) {
    chrome.cookies.set(
      {
        url: urlToOpen,
        domain: domain,
        name: cookie.name,
        value: cookie.value,
        path: "/",
      },
      function () {
        cookiesSet++;

        if (cookiesSet === totalCookies) {
          // All cookies set, open the tab
          chrome.tabs.create({ url: urlToOpen });
        }
      }
    );
  }
}

// Export all profiles to JSON file
function exportProfilesToJson() {
  chrome.storage.sync.get("cookieProfiles", function (data) {
    const profiles = data.cookieProfiles || {};

    // Create JSON string from profiles
    const jsonData = JSON.stringify(profiles, null, 2);

    // Create download link
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create and click download link
    const a = document.createElement("a");
    a.href = url;
    a.download = `cookie_profiles_${getCurrentDateTime()}.json`;
    document.body.appendChild(a);
    a.click();

    // Clean up
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  });
}

// Import profiles from JSON file
function importProfilesFromJson(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedProfiles = JSON.parse(e.target.result);

      // Validate the imported data
      if (typeof importedProfiles !== "object" || importedProfiles === null) {
        throw new Error("Invalid format: Expected an object");
      }

      // Merge with existing profiles
      chrome.storage.sync.get("cookieProfiles", function (data) {
        const currentProfiles = data.cookieProfiles || {};
        let newProfiles = 0;
        let updatedProfiles = 0;

        // Process each imported profile
        for (let profileName in importedProfiles) {
          const profile = importedProfiles[profileName];

          // Basic validation
          if (
            !profile.domain ||
            !profile.urlToOpen ||
            !Array.isArray(profile.cookies)
          ) {
            console.warn(`Skipping invalid profile: ${profileName}`);
            continue;
          }

          if (currentProfiles[profileName]) {
            updatedProfiles++;
          } else {
            newProfiles++;
          }

          currentProfiles[profileName] = profile;
        }

        // Save merged profiles
        chrome.storage.sync.set(
          { cookieProfiles: currentProfiles },
          function () {
            alert(
              `Import successful!\nAdded: ${newProfiles} new profiles\nUpdated: ${updatedProfiles} existing profiles`
            );
            loadProfileList();
          }
        );
      });
    } catch (error) {
      alert(`Error importing profiles: ${error.message}`);
    }

    // Reset the file input
    event.target.value = "";
  };

  reader.readAsText(file);
}

// Helper: Get current date time string
function getCurrentDateTime() {
  const now = new Date();
  return now.toISOString().replace(/[:.]/g, "-").substring(0, 19);
}

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
