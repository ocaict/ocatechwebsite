/**
 * OCATECH Digital Solutions — Contact & Application Form Handler
 * Validates inputs and submits inquiries to /api/contact (Resend Email)
 */

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  const submitBtn = document.getElementById('submitBtn');
  const alertSuccess = document.getElementById('formSuccessAlert');
  const alertError = document.getElementById('formErrorAlert');

  // Input fields
  const nameInput = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddress');
  const phoneInput = document.getElementById('phoneNumber');
  const programmeSelect = document.getElementById('programmeInterest');
  const messageInput = document.getElementById('message');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Reset previous alerts & validation styles
    hideAlerts();
    clearFieldErrors();

    // Validate fields
    const isValid = validateForm();
    if (!isValid) return;

    // Set loading state
    setSubmitting(true);

    const formData = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      programme: programmeSelect.value,
      message: messageInput.value.trim()
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        showSuccess();
        contactForm.reset();
      } else {
        showError(data.error || 'Failed to deliver your message. Please try again or reach out on WhatsApp.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      showError('Network connection issue. Please contact us directly via WhatsApp (08165321429) or call 07062620862.');
    } finally {
      setSubmitting(false);
    }
  });

  function validateForm() {
    let valid = true;

    // Full Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setFieldError(nameInput, 'nameError', 'Please enter your full name');
      valid = false;
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      setFieldError(emailInput, 'emailError', 'Please enter a valid email address');
      valid = false;
    }

    // Phone Number (Nigerian & International format)
    const cleanPhone = phoneInput.value.replace(/[\s\-\(\)]/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setFieldError(phoneInput, 'phoneError', 'Please enter a valid phone or WhatsApp number');
      valid = false;
    }

    // Programme / Service of interest
    if (!programmeSelect.value) {
      setFieldError(programmeSelect, 'programmeError', 'Please select a programme or service');
      valid = false;
    }

    // Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 5) {
      setFieldError(messageInput, 'messageError', 'Please tell us a bit about your goals or questions (min 5 chars)');
      valid = false;
    }

    return valid;
  }

  function setFieldError(inputEl, errorId, message) {
    inputEl.classList.add('is-invalid');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
  }

  function clearFieldErrors() {
    const inputs = [nameInput, emailInput, phoneInput, programmeSelect, messageInput];
    inputs.forEach(input => {
      if (input) input.classList.remove('is-invalid');
    });

    const errorSpans = document.querySelectorAll('.field-error');
    errorSpans.forEach(span => span.textContent = '');
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    if (isSubmitting) {
      if (btnText) btnText.textContent = 'Sending Application...';
      if (btnSpinner) btnSpinner.style.display = 'inline-block';
    } else {
      if (btnText) btnText.textContent = 'Submit Application / Inquiry';
      if (btnSpinner) btnSpinner.style.display = 'none';
    }
  }

  function showSuccess() {
    if (alertSuccess) {
      alertSuccess.style.display = 'flex';
      alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function showError(msg) {
    if (alertError) {
      alertError.textContent = msg;
      alertError.style.display = 'flex';
      alertError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function hideAlerts() {
    if (alertSuccess) alertSuccess.style.display = 'none';
    if (alertError) alertError.style.display = 'none';
  }
});
