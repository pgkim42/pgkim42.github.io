(function () {
  var STORAGE_KEY = "pgkim42-theme";
  var root = document.documentElement;
  var meta = document.getElementById("meta-theme-color");
  var button = document.getElementById("theme-toggle");
  var label = document.getElementById("theme-toggle-label");

  function getTheme() {
    return root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  function setThemeDom(theme) {
    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
    localStorage.setItem(STORAGE_KEY, theme);
    if (meta) {
      meta.content = theme === "light" ? "#eeeae3" : "#060708";
    }
    if (button && label) {
      if (theme === "light") {
        label.textContent = "Dark";
        button.setAttribute("aria-label", "다크 모드로 전환");
      } else {
        label.textContent = "Light";
        button.setAttribute("aria-label", "라이트 모드로 전환");
      }
    }
  }

  function applyTheme(theme, options) {
    var animate = !(options && options.animate === false);
    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!animate || reduceMotion || !document.startViewTransition) {
      setThemeDom(theme);
      return;
    }

    document.startViewTransition(function () {
      setThemeDom(theme);
    });
  }

  applyTheme(getTheme(), { animate: false });

  if (button) {
    button.addEventListener("click", function () {
      applyTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function (e) {
      if (localStorage.getItem(STORAGE_KEY)) return;
      applyTheme(e.matches ? "dark" : "light", { animate: true });
    });
})();
