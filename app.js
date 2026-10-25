"use strict";

const ACCESS_PASSWORD = "KYC123";

const gate = document.getElementById("gate");
const gateMsg = document.getElementById("gateMsg");
const passwordInput = document.getElementById("password");
const unlockBtn = document.getElementById("unlockBtn");
const formCard = document.getElementById("kycForm");
const kycForm = document.getElementById("kyc");
const resultCard = document.getElementById("result");
const banner = document.getElementById("banner");

const fields = {
  name: document.getElementById("name"),
  dob: document.getElementById("dob"),
  aadhaar: document.getElementById("aadhaar"),
  pan: document.getElementById("pan"),
};

const errorLabels = {
  name: document.getElementById("nameError"),
  dob: document.getElementById("dobError"),
  aadhaar: document.getElementById("aadhaarError"),
  pan: document.getElementById("panError"),
};

/* ---------- Stage 1: access gate ---------- */

function unlock() {
  if (passwordInput.value === ACCESS_PASSWORD) {
    gate.classList.add("hidden");
    formCard.classList.remove("hidden");
    fields.name.focus();
  } else {
    gateMsg.classList.remove("hidden");
    passwordInput.value = "";
    passwordInput.focus();
  }
}

unlockBtn.addEventListener("click", unlock);
passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") unlock();
});

/* ---------- Stage 2: verification ---------- */

function setFieldError(key, message) {
  fields[key].classList.add("invalid");
  errorLabels[key].textContent = message;
}

function resetErrors() {
  Object.keys(fields).forEach((key) => {
    fields[key].classList.remove("invalid");
    errorLabels[key].textContent = "";
  });
  banner.textContent = "";
  banner.classList.add("hidden");
  banner.classList.remove("error", "success");
}

function calculateAge(dob) {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

kycForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetErrors();

  const profile = {};
  let firstError = "";

  const flag = (key, message) => {
    setFieldError(key, message);
    if (!firstError) firstError = message;
  };

  // Same order of checks as the Java console app: name → DOB → Aadhaar → PAN → age.
  profile.name = fields.name.value.trim();
  if (!/^[A-Za-z ]+$/.test(profile.name)) {
    flag("name", "Name must contain only letters and spaces.");
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  profile.dob = fields.dob.value ? new Date(fields.dob.value + "T00:00:00") : null;
  if (!profile.dob || Number.isNaN(profile.dob.getTime())) {
    flag("dob", "Invalid DOB format. Use YYYY-MM-DD.");
  } else if (profile.dob > todayStart) {
    flag("dob", "Date of birth cannot be in the future.");
  }

  profile.aadhaar = fields.aadhaar.value.replace(/[ -]/g, "");
  if (!/^[0-9]{12}$/.test(profile.aadhaar)) {
    flag("aadhaar", "Aadhaar must contain exactly 12 digits.");
  }

  profile.pan = fields.pan.value.trim().toUpperCase();
  if (profile.pan.length !== 10) {
    flag("pan", "PAN must be 10 characters.");
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(profile.pan)) {
    flag("pan", "PAN must be 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F).");
  }

  if (firstError) {
    showFailure(firstError);
    return;
  }

  const age = calculateAge(profile.dob);
  if (age < 18) {
    const message = `Applicant is ${age} years old. Parent/guardian required.`;
    setFieldError("dob", message);
    showFailure(message);
    return;
  }

  showSuccess(profile, age);
});

function showFailure(message) {
  banner.textContent = "Verification Failed: " + message;
  banner.classList.remove("hidden");
  banner.classList.add("error");
}

function showSuccess(profile, age) {
  formCard.classList.add("hidden");
  resultCard.classList.remove("hidden");
  resultCard.innerHTML = `
    <div class="success-head">
      <div class="badge">✓</div>
      <h1>KYC Verification Successful!</h1>
    </div>
    <dl class="details">
      <div><dt>Name</dt><dd>${escapeHtml(profile.name.toUpperCase())}</dd></div>
      <div><dt>Age</dt><dd>${age}</dd></div>
      <div><dt>Aadhaar</dt><dd>XXXX-XXXX-${profile.aadhaar.substring(8)}</dd></div>
      <div><dt>PAN</dt><dd>${escapeHtml(profile.pan)}</dd></div>
    </dl>
    <button id="againBtn" class="btn ghost">Verify another applicant</button>
  `;
  document.getElementById("againBtn").addEventListener("click", () => {
    kycForm.reset();
    resetErrors();
    resultCard.classList.add("hidden");
    formCard.classList.remove("hidden");
    fields.name.focus();
  });
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));
}
