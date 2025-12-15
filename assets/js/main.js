console.log("Portfolio loaded");
const copyBtn = document.getElementById("copyEmailBtn");
const msg = document.getElementById("copyMsg");
const email = "anoukmoreno.inbox@gmail.com";

if (copyBtn && msg) {
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      msg.textContent = "Copied.";
      setTimeout(() => (msg.textContent = ""), 1500);
    } catch {
      msg.textContent = "Copy failed.";
      setTimeout(() => (msg.textContent = ""), 1500);
    }
  });
}
