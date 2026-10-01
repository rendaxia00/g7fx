(() => {
  const root = document.documentElement;
  const base = root.dataset.base || "";
  const storedTheme = localStorage.getItem("g7fx-theme");
  if (storedTheme) root.dataset.theme = storedTheme;

  const localPath = location.pathname.startsWith(base) ? location.pathname.slice(base.length) || "/" : location.pathname;
  const chapterMatch = localPath.match(/^\/chapters\/p(\d{2})\/?$/);
  if (chapterMatch) {
    const chapterTitle = document.querySelector(".doc-header h1")?.textContent?.trim() || `P${chapterMatch[1]}`;
    localStorage.setItem("g7fx-last-chapter", JSON.stringify({
      number: chapterMatch[1],
      route: `/chapters/p${chapterMatch[1]}/`,
      title: chapterTitle,
      visitedAt: Date.now(),
    }));
  }

  const continueLink = document.querySelector("[data-continue-learning]");
  if (continueLink) {
    try {
      const progress = JSON.parse(localStorage.getItem("g7fx-last-chapter") || "null");
      if (progress?.route && /^\/chapters\/p\d{2}\/$/.test(progress.route)) {
        continueLink.href = `${base}${progress.route}`;
        continueLink.querySelector("[data-continue-label]").textContent = `继续 P${progress.number}`;
        continueLink.setAttribute("aria-label", `继续学习 ${progress.title}`);
        continueLink.title = progress.title;
      }
    } catch {
      localStorage.removeItem("g7fx-last-chapter");
    }
  }

  const themeToggle = document.getElementById("themeToggle");
  themeToggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = next;
    localStorage.setItem("g7fx-theme", next);
  });

  const sidebar = document.getElementById("sidebar");
  const scrim = document.getElementById("sidebarScrim");
  const menu = document.getElementById("menuToggle");
  const closeNav = () => { sidebar?.classList.remove("open"); scrim?.classList.remove("show"); };
  menu?.addEventListener("click", () => { sidebar?.classList.toggle("open"); scrim?.classList.toggle("show"); });
  scrim?.addEventListener("click", closeNav);
  sidebar?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));

  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable;
    if (!typing && (event.key === "/" || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k"))) {
      event.preventDefault();
      location.href = `${base}/search/`;
    }
    if (event.key === "Escape") closeNav();
  });

  const headings = [...document.querySelectorAll(".prose h2")];
  const tocLinks = [...document.querySelectorAll(".on-this-page a")];
  if (headings.length && tocLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (!visible) return;
      tocLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`));
    }, { rootMargin: "-90px 0px -70% 0px", threshold: 0 });
    headings.forEach((heading) => observer.observe(heading));
  }
})();
