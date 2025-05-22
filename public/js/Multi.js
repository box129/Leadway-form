/* To upload the file */
const inputFile = document.getElementById('file'); // Renamed 'input' to avoid conflict with potential HTMLInputElement type
const fileNameElement = document.getElementById('file-name');
const uploadBtn = document.getElementById('upload-btn');

// if (uploadBtn && inputFile) {
//     uploadBtn.addEventListener('click', () => inputFile.click());
// }

// if (inputFile && fileNameElement) {
//     inputFile.addEventListener('change', () => {
//         fileNameElement.textContent = inputFile.files[0]?.name || 'No file chosen';
//     });
// }

function setupUpload(fileId, btnId, nameId) {
  const input = document.getElementById(fileId);
  const btn = document.getElementById(btnId);
  const name = document.getElementById(nameId);

  btn?.addEventListener("click", () => input?.click());
  input?.addEventListener("change", () => {
    name.textContent = input.files[0]?.name || 'No file chosen';
  });
}

setupUpload("passport-file", "passport-upload-btn", "passport-file-name");
setupUpload("signature-file", "signature-upload-btn", "signature-file-name");


document.addEventListener("DOMContentLoaded", () => {

    const driverToggle = document.getElementById("driver"); // Use a more descriptive name
    const licenseToggle = document.getElementById("license");
    const licenseForm = document.getElementById("license-form"); // Changed variable name for consistency

    function toggleDriverLicenseForms() {
        // Ensure elements exist before toggling
        driverToggle?.classList.toggle("hidden");
        licenseToggle?.classList.toggle("hidden");
        licenseForm?.classList.toggle("hidden");
    }

    driverToggle?.addEventListener("click", toggleDriverLicenseForms);
    licenseToggle?.addEventListener("click", toggleDriverLicenseForms);


    // --- Fix for Add Beneficiary, Executive, Guardian (Un-nested) ---
    const addBeneficiaryButton = document.getElementById('add-beneficiary');
    if (addBeneficiaryButton) {
        addBeneficiaryButton.addEventListener('click', function(e) {
            e.preventDefault();
            const container = document.getElementById('beneficiaries-container');
            if (!container) return;
            const lastBeneficiary = container.querySelector('.beneficiary');
            if (!lastBeneficiary) return;

            const clone = lastBeneficiary.cloneNode(true); // Deep clone
            clone.querySelectorAll('input').forEach(input => input.value = '');
            clone.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            container.appendChild(clone);
        });
    }

    const addExecutiveButton = document.getElementById('add-executive');
    if (addExecutiveButton) {
        addExecutiveButton.addEventListener('click', function(e) {
            e.preventDefault();
            const container = document.getElementById('executive-container'); // Corrected container ID
            if (!container) return;
            const lastExecutive = container.querySelector('.executive');
            if (!lastExecutive) return;

            const clone = lastExecutive.cloneNode(true); // Deep clone
            clone.querySelectorAll('input').forEach(input => input.value = '');
            clone.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            container.appendChild(clone);
        });
    }

    const addGuardianButton = document.getElementById('add-guardian');
    if (addGuardianButton) {
        addGuardianButton.addEventListener('click', function(e) {
            e.preventDefault();
            const container = document.getElementById('guardian-container'); // Corrected container ID
            if (!container) return;
            const lastGuardian = container.querySelector('.guardian'); // Corrected variable name
            if (!lastGuardian) return;

            const clone = lastGuardian.cloneNode(true); // Deep clone
            clone.querySelectorAll('input').forEach(input => input.value = '');
            clone.querySelectorAll('select').forEach(select => select.selectedIndex = 0);
            container.appendChild(clone);
        });
    }

    // --- Fix for Toggle Sections (SVG buttons) ---
    const sections = [
        { buttonId: "toggleButton1", containerId: "formContainer1" },
        { buttonId: "toggleButton2", containerId: "formContainer2" },
        { buttonId: "toggleButton3", containerId: "formContainer3" },
        { buttonId: "toggleButton4", containerId: "formContainer4" },
        { buttonId: "toggleButton5", containerId: "formContainer5" },
        { buttonId: "toggleButton6", containerId: "formContainer6" },
        { buttonId: "toggleButton7", containerId: "formContainer7" }
    ];

    const svgShow = `
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
    <circle cx="11.5" cy="11.5" r="11.5" fill="#FF6606"/>
    <path d="M11 16L17.0622 10H4.93782L11 16Z" fill="white"/>
    </svg>
    `;

    const svgHide = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="23" viewBox="0 0 24 23" fill="none">
    <circle cx="11.5" cy="11.5" r="11.5" transform="matrix(1 0 0 -1 0.5 23)" fill="#FF6606"/>
    <path d="M11.5 7L17.5622 13H5.43782L11.5 7Z" fill="white"/>
    </svg>`;

    sections.forEach(section => {
        const button = document.getElementById(section.buttonId);
        const container = document.getElementById(section.containerId);

        if (button && container) {
            // Set initial SVG state
            button.innerHTML = container.classList.contains("hidden") ? svgShow : svgHide;

            button.addEventListener("click", function(e) {
                e.preventDefault();
                container.classList.toggle("hidden");
                // Update SVG based on new state
                button.innerHTML = container.classList.contains("hidden") ? svgShow : svgHide;
            });
        } else {
            if (!button) console.warn(`Button with ID ${section.buttonId} not found.`);
            if (!container) console.warn(`Container with ID ${section.containerId} not found.`);
        }
    });
});