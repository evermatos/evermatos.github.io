(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (storedTheme === "dark" || (!storedTheme && prefersDark)) {
    root.dataset.theme = "dark";
  }

  const button = document.querySelector(".theme-toggle");

  if (button) {
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
      root.dataset.theme = nextTheme;
      localStorage.setItem("theme", nextTheme);
    });
  }

  const publicationList = document.querySelector("[data-publication-list]");
  const yearFilter = document.querySelector("#year-filter");
  const sortSelect = document.querySelector("#publication-sort");
  const emptyState = document.querySelector("#publication-empty");

  if (!publicationList || !yearFilter || !sortSelect) {
    return;
  }

  const publications = Array.from(publicationList.querySelectorAll(".publication"));

  function compareYear(direction) {
    return (a, b) => direction * (Number(a.dataset.year) - Number(b.dataset.year));
  }

  function renderPublications() {
    const selectedYear = yearFilter.value;
    const selectedSort = sortSelect.value;
    const visible = publications.filter((publication) => {
      return selectedYear === "all" || publication.dataset.year === selectedYear;
    });

    const sorters = {
      "year-desc": compareYear(-1),
      "year-asc": compareYear(1),
    };

    visible.sort(sorters[selectedSort] || sorters["year-desc"]);
    publications.forEach((publication) => {
      publication.hidden = true;
    });
    visible.forEach((publication) => {
      publication.hidden = false;
      publicationList.appendChild(publication);
    });

    if (emptyState) {
      emptyState.hidden = visible.length > 0;
    }
  }

  yearFilter.addEventListener("change", renderPublications);
  sortSelect.addEventListener("change", renderPublications);
  renderPublications();
})();
