// Collection page: ?c=<occasion|bestsellers|new|wishlist>, ?q=<search>, sidebar filters and sorting.
(function () {
  const { productCard, param, esc, wishlist, searchProducts } = SV;
  const c = param("c");
  const q = param("q");

  const special = {
    bestsellers: { name: "Bestsellers", blurb: "The gifts our customers come back for." },
    new: { name: "New Arrivals", blurb: "Fresh from the studio this season." },
    wishlist: { name: "Your Wishlist", blurb: "Gifts you've saved for later." }
  };
  const occ = OCCASIONS.find((o) => o.slug === c);
  const meta = occ || special[c] || { name: q ? `Results for “${q}”` : "Shop All", blurb: q ? "" : "Every gift, hand-wrapped and ready to send." };

  document.title = `${q ? "Search" : meta.name} | Shivaara`;
  document.getElementById("col-title").innerHTML = esc(meta.name);
  document.getElementById("crumb").innerHTML = esc(q ? "Search" : meta.name);
  document.getElementById("col-blurb").textContent = meta.blurb || "";

  // Occasion checkboxes (pre-checked when arriving from an occasion link)
  document.getElementById("f-occasion").innerHTML = OCCASIONS.map((o) =>
    `<label><input type="checkbox" value="${o.slug}" ${o.slug === c ? "checked" : ""}> ${o.name}</label>`).join("");
  if (c === "new") document.getElementById("f-new").checked = true;

  function baseList() {
    if (q) return searchProducts(q);
    if (c === "wishlist") return PRODUCTS.filter((p) => wishlist.has(p.id));
    if (c === "bestsellers") return PRODUCTS.filter((p) => p.reviews >= 90);
    return PRODUCTS.slice();
  }

  function apply() {
    const occs = [...document.querySelectorAll("#f-occasion input:checked")].map((i) => i.value);
    const [lo, hi] = (document.querySelector("input[name=price]:checked").value.split("-").map(Number));
    const sale = document.getElementById("f-sale").checked;
    const fresh = document.getElementById("f-new").checked;
    const sort = document.getElementById("sort").value;

    let list = baseList().filter((p) =>
      (!occs.length || p.occasions.some((o) => occs.includes(o))) &&
      (isNaN(lo) || (p.price >= lo && p.price <= hi)) &&
      (!sale || p.compareAt) &&
      (!fresh || p.isNew));

    const sorters = {
      best: (a, b) => b.reviews - a.reviews,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating
    };
    if (sorters[sort]) list.sort(sorters[sort]);

    document.getElementById("result-count").textContent = `${list.length} gift${list.length === 1 ? "" : "s"}`;
    document.getElementById("product-grid").innerHTML = list.length ? list.map(productCard).join("") : `
      <div class="empty wide">
        <p>${c === "wishlist" ? "Your wishlist is empty. Tap the heart on any gift to save it here." : "No gifts match these filters."}</p>
        <a class="btn btn-primary" href="collection.html">Browse all gifts</a>
      </div>`;
  }

  document.getElementById("filters").addEventListener("change", apply);
  document.getElementById("sort").addEventListener("change", apply);
  document.getElementById("clear-filters").addEventListener("click", () => {
    document.querySelectorAll("#filters input[type=checkbox]").forEach((i) => { i.checked = false; });
    document.querySelector("input[name=price][value=all]").checked = true;
    apply();
  });

  // Mobile filter sheet
  const filters = document.getElementById("filters");
  document.getElementById("open-filters").addEventListener("click", () => filters.classList.add("is-open"));
  document.getElementById("apply-filters").addEventListener("click", () => filters.classList.remove("is-open"));

  // Wishlist page should drop items as soon as they're un-hearted
  if (c === "wishlist") document.addEventListener("click", (e) => { if (e.target.closest("[data-wish]")) setTimeout(apply, 0); });

  apply();
})();
