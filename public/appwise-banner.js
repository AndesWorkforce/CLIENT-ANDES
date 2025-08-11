(function () {
  // 1. Inject CSS
  const css = `
    #appwise-banner {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(6px);
      border: 1px solid #ddd;
      border-radius: .5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: .75rem;
      display: flex;
      align-items: center;
      gap: .5rem;
      transform: translateY(100px);
      opacity: 0;
      transition: transform .6s ease, opacity .6s ease;
      font-family: sans-serif;
    }
    #appwise-banner.show {
      transform: translateY(0);
      opacity: 1;
    }
    #appwise-banner img {
      width: 32px;
      height: 32px;
      object-fit: contain;
      flex-shrink: 0;
    }
    #appwise-banner .text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    #appwise-banner .text .by {
      font-size: .7rem;
      color: #666;
    }
    #appwise-banner .text .brand {
      font-size: .9rem;
      font-weight: bold;
      color: #333;
      text-decoration: none;
    }
    #appwise-banner .close-btn {
      margin-left: .5rem;
      cursor: pointer;
      font-size: 1rem;
      line-height: 1;
      opacity: .6;
      transition: opacity .2s ease;
    }
    #appwise-banner .close-btn:hover {
      opacity: 1;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // 2. Build banner HTML
  const banner = document.createElement("div");
  banner.id = "appwise-banner";
  banner.innerHTML = `
    <a href="https://appwiseinnovations.com" target="_blank" rel="noopener" style="display:flex; align-items:center; gap:.5rem; text-decoration:none;">
      <img src="https://appwiseinnovations.dev/r2-appwise/appwise/logo_appwise.png" alt="AppWise Innovations">
      <div class="text">
        <span class="by">by</span>
        <span class="brand">AppWise Innovations</span>
      </div>
    </a>
    <span class="close-btn" title="Cerrar">&times;</span>
  `;
  document.body.appendChild(banner);

  // 3. Show with animation
  requestAnimationFrame(() => banner.classList.add("show"));

  // 4. Close handler
  banner
    .querySelector(".close-btn")
    .addEventListener("click", () => banner.remove());
})();
