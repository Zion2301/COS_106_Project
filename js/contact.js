/* =========================================================
   contact.js – Contact form validation

   Rules checked by JavaScript (the form uses "novalidate"):
   1. No field may be empty
   2. Email must match a valid email pattern (regex)
   3. Phone number may contain ONLY digits
   Errors appear under each field; a success message is shown
   when everything is valid, and the form is reset.
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 1. DOM references ---------- */
  const form = document.getElementById("contact-form");
  const statusBox = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");

  if (!form) {
    return;
  }

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    message: document.getElementById("message")
  };


  /* ---------- 2. Regular expressions ---------- */

  // something@something.something (no spaces, a dot in the domain)
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  // One or more digits from start (^) to end ($) – nothing else allowed
  const DIGITS_ONLY_PATTERN = /^\d+$/;


  /* ---------- 3. Validation rules ---------- */

  // Each function returns an error message, or "" if the value is valid
  const validators = {
    name: function (value) {
      if (value === "") return "Please enter your name.";
      if (value.length < 2) return "Your name must be at least 2 characters.";
      return "";
    },

    email: function (value) {
      if (value === "") return "Please enter your email address.";
      if (!EMAIL_PATTERN.test(value)) return "Please enter a valid email address, e.g. name@example.com.";
      return "";
    },

    phone: function (value) {
      if (value === "") return "Please enter your phone number.";
      if (!DIGITS_ONLY_PATTERN.test(value)) return "Phone number must contain digits only (0–9), with no spaces, dashes or +.";
      if (value.length < 7 || value.length > 15) return "Phone number must be between 7 and 15 digits long.";
      return "";
    },

    message: function (value) {
      if (value === "") return "Please enter a message.";
      if (value.length < 10) return "Your message must be at least 10 characters.";
      return "";
    }
  };


  /* ---------- 4. Showing and clearing errors ---------- */

  // Display (or clear) the inline error message under one field
  function setFieldState(input, message) {
    const group = input.closest(".form-group");
    const errorEl = group.querySelector(".error-message");

    errorEl.textContent = message;
    group.classList.toggle("has-error", message !== "");
    group.classList.toggle("is-valid", message === "");
    input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  }

  // Validate one field and update its error message; returns true if valid
  function validateField(name) {
    const input = fields[name];
    const message = validators[name](input.value.trim());
    setFieldState(input, message);
    return message === "";
  }

  // Validate every field; returns true only if ALL are valid
  function validateForm() {
    let allValid = true;
    let firstInvalid = null;

    Object.keys(fields).forEach(function (name) {
      const valid = validateField(name);
      if (!valid) {
        allValid = false;
        if (!firstInvalid) firstInvalid = fields[name];
      }
    });

    // Move keyboard focus to the first problem so it's easy to fix
    if (firstInvalid) {
      firstInvalid.focus();
    }
    return allValid;
  }

  // Remove all error/success styling (used after reset)
  function clearAllStates() {
    Object.keys(fields).forEach(function (name) {
      const group = fields[name].closest(".form-group");
      group.classList.remove("has-error", "is-valid");
      group.querySelector(".error-message").textContent = "";
      fields[name].removeAttribute("aria-invalid");
    });
  }

  // Show the success / error banner above the form
  function showStatus(type, message) {
    statusBox.className = "form-status " + type;
    statusBox.textContent = message;
  }

  function hideStatus() {
    statusBox.className = "form-status";
    statusBox.textContent = "";
  }


  /* ---------- 5. Event handling ---------- */

  // INPUT + BLUR: re-check a field live once the user has interacted with it
  Object.keys(fields).forEach(function (name) {
    const input = fields[name];

    input.addEventListener("blur", function () {
      if (input.value.trim() !== "") {
        validateField(name);
      }
    });

    input.addEventListener("input", function () {
      hideStatus();
      // Only update live if the field is currently showing an error/success state
      const group = input.closest(".form-group");
      if (group.classList.contains("has-error") || group.classList.contains("is-valid")) {
        validateField(name);
      }
    });
  });

  // SUBMIT: validate everything, then simulate sending the message
  form.addEventListener("submit", function (event) {
    event.preventDefault();                 // stop the page from reloading

    if (!validateForm()) {
      showStatus("error", "Please fix the highlighted fields and try again.");
      return;
    }

    const senderName = fields.name.value.trim();

    // Simulate a network request with a short delay
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";

    setTimeout(function () {
      form.reset();                        // fires "reset", which clears old messages
      showStatus("success", "Thank you, " + senderName + "! Your message has been sent. I'll get back to you soon.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
      statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 1000);
  });

  // RESET ("Clear Form" button): clear all messages too
  form.addEventListener("reset", function () {
    clearAllStates();
    hideStatus();
  });
})();
