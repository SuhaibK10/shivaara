// Homepage: hero slider, occasion tiles, bestseller rail, new arrivals.
(function () {
  const { productCard } = SV;

  // Hero slider
  const slides = [...document.querySelectorAll(".hero-slide")];
  const dots = document.querySelector(".hero-dots");
  let current = 0, timer;
  dots.innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join("");
  function go(i) {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, n) => s.classList.toggle("is-active", n === current));
    [...dots.children].forEach((d, n) => d.classList.toggle("is-active", n === current));
    clearInterval(timer);
    timer = setInterval(() => go(current + 1), 6000);
  }
  dots.addEventListener("click", (e) => {
    const i = [...dots.children].indexOf(e.target);
    if (i >= 0) go(i);
  });
  document.querySelector(".hero-arrow.prev").addEventListener("click", () => go(current - 1));
  document.querySelector(".hero-arrow.next").addEventListener("click", () => go(current + 1));
  go(0);

  // Occasions
  document.getElementById("occasions").innerHTML = OCCASIONS.map((o) => `
    <a class="occasion" href="collection.html?c=${o.slug}">
      <img src="${o.image}" alt="" loading="lazy">
      <span><b>${o.name}</b><small>${o.blurb}</small></span>
    </a>`).join("");

  // Bestseller rail with tabs
  const rail = document.getElementById("best-rail");
  function fillRail(tab) {
    const list = PRODUCTS
      .filter((p) => tab === "all" || p.occasions.includes(tab))
      .sort((a, b) => b.reviews - a.reviews)
      .slice(0, 8);
    rail.innerHTML = list.map(productCard).join("");
    rail.scrollLeft = 0;
  }
  document.getElementById("best-tabs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-tab]");
    if (!b) return;
    document.querySelectorAll("#best-tabs button").forEach((x) => x.classList.toggle("is-active", x === b));
    fillRail(b.dataset.tab);
  });
  document.querySelectorAll(".rail-btn").forEach((btn) => btn.addEventListener("click", () => {
    rail.scrollBy({ left: (btn.classList.contains("next") ? 1 : -1) * rail.clientWidth * 0.8, behavior: "smooth" });
  }));
  fillRail("all");

  // New arrivals
  document.getElementById("new-grid").innerHTML = PRODUCTS.filter((p) => p.isNew).slice(0, 4).map(productCard).join("");
})();
