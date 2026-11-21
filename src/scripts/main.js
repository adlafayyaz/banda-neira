import {
  createIcons,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleDot,
  CircleHelp,
  Compass,
  House,
  Mail,
  Map,
  MapPin,
  Sailboat,
  Wallet,
} from "lucide";

const icons = {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CircleDot,
  CircleHelp,
  Compass,
  House,
  Mail,
  Map,
  MapPin,
  Sailboat,
  Wallet,
};

const refreshIcons = () =>
  createIcons({
    icons,
    attrs: { "aria-hidden": "true", focusable: "false", "stroke-width": 1.85 },
  });

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

refreshIcons();

function setupSmoothAnchors() {
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = $(targetId);
      if (!target) return;
      event.preventDefault();
      const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "start",
      });
      if (targetId !== "#main") {
        history.replaceState(null, "", targetId);
      } else {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  });
}

function setupContact() {
  const form = $("#contact-form");
  if (!form) return;
  form.noValidate = true;

  const fields = [
    $("#visitor-name"),
    $("#visitor-email"),
    $("#visitor-message"),
  ];

  const setError = (field, message) => {
    field.setAttribute("aria-invalid", String(Boolean(message)));
    document.getElementById(
      field.getAttribute("aria-describedby"),
    ).textContent = message;
  };

  fields.forEach((field) =>
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") setError(field, "");
    }),
  );

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let firstInvalid;

    fields.forEach((field) => {
      let message = "";
      if (!field.value.trim()) {
        message =
          field.name === "message"
            ? "Write a message before preparing your email."
            : `Enter your ${field.name === "name" ? "name" : "email address"}.`;
      } else if (!field.validity.valid) {
        message =
          field.name === "email"
            ? "Enter a valid email address such as name@example.com."
            : "Shorten this text to fit the field.";
      }
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const [name, email, message] = fields.map((field) => field.value.trim());
    const subject = `Banda Neira enquiry from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href =
      `mailto:adlafayyaz@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

setupSmoothAnchors();
setupContact();

if ($(".journal-hero") || $("[data-reveal]")) {
  import("./motion.js").then(({ setupMotion }) => setupMotion());
}
