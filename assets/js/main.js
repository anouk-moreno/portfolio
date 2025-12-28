console.log("Portfolio loaded");

// ------------------------
// Copy email to clipboard
// ------------------------
const copyBtn = document.getElementById("copyEmailBtn");
const email = "anoukmoreno.inbox@gmail.com";

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);

      // Subtle visual feedback
      copyBtn.style.color = "#3B82F6";
      copyBtn.style.borderColor = "#3B82F6";

      setTimeout(() => {
        copyBtn.style.color = "";
        copyBtn.style.borderColor = "";
      }, 800);
    } catch {
      // Fail silently — consistent with pro UX
    }
  });
}

// ------------------------
// Helpers: modal / lightbox state + body scroll lock
// ------------------------
function getOpenModal() {
  return document.querySelector(".modal:not([hidden])");
}

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function isLightboxOpen() {
  return !!(lightbox && !lightbox.hidden);
}

function syncBodyScrollLock() {
  // Lock scroll if either a modal OR the lightbox is open
  const shouldLock = !!getOpenModal() || isLightboxOpen();

  document.body.classList.toggle("modal-open", !!getOpenModal());
  document.body.classList.toggle("lightbox-open", isLightboxOpen());

  document.body.style.overflow = shouldLock ? "hidden" : "";
}

// ------------------------
// Lightbox (screenshots) + carousel
// ------------------------
let lightboxItems = [];
let lightboxIndex = 0;

function setLightboxImage(index) {
  if (!lightboxImg) return;
  if (!lightboxItems.length) return;

  const safeIndex = (index + lightboxItems.length) % lightboxItems.length;
  lightboxIndex = safeIndex;

  const item = lightboxItems[lightboxIndex];
  lightboxImg.src = item.src;
  lightboxImg.alt = item.alt || "Screenshot";
}

function openLightboxFromButton(shotBtn) {
  if (!lightbox || !lightboxImg || !shotBtn) return;

  // Collect ALL screenshots from the same strip (inside the same modal)
  const strip = shotBtn.closest(".screenshots-strip");
  const buttons = strip ? Array.from(strip.querySelectorAll(".shot")) : [shotBtn];

  lightboxItems = buttons
    .map((btn) => {
      const full = btn.getAttribute("data-full") || "";
      const img = btn.querySelector("img");
      return {
        src: full,
        alt: img ? img.alt : "",
      };
    })
    .filter((x) => !!x.src);

  const currentSrc = shotBtn.getAttribute("data-full") || "";
  const startIndex = Math.max(
    0,
    lightboxItems.findIndex((x) => x.src === currentSrc)
  );

  lightbox.hidden = false;
  setLightboxImage(startIndex);
  syncBodyScrollLock();
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;

  lightbox.hidden = true;
  lightboxImg.src = "";
  lightboxImg.alt = "";
  lightboxItems = [];
  lightboxIndex = 0;

  syncBodyScrollLock();
}

function nextLightbox() {
  if (!lightboxItems.length) return;
  setLightboxImage(lightboxIndex + 1);
}

function prevLightbox() {
  if (!lightboxItems.length) return;
  setLightboxImage(lightboxIndex - 1);
}

// ------------------------
// Project Modals (case studies)
// ------------------------
function openModal(modalEl, hashValue) {
  if (!modalEl) return;
  modalEl.hidden = false;

  if (hashValue) {
    history.replaceState(null, "", `#${hashValue}`);
  }

  syncBodyScrollLock();
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = true;

  history.replaceState(null, "", window.location.pathname);

  syncBodyScrollLock();
}

function openModalByHash(hash) {
  const key = (hash || "").replace("#", "").trim();
  if (!key) return false;

  const trigger = document.querySelector(`[data-hash="${key}"]`);
  if (!trigger) return false;

  const modalId = trigger.getAttribute("data-modal");
  const modalEl = modalId ? document.getElementById(modalId) : null;
  if (!modalEl) return false;

  openModal(modalEl, key);
  return true;
}

// ------------------------
// Delegated click handling
// ------------------------
document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  // Open project modal from tiles
  const tile = target.closest(".project-tile");
  if (tile) {
    const modalId = tile.getAttribute("data-modal");
    const hashValue = tile.getAttribute("data-hash");
    const modalEl = modalId ? document.getElementById(modalId) : null;
    openModal(modalEl, hashValue);
    return;
  }

  // Open screenshot lightbox
  const shotBtn = target.closest(".shot");
  if (shotBtn) {
    openLightboxFromButton(shotBtn);
    return;
  }

  if (target.matches("[data-lightbox-close='true']")) {
    closeLightbox();
    return;
  }

  // Lightbox carousel controls
  if (target.matches("[data-lightbox-next='true']")) {
    nextLightbox();
    return;
  }

  if (target.matches("[data-lightbox-prev='true']")) {
    prevLightbox();
    return;
  }

  if (target.matches("[data-close='true']")) {
    const openModalEl = getOpenModal();
    if (openModalEl) {
      closeModal(openModalEl);
    }
  }
});

// ------------------------
// Keyboard handling
// ------------------------
document.addEventListener("keydown", (e) => {
  // If lightbox is open, it has priority
  if (isLightboxOpen()) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowRight") nextLightbox();
    if (e.key === "ArrowLeft") prevLightbox();
    return;
  }

  // Otherwise, handle modal
  if (e.key === "Escape") {
    const openModalEl = getOpenModal();
    if (openModalEl) closeModal(openModalEl);
  }
});

// ------------------------
// Open modal automatically if URL has hash (projects page)
// ------------------------
window.addEventListener("DOMContentLoaded", () => {
  openModalByHash(window.location.hash);
  syncBodyScrollLock();
});

// If user changes hash manually
window.addEventListener("hashchange", () => {
  const openModalEl = getOpenModal();
  if (openModalEl) {
    openModalEl.hidden = true;
  }

  openModalByHash(window.location.hash);
  syncBodyScrollLock();
});
