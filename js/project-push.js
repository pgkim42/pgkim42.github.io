(function () {
  var root = document.documentElement;
  var drawer = document.getElementById("project-drawer");
  var inner = document.getElementById("project-drawer-inner");
  var closeBtn = document.getElementById("project-drawer-close");
  var scrim = document.getElementById("project-scrim");
  var openButtons = document.querySelectorAll(".work-open[data-work]");
  var currentId = null;
  var fadeMs = 480;
  var closing = false;

  function setScrimVisible(show) {
    if (!scrim) return;
    scrim.hidden = !show;
    scrim.setAttribute("aria-hidden", show ? "false" : "true");
  }

  function setActiveRow(id) {
    document.querySelectorAll(".work-row").forEach(function (row) {
      var btn = row.querySelector(".work-open");
      row.classList.toggle("is-selected", btn && btn.dataset.work === id);
    });
  }

  function clearActiveRows() {
    document.querySelectorAll(".work-row").forEach(function (row) {
      row.classList.remove("is-selected");
    });
  }

  function finishClose() {
    root.classList.remove("is-project-open", "is-project-closing");
    document.body.style.overflow = "";
    setScrimVisible(false);
    if (drawer) {
      drawer.setAttribute("aria-hidden", "true");
      drawer.setAttribute("inert", "");
    }
    clearActiveRows();
    currentId = null;
    closing = false;
  }

  function closeDrawer() {
    if (!root.classList.contains("is-project-open") || closing) return;

    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      finishClose();
      return;
    }

    closing = true;
    root.classList.add("is-project-closing");
    if (inner) {
      inner.classList.add("is-fade-out");
      inner.classList.remove("is-fade-in");
    }

    window.setTimeout(finishClose, fadeMs);
  }

  function injectContent(id) {
    var tpl = document.getElementById("work-tpl-" + id);
    if (!tpl || !inner) return;

    var reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    function mount() {
      inner.innerHTML = "";
      inner.appendChild(tpl.content.cloneNode(true));
      inner.classList.remove("is-fade-out");
      if (reduceMotion) {
        inner.style.opacity = "";
        return;
      }
      inner.style.opacity = "0";
      void inner.offsetWidth;
      inner.style.opacity = "1";
    }

    if (reduceMotion || !inner.querySelector(".work-pane-content")) {
      mount();
      return;
    }

    inner.classList.add("is-fade-out");
    inner.classList.remove("is-fade-in");
    window.setTimeout(mount, fadeMs * 0.55);
  }

  function openProject(id) {
    if (!drawer || closing) return;

    var alreadyOpen = root.classList.contains("is-project-open");

    if (!alreadyOpen) {
      setScrimVisible(true);
      root.classList.add("is-project-open");
      document.body.style.overflow = "hidden";
      drawer.removeAttribute("inert");
      drawer.setAttribute("aria-hidden", "false");
    }

    setActiveRow(id);

    if (currentId !== id) {
      injectContent(id);
    }

    currentId = id;

    if (!alreadyOpen && closeBtn) {
      window.setTimeout(function () {
        closeBtn.focus({ preventScroll: true });
      }, fadeMs * 0.6);
    }
  }

  openButtons.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      var id = btn.dataset.work;
      if (!id) return;
      openProject(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeDrawer);
  }

  if (scrim) {
    scrim.addEventListener("click", closeDrawer);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && root.classList.contains("is-project-open")) {
      closeDrawer();
    }
  });
})();
