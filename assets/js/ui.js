// ─── Copy button ────────────────────────────────────────────────
const copyBtn = document.getElementById("copy-ip-btn");

if (copyBtn) {
  copyBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    const originalHTML = copyBtn.innerHTML;

    try {
      await navigator.clipboard.writeText("mc.hardbass.dev");
    } catch {
      // Fallback for HTTP contexts without clipboard API
      const ta = document.createElement("textarea");
      ta.value = "mc.hardbass.dev";
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }

    copyBtn.classList.add("btn-copied");
    copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';

    setTimeout(() => {
      copyBtn.innerHTML = originalHTML;
      copyBtn.classList.remove("btn-copied");
    }, 2000);
  });
}
