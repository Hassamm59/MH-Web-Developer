document.documentElement.classList.add("js-enabled");

document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");

  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      primaryNav.classList.toggle("is-open", !isOpen);
    });

    primaryNav.addEventListener("click", (event) => {
      if (event.target.closest("a")) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        primaryNav.classList.remove("is-open");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        primaryNav.classList.remove("is-open");
        menuToggle.focus();
      }
    });
  }

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  const whatsappLink = document.createElement("a");
  whatsappLink.className = "whatsapp-float";
  whatsappLink.href = "https://wa.me/923117881821?text=Hello%20MH%20Web%20Developer%2C%20I%27d%20like%20to%20discuss%20a%20website%20project.";
  whatsappLink.target = "_blank";
  whatsappLink.rel = "noopener noreferrer";
  whatsappLink.setAttribute("aria-label", "Start a WhatsApp project inquiry");
  whatsappLink.innerHTML = '<span aria-hidden="true">◉</span><span>WhatsApp</span>';
  document.body.append(whatsappLink);

  const backToTop = document.createElement("a");
  backToTop.className = "back-to-top-floating";
  backToTop.href = "#main";
  backToTop.setAttribute("aria-label", "Back to top");
  backToTop.textContent = "↑";
  document.body.append(backToTop);
  const updateBackToTop = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > 500);
  };
  window.addEventListener("scroll", updateBackToTop, { passive: true });
  updateBackToTop();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const typedText = document.querySelector("[data-typing-text]");
  if (typedText) {
    const text = typedText.dataset.typingText;
    if (reduceMotion) {
      typedText.textContent = text;
    } else {
      let characterCount = 0;
      const typeNextCharacter = () => {
        typedText.textContent = text.slice(0, characterCount);
        if (characterCount < text.length) {
          characterCount += 1;
          window.setTimeout(typeNextCharacter, 38);
        }
      };
      typeNextCharacter();
    }
  }

  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const counters = document.querySelectorAll("[data-counter]");
  const showCounterValue = (counter, value) => {
    counter.textContent = String(value).padStart(2, "0");
  };
  const animateCounter = (counter) => {
    const target = Number(counter.dataset.counter);
    const startTime = performance.now();
    const duration = 800;
    const tick = (time) => {
      const progress = Math.min((time - startTime) / duration, 1);
      showCounterValue(counter, Math.round(target * progress));
      if (progress < 1) window.requestAnimationFrame(tick);
    };
    window.requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window && !reduceMotion) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach((counter) => showCounterValue(counter, Number(counter.dataset.counter)));
  }

  const filters = document.querySelectorAll("[data-filter]");
  const projects = document.querySelectorAll(".project-card[data-category]");
  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.dataset.filter;
      filters.forEach((button) => {
        const selected = button === filter;
        button.classList.toggle("is-active", selected);
        button.setAttribute("aria-pressed", String(selected));
      });
      projects.forEach((project) => {
        project.hidden = category !== "all" && project.dataset.category !== category;
      });
    });
  });

  const previewDialog = document.querySelector(".preview-dialog");
  if (previewDialog) {
    const previewTitle = previewDialog.querySelector("#preview-title");
    const previewDescription = previewDialog.querySelector("#preview-description");
    const previewImage = previewDialog.querySelector("#preview-image");
    previewDialog.querySelector(".dialog-close").addEventListener("click", () => previewDialog.close());
    previewDialog.addEventListener("click", (event) => {
      if (event.target === previewDialog) previewDialog.close();
    });
    document.querySelectorAll("[data-preview]").forEach((button) => {
      button.addEventListener("click", () => {
        const projectImage = button.closest(".project-card").querySelector(".project-art img");
        previewTitle.textContent = button.dataset.preview;
        previewDescription.textContent = button.dataset.description;
        previewImage.src = projectImage.src;
        previewImage.alt = projectImage.alt;
        previewDialog.showModal();
      });
    });
  }

  const contactForm = document.querySelector("#contact-form");
  if (contactForm) {
    const status = document.querySelector("#form-status");
    const submitButton = contactForm.querySelector('[type="submit"]');
    const fields = [...contactForm.querySelectorAll("input, textarea, select")];
    const params = new URLSearchParams(window.location.search);
    const requestedService = params.get("service");
    if (requestedService) {
      const serviceOption = [...contactForm.elements.service.options].find(
        (option) => option.value.toLowerCase() === requestedService.toLowerCase()
      );
      if (serviceOption) contactForm.elements.service.value = serviceOption.value;
    }

    const validateField = (field) => {
      const error = field.parentElement.querySelector(".field-error");
      if (error) {
        field.setAttribute("aria-invalid", String(!field.validity.valid));
        if (field.validity.valueMissing) error.textContent = "Please fill in this field.";
        else if (field.validity.typeMismatch) error.textContent = "Enter a valid email address.";
        else if (field.validity.tooShort) error.textContent = `Please enter at least ${field.minLength} characters.`;
        else error.textContent = "";
      }
      return field.validity.valid;
    };

    fields.forEach((field) => {
      field.addEventListener("blur", () => validateField(field));
      field.addEventListener("input", () => {
        if (field.hasAttribute("aria-invalid")) validateField(field);
        status.classList.remove("is-error");
        status.classList.remove("is-success");
        status.textContent = "To receive inquiries, replace YOUR_FORM_ID in this form with your Formspree form ID. No message will be sent until configured.";
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const isValid = fields.map(validateField).every(Boolean);
      if (!isValid) {
        status.classList.remove("is-success");
        status.classList.add("is-error");
        status.textContent = "Please correct the highlighted fields. No message has been sent.";
        contactForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }
      const endpoint = contactForm.dataset.formspreeEndpoint;
      if (!/^https:\/\/formspree\.io\/f\/[A-Za-z0-9]+$/.test(endpoint || "")) {
        status.classList.remove("is-success");
        status.classList.add("is-error");
        status.textContent = "This form is not configured yet, so your request was not sent. Replace YOUR_FORM_ID with your Formspree form ID, or contact me by email.";
        return;
      }

      submitButton.disabled = true;
      submitButton.dataset.originalText = submitButton.textContent.trim();
      submitButton.textContent = "Sending request...";
      status.classList.remove("is-error", "is-success");
      status.textContent = "Sending your project request...";
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: new FormData(contactForm),
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          status.classList.add("is-error");
          status.textContent = "Your request could not be sent. Please try again or email me directly.";
          return;
        }
        contactForm.reset();
        status.classList.add("is-success");
        status.textContent = "Thanks for your inquiry. Your project request was sent successfully.";
      } catch (error) {
        console.error("Project inquiry submission failed:", error);
        status.classList.add("is-error");
        status.textContent = "A network error prevented your request from being sent. Please try again or email me directly.";
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = submitButton.dataset.originalText;
      }
    });
  }
});