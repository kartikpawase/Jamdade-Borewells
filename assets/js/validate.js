/**
 * ============================================================
 *  Jamdade Borewells — Form Validation Engine (Pure JS)
 * ============================================================
 *  • Uses document.getElementById() for all element access
 *  • Regex-based validation for name, mobile, password
 *  • Real-time (oninput) + submit-time validation
 *  • Dynamic error messages below each input
 *  • Red border on error, green border on valid
 *  • Prevents form submission when any field is invalid
 * ============================================================
 */

(function () {
  "use strict";

  // ── Regex Patterns ──────────────────────────────────────────
  const REGEX_NAME   = /^[A-Za-z ]+$/;       // Only letters & spaces
  const REGEX_MOBILE = /^[0-9]{10}$/;         // Exactly 10 digits
  const MIN_PASSWORD_LENGTH = 6;

  // ── Utility: Create / Get error span below an input ─────────
  function getOrCreateError(input) {
    let errorSpan = input.parentElement.querySelector(".jb-error-msg");
    if (!errorSpan) {
      errorSpan = document.createElement("span");
      errorSpan.className = "jb-error-msg";
      // Insert after the input (or after the wrapper div if icon exists)
      input.parentElement.appendChild(errorSpan);
    }
    return errorSpan;
  }

  // ── Utility: Show error on a field ──────────────────────────
  function showError(input, message) {
    const errorSpan = getOrCreateError(input);
    errorSpan.textContent = message;
    errorSpan.classList.add("jb-error-visible");

    // Add error styling to input
    input.classList.add("jb-input-error");
    input.classList.remove("jb-input-valid");
  }

  // ── Utility: Clear error on a field ─────────────────────────
  function clearError(input) {
    const errorSpan = getOrCreateError(input);
    errorSpan.textContent = "";
    errorSpan.classList.remove("jb-error-visible");

    // Add valid styling to input
    input.classList.remove("jb-input-error");
    if (input.value.trim().length > 0) {
      input.classList.add("jb-input-valid");
    } else {
      input.classList.remove("jb-input-valid");
    }
  }

  // ── Validate a single field ─────────────────────────────────
  // Returns true if valid, false if invalid
  function validateField(input, type) {
    const value = input.value.trim();

    // Rule 1: Empty check (applies to ALL fields)
    if (value === "") {
      showError(input, "Please enter this field");
      return false;
    }

    // Rule 2: Type-specific validation
    switch (type) {
      case "name":
        if (!REGEX_NAME.test(value)) {
          showError(input, "Only letters are allowed");
          return false;
        }
        break;

      case "mobile":
        if (!REGEX_MOBILE.test(value)) {
          showError(input, "Enter a valid 10-digit mobile number");
          return false;
        }
        break;

      case "password":
        if (value.length < MIN_PASSWORD_LENGTH) {
          showError(input, "Password must be at least 6 characters");
          return false;
        }
        break;

      case "required":
        // Already handled by empty check above
        break;

      default:
        break;
    }

    // All checks passed – clear any existing error
    clearError(input);
    return true;
  }

  // ── Attach real-time validation (oninput) to a field ────────
  function attachRealtimeValidation(input, type) {
    if (!input) return;

    // Validate on every keystroke
    input.addEventListener("input", function () {
      validateField(input, type);
    });

    // Also validate on blur (when user tabs away)
    input.addEventListener("blur", function () {
      validateField(input, type);
    });

    // For mobile: block non-numeric keys at input level
    if (type === "mobile") {
      input.addEventListener("keypress", function (e) {
        // Allow control keys (backspace, delete, tab, arrows)
        if (e.ctrlKey || e.metaKey) return;
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/[0-9]/.test(char)) {
          e.preventDefault();
        }
      });

      // Set maxlength attribute
      input.setAttribute("maxlength", "10");
    }

    // For name: block numbers and special chars at input level
    if (type === "name") {
      input.addEventListener("keypress", function (e) {
        if (e.ctrlKey || e.metaKey) return;
        const char = String.fromCharCode(e.which || e.keyCode);
        if (!/[A-Za-z ]/.test(char)) {
          e.preventDefault();
        }
      });
    }
  }

  // ────────────────────────────────────────────────────────────
  //  PAGE-SPECIFIC VALIDATORS
  // ────────────────────────────────────────────────────────────

  /**
   * ┌─────────────────────────────────────────────────────────┐
   * │  LOGIN PAGE VALIDATION                                  │
   * │  Fields: #username (name type), #password               │
   * └─────────────────────────────────────────────────────────┘
   */
  function initLoginValidation() {
    const form     = document.getElementById("login-form");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (!form || !username || !password) return;

    // Attach real-time validation
    attachRealtimeValidation(username, "required");
    attachRealtimeValidation(password, "password");

    // Intercept the existing submit handler by adding validation FIRST
    // We capture submit at the capture phase so we run BEFORE other handlers
    form.addEventListener(
      "submit",
      function (e) {
        let isFormValid = true;

        if (!validateField(username, "required")) isFormValid = false;
        if (!validateField(password, "password")) isFormValid = false;

        if (!isFormValid) {
          e.preventDefault();
          e.stopImmediatePropagation(); // Stop the fetch handler from running
        }
      },
      true // <-- capture phase
    );
  }

  /**
   * ┌─────────────────────────────────────────────────────────┐
   * │  BOOKING PAGE VALIDATION                                │
   * │  Fields: #booking-name, #booking-phone,                 │
   * │          #booking-service, #booking-date, #booking-addr  │
   * └─────────────────────────────────────────────────────────┘
   */
  function initBookingValidation() {
    const form        = document.getElementById("booking-form");
    const nameInput   = document.getElementById("booking-name");
    const phoneInput  = document.getElementById("booking-phone");
    const serviceInput= document.getElementById("booking-service");
    const dateInput   = document.getElementById("booking-date");
    const addressInput= document.getElementById("booking-address");

    if (!form) return;

    // Attach real-time validation to fields that exist
    if (nameInput)    attachRealtimeValidation(nameInput, "name");
    if (phoneInput)   attachRealtimeValidation(phoneInput, "mobile");
    if (serviceInput) attachRealtimeValidation(serviceInput, "required");
    if (dateInput)    attachRealtimeValidation(dateInput, "required");
    if (addressInput) attachRealtimeValidation(addressInput, "required");

    // Submit validation (capture phase)
    form.addEventListener(
      "submit",
      function (e) {
        let isFormValid = true;

        if (nameInput    && !validateField(nameInput, "name"))       isFormValid = false;
        if (phoneInput   && !validateField(phoneInput, "mobile"))    isFormValid = false;
        if (serviceInput && !validateField(serviceInput, "required"))isFormValid = false;
        if (dateInput    && !validateField(dateInput, "required"))   isFormValid = false;
        if (addressInput && !validateField(addressInput, "required"))isFormValid = false;

        if (!isFormValid) {
          e.preventDefault();
          e.stopImmediatePropagation();

          // Scroll to first error
          const firstError = form.querySelector(".jb-input-error");
          if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            firstError.focus();
          }
        }
      },
      true
    );
  }

  /**
   * ┌─────────────────────────────────────────────────────────┐
   * │  BILLING PAGE VALIDATION                                │
   * │  Fields: #input-name, #input-mobile,                    │
   * │          #input-depth, #input-rate                       │
   * └─────────────────────────────────────────────────────────┘
   */
  function initBillingValidation() {
    const nameInput   = document.getElementById("input-name");
    const mobileInput = document.getElementById("input-mobile");
    const depthInput  = document.getElementById("input-depth");
    const rateInput   = document.getElementById("input-rate");

    // Attach real-time validation
    if (nameInput)   attachRealtimeValidation(nameInput, "name");
    if (mobileInput) attachRealtimeValidation(mobileInput, "mobile");
    if (depthInput)  attachRealtimeValidation(depthInput, "required");
    if (rateInput)   attachRealtimeValidation(rateInput, "required");

    // Hook into the "Save Invoice" button for billing
    const saveBtn = document.getElementById("btn-save-invoice");
    if (saveBtn) {
      // Wrap the existing onclick
      const originalOnclick = saveBtn.onclick;
      saveBtn.onclick = function (e) {
        let isFormValid = true;

        if (nameInput   && !validateField(nameInput, "name"))      isFormValid = false;
        if (mobileInput && !validateField(mobileInput, "mobile"))  isFormValid = false;
        if (depthInput  && !validateField(depthInput, "required")) isFormValid = false;
        if (rateInput   && !validateField(rateInput, "required"))  isFormValid = false;

        if (!isFormValid) {
          e.preventDefault();
          // Scroll to first error
          const firstError = document.querySelector(".jb-input-error");
          if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
            firstError.focus();
          }
          return false; // Don't call original handler
        }

        // If valid, call original save handler
        if (typeof originalOnclick === "function") {
          return originalOnclick.call(this, e);
        }
      };
    }
  }

  // ────────────────────────────────────────────────────────────
  //  INITIALIZATION — Auto-detect which page we're on
  // ────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    // Login page
    if (document.getElementById("login-form")) {
      initLoginValidation();
    }

    // Booking page
    if (document.getElementById("booking-form")) {
      initBookingValidation();
    }

    // Billing page
    if (document.getElementById("input-name") && document.getElementById("btn-save-invoice")) {
      initBillingValidation();
    }
  });
})();
