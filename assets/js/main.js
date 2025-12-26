console.log("Portfolio loaded");

// ------------------------
// Copy email to clipboard
// ------------------------
const copyBtn = document.getElementById("copyEmailBtn");
const msg = document.getElementById("copyMsg");
const email = "anoukmoreno.inbox@gmail.com";

if (copyBtn && msg) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      msg.textContent = "Copied.";
      setTimeout(() => { msg.textContent = ""; }, 1500);
    } catch {
      msg.textContent = "Copy failed.";
      setTimeout(() => { msg.textContent = ""; }, 1500);
    }
  });
}

// ------------------------
// Lightbox (screenshots)
// ------------------------
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function openLightbox(src, altText) {
  if (!lightbox || !lightboxImg || !src) return;
  lightboxImg.src = src;
  lightboxImg.alt = altText || "Screenshot";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  if (!lightbox || !lightboxImg) return;
  lightbox.hidden = true;
  lightboxImg.src = "";
  lightboxImg.alt = "";
  document.body.style.overflow = "";
}

// ------------------------
// Project Modals (case studies)
// ------------------------
function openModal(modalEl, hashValue) {
  if (!modalEl) return;
  modalEl.hidden = false;
  document.body.classList.add("modal-open");
  if (hashValue) history.replaceState(null, "", `#${hashValue}`);
}

function closeModal(modalEl) {
  if (!modalEl) return;
  modalEl.hidden = true;
  document.body.classList.remove("modal-open");
}


function getOpenModal() {
  return document.querySelector(".modal:not([hidden])");
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

// Delegated click handling
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
    const src = shotBtn.getAttribute("data-full");
    const img = shotBtn.querySelector("img");
    openLightbox(src, img ? img.alt : "");
    return;
  }

  // Close handlers (both modal and lightbox)
  if (target.matches("[data-close='true']")) {
    const openModalEl = getOpenModal();
    if (openModalEl) {
      closeModal(openModalEl);
      history.replaceState(null, "", window.location.pathname);
      return;
    }
    if (lightbox && !lightbox.hidden) {
      closeLightbox();
      return;
    }
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;

  const openModalEl = getOpenModal();
  if (openModalEl) {
    closeModal(openModalEl);
    history.replaceState(null, "", window.location.pathname);
    return;
  }

  if (lightbox && !lightbox.hidden) {
    closeLightbox();
  }
});

// Open modal automatically if URL has hash (projects page)
window.addEventListener("DOMContentLoaded", () => {
  openModalByHash(window.location.hash);
});

// If user changes hash manually
window.addEventListener("hashchange", () => {
  // Close any existing modal first
  const openModalEl = getOpenModal();
  if (openModalEl) closeModal(openModalEl);

  // Then open new hash if any
  openModalByHash(window.location.hash);
});
