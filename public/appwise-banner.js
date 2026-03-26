(function () {
  // 1. Inject CSS
  const css = `
    #appwise-banner {
      position: fixed;
      bottom: 1rem;
      right: 1rem;
      z-index: 9999;
      background: #ffffff;
      border-radius: 20px;
      box-shadow: 0px 4px 4px rgba(210, 210, 210, 0.25);
      padding: 5px;
      width: 175px;
      height: 45px;
      display: flex;
      align-items: center;
      transform: translateY(100px);
      opacity: 0;
      transition: transform .6s ease, opacity .6s ease;
      font-family: 'Inter', sans-serif;
      box-sizing: border-box;
    }
    #appwise-banner.show {
      transform: translateY(0);
      opacity: 1;
    }
    #appwise-banner a {
      display: flex;
      align-items: center;
      gap: 3px;
      text-decoration: none;
      width: 100%;
      height: 100%;
    }
    #appwise-banner img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
    #appwise-banner .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      line-height: 1;
    }
    #appwise-banner .text .by {
      font-size: 12px;
      font-weight: 400;
      color: #000000;
    }
    #appwise-banner .text .brand {
      font-size: 10px;
      font-weight: 800;
      color: #000000;
      text-decoration: none;
      white-space: nowrap;
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // 2. Build banner HTML
  const banner = document.createElement("div");
  banner.id = "appwise-banner";
  banner.innerHTML = `
    <a href="https://appwiseinnovations.com" target="_blank" rel="noopener">
      <img src="https://appwiseinnovations.dev/r2-appwise/appwise/logo_appwise.png" alt="AppWise Innovations">
      <div class="text">
        <span class="by">by</span>
        <span class="brand">APPWISE INNOVATIONS</span>
      </div>
    </a>
  `;
  document.body.appendChild(banner);

  // 3. Show with animation
  requestAnimationFrame(() => banner.classList.add("show"));
})();
