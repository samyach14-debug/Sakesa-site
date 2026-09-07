(function () {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  const year = document.getElementById("jaar");
  const form = document.getElementById("contactformulier");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const closeNav = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Menu openen");
    nav.classList.remove("is-open");
  };

  const openNav = () => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Menu sluiten");
    nav.classList.add("is-open");
  };

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav();
      else openNav();
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealTargets = document.querySelectorAll(
    ".service-card, .steps li, .work-card, .why-list li"
  );

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("reveal");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("reveal"));
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phonePattern = /^[0-9+\s()-]{8,20}$/;

  const setError = (fieldName, message) => {
    const input = form.querySelector("#" + fieldName);
    const error = form.querySelector('[data-for="' + fieldName + '"]');
    if (!input || !error) return;
    input.closest(".field").classList.add("is-invalid");
    error.hidden = false;
    error.textContent = message;
    input.setAttribute("aria-invalid", "true");
  };

  const clearError = (fieldName) => {
    const input = form.querySelector("#" + fieldName);
    const error = form.querySelector('[data-for="' + fieldName + '"]');
    if (!input || !error) return;
    input.closest(".field").classList.remove("is-invalid");
    error.hidden = true;
    error.textContent = "";
    input.removeAttribute("aria-invalid");
  };

  const validate = () => {
    let valid = true;
    const naam = form.naam.value.trim();
    const email = form.email.value.trim();
    const telefoon = form.telefoon.value.trim();
    const bericht = form.bericht.value.trim();

    ["naam", "email", "telefoon", "bericht"].forEach(clearError);

    if (naam.length < 2) {
      setError("naam", "Vul je naam in (minstens 2 tekens).");
      valid = false;
    }

    if (!emailPattern.test(email)) {
      setError("email", "Vul een geldig e-mailadres in.");
      valid = false;
    }

    if (telefoon && !phonePattern.test(telefoon)) {
      setError("telefoon", "Gebruik een geldig telefoonnummer, of laat dit veld leeg.");
      valid = false;
    }

    if (bericht.length < 10) {
      setError("bericht", "Schrijf kort wat je nodig hebt (minstens 10 tekens).");
      valid = false;
    }

    return valid;
  };

  if (form) {
    form.addEventListener("input", (event) => {
      const target = event.target;
      if (target && target.id) clearError(target.id);
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validate()) {
        const firstInvalid = form.querySelector("[aria-invalid='true']");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /*
       * TODO: koppel hier je verzendlogica.
       * Voorbeeld (niet actief):
       * fetch("https://jouw-endpoint", {
       *   method: "POST",
       *   headers: { "Content-Type": "application/json" },
       *   body: JSON.stringify(Object.fromEntries(new FormData(form)))
       * })
       */

      const wrap = form.closest(".contact-form-wrap");
      const success = document.getElementById("form-success");

      if (wrap) wrap.classList.add("is-sent");
      form.hidden = true;

      if (success) {
        success.hidden = false;
        success.focus();
      }
    });
  }
})();
