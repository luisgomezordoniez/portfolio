const CONTACT_MODE = "mailto"; // "mailto" | "formspree" | "netlify"
const FORMSPREE_ENDPOINT = ""; // e.g. https://formspree.io/f/xxxxxxx

function qs(sel, root = document) {
  return root.querySelector(sel);
}

function setStatus(kind, message) {
  const el = qs("#form-status");
  if (!el) return;
  el.classList.remove("success", "error");
  el.classList.add(kind);
  el.textContent = message;
}

function clearStatus() {
  const el = qs("#form-status");
  if (!el) return;
  el.classList.remove("success", "error");
  el.textContent = "";
  el.style.display = "none";
  requestAnimationFrame(() => {
    el.style.display = "";
  });
}

function toggleMobileNav() {
  const btn = qs(".nav-toggle");
  const panel = qs("#mobile-nav");
  if (!btn || !panel) return;

  const expanded = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!expanded));
  panel.hidden = expanded;
}

function closeMobileNav() {
  const btn = qs(".nav-toggle");
  const panel = qs("#mobile-nav");
  if (!btn || !panel) return;
  btn.setAttribute("aria-expanded", "false");
  panel.hidden = true;
}

function buildMailto({ name, email, type, message }) {
  const to = "luis.gomez.ordoniez@gmail.com";
  const subject = `[Portfolio] ${type}, ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\nType: ${type}\n\n${message}`;
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

async function submitFormspree(payload) {
  if (!FORMSPREE_ENDPOINT) {
    throw new Error("Missing Formspree endpoint. Set FORMSPREE_ENDPOINT in script.js.");
  }

  const res = await fetch(FORMSPREE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    let detail = "";
    try {
      const data = await res.json();
      detail = data?.error || data?.message || "";
    } catch {
      // ignore
    }
    throw new Error(detail || `Request failed (${res.status})`);
  }
}

function applyNetlifyAttributes(formEl) {
  formEl.setAttribute("name", "contact");
  formEl.setAttribute("method", "POST");
  formEl.setAttribute("data-netlify", "true");
  formEl.setAttribute("netlify-honeypot", "bot-field");

  if (!qs('input[name="form-name"]', formEl)) {
    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.name = "form-name";
    hidden.value = "contact";
    formEl.appendChild(hidden);
  }

  if (!qs('input[name="bot-field"]', formEl)) {
    const hp = document.createElement("input");
    hp.type = "text";
    hp.name = "bot-field";
    hp.tabIndex = -1;
    hp.autocomplete = "off";
    hp.style.position = "absolute";
    hp.style.left = "-10000px";
    formEl.appendChild(hp);
  }
}

function wireNav() {
  const btn = qs(".nav-toggle");
  const mobile = qs("#mobile-nav");
  if (!btn || !mobile) return;

  btn.addEventListener("click", toggleMobileNav);
  mobile.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === "A") closeMobileNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileNav();
  });
}

function wireYear() {
  const el = qs("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function wireInterestDescriptions() {
  const desc = qs("#interest-description");
  const pills = Array.from(document.querySelectorAll(".interest-pill"));
  if (!desc || pills.length === 0) return;

  const setDescription = (el) => {
    const text = el?.getAttribute("data-description");
    if (text) desc.textContent = text;
  };

  pills.forEach((pill) => {
    pill.addEventListener("mouseenter", () => setDescription(pill));
    pill.addEventListener("focus", () => setDescription(pill));
    pill.addEventListener("click", () => setDescription(pill));
  });
}

function validate(formEl) {
  clearStatus();
  if (formEl.checkValidity()) return true;

  setStatus("error", "Please complete the required fields (and write at least a couple of sentences).");
  const firstInvalid = qs(":invalid", formEl);
  if (firstInvalid && typeof firstInvalid.focus === "function") firstInvalid.focus();
  return false;
}

function getPayload(formEl) {
  const fd = new FormData(formEl);
  const payload = Object.fromEntries(fd.entries());
  return {
    name: String(payload.name || "").trim(),
    email: String(payload.email || "").trim(),
    type: String(payload.type || "").trim(),
    message: String(payload.message || "").trim(),
  };
}

async function wireContactForm() {
  const formEl = qs("#contact-form");
  if (!formEl) return;

  if (CONTACT_MODE === "netlify") {
    applyNetlifyAttributes(formEl);
  }

  formEl.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate(formEl)) return;

    const payload = getPayload(formEl);

    const submitBtn = qs('button[type="submit"]', formEl);
    const prevText = submitBtn?.textContent || "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      if (CONTACT_MODE === "mailto") {
        window.location.href = buildMailto(payload);
        setStatus("success", "Opening your email client… If it doesn’t open, copy/paste the email instead.");
      } else if (CONTACT_MODE === "formspree") {
        await submitFormspree(payload);
        setStatus("success", "Message sent. Thanks, I will get back to you soon.");
        formEl.reset();
      } else if (CONTACT_MODE === "netlify") {
        const body = new URLSearchParams();
        body.set("form-name", "contact");
        body.set("name", payload.name);
        body.set("email", payload.email);
        body.set("type", payload.type);
        body.set("message", payload.message);

        const res = await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
        });
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        setStatus("success", "Message sent. Thanks, I will get back to you soon.");
        formEl.reset();
      } else {
        throw new Error("Unknown CONTACT_MODE.");
      }
    } catch (err) {
      setStatus("error", err instanceof Error ? err.message : "Something went wrong. Please email me directly.");
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevText || "Send message";
      }
    }
  });
}

wireNav();
wireYear();
wireInterestDescriptions();
wireContactForm();

