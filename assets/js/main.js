console.log("Portfolio loaded");

//Copy email to clipboard
const copyBtn = document.getElementById("copyEmailBtn");
const msg = document.getElementById("copyMsg");
const email = "anoukmoreno.inbox@gmail.com";

if (copyBtn && msg) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      msg.textContent = "Copied.";
      setTimeout(() => {
        msg.textContent = "";
      }, 1500);
    } catch {
      msg.textContent = "Copy failed.";
      setTimeout(() => {
        msg.textContent = "";
      }, 1500);
    }
  });
}

// Lightbox for screenshots
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function openLightbox(src, altText) {
  if (!lightbox || !lightboxImg) return;
  if (!src) return;

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

document.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof Element)) return;

  const shotBtn = target.closest(".shot");
  if (shotBtn) {
    const src = shotBtn.getAttribute("data-full");
    const img = shotBtn.querySelector("img");
    openLightbox(src, img ? img.alt : "");
    return;
  }

  if (target.matches("[data-close='true']")) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});
