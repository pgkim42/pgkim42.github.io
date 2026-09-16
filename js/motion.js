(function () {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const scrollDriven =
    !reduceMotion &&
    typeof CSS !== "undefined" &&
    CSS.supports("(animation-timeline: view())") &&
    CSS.supports("animation-range: entry 0% cover 40%");

  if (scrollDriven) {
    document.documentElement.classList.add("scroll-driven");
  }

  const header = document.querySelector("[data-header]");
  if (header) {
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const navLinks = [...document.querySelectorAll(".nav-link[data-nav]")];
  const sections = navLinks
    .map((link) => {
      const id = link.getAttribute("href")?.slice(1);
      const el = id ? document.getElementById(id) : null;
      return el ? { link, el, id } : null;
    })
    .filter(Boolean);

  function setActiveNavSection(id) {
    navLinks.forEach((link) => {
      const active = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-active", active);
      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  if (sections.length) {
    const navOffset = () =>
      window.matchMedia("(min-width: 960px)").matches ? 140 : 96;

    const updateNavSpy = () => {
      const offset = navOffset();
      let currentId = sections[0].id;
      for (const { el, id } of sections) {
        if (el.getBoundingClientRect().top <= offset) {
          currentId = id;
        }
      }
      setActiveNavSection(currentId);
    };

    updateNavSpy();
    window.addEventListener("scroll", updateNavSpy, { passive: true });
    window.addEventListener("resize", updateNavSpy, { passive: true });
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  if (!revealEls.length) return;

  if (reduceMotion || scrollDriven) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    if (scrollDriven) return;
  }

  const hero = document.querySelector(".hero");
  const heroItems = hero
    ? [...hero.querySelectorAll("[data-reveal]")]
    : [];

  revealEls.forEach((el) => {
    if (hero && heroItems.includes(el)) {
      const index = heroItems.indexOf(el);
      el.style.setProperty("--reveal-delay", `${index * 120}ms`);
    }
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );

  revealEls.forEach((el) => {
    if (hero && heroItems.includes(el)) {
      const index = heroItems.indexOf(el);
      setTimeout(() => el.classList.add("is-visible"), 200 + index * 180);
      return;
    }
    io.observe(el);
  });

  if (!scrollDriven && !reduceMotion) {
    const workRows = document.querySelectorAll(".work-row");
    workRows.forEach((row, index) => {
      row.style.setProperty("--row-i", String(index));
      row.classList.add("reveal-row");
    });

    const rowIo = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-row-visible");
          rowIo.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -4% 0px", threshold: 0.05 }
    );
    workRows.forEach((row) => rowIo.observe(row));
  }
})();
