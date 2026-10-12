// Product page: gallery, wrap choice, gift note, quantity, pincode check, related gifts.
(function () {
  const { byId, param, esc, money, stars, priceHTML, productCard, cart, wishlist, open, icon } = SV;
  const p = byId(param("id")) || PRODUCTS[0];
  const occ = OCCASIONS.find((o) => o.slug === p.occasions[0]);

  document.title = `${p.name} | Shivaara`;
  document.getElementById("crumbs").innerHTML =
    `<a href="index.html">Home</a> / <a href="collection.html?c=${occ.slug}">${occ.name}</a> / <span>${esc(p.name)}</span>`;

  const NOTE_MAX = 150;
  const images = [...new Set(p.images)];

  document.getElementById("pdp").innerHTML = `
    <div class="pdp">
      <div class="gallery-pdp">
        <div class="thumbs">${images.map((src, i) =>
          `<button class="${i ? "" : "is-active"}" data-img="${src}"><img src="${src}" alt=""></button>`).join("")}</div>
        <div class="main-img"><img id="main-img" src="${images[0]}" alt="${esc(p.name)}">
          ${p.badge ? `<span class="badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : ""}
        </div>
      </div>

      <div class="pdp-info">
        <h1>${esc(p.name)}</h1>
        <a class="pdp-rating" href="#reviews">${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></a>
        <div class="pdp-price">${priceHTML(p)}</div>
        <p class="muted small">Inclusive of all taxes</p>
        <p class="pdp-desc">${esc(p.description)}</p>

        <div class="opt">
          <span class="opt-label">Wrap: <b id="wrap-name">${WRAPS[0].name}</b></span>
          <div class="swatches">${WRAPS.map((w, i) => `
            <button class="swatch ${i ? "" : "is-active"}" data-wrap="${w.id}" title="${w.name}" style="--sw:${w.swatch}"></button>`).join("")}
          </div>
        </div>

        <label class="opt">
          <span class="opt-label">Free handwritten note <small class="muted">(optional)</small></span>
          <textarea id="note" rows="3" maxlength="${NOTE_MAX}" placeholder="Happy Diwali, Maa! Love, Riya"></textarea>
          <small class="muted"><span id="note-count">0</span>/${NOTE_MAX}</small>
        </label>

        <div class="buy-row">
          <div class="qty qty-lg">
            <button data-step="-1" aria-label="Decrease">−</button>
            <span id="qty">1</span>
            <button data-step="1" aria-label="Increase">+</button>
          </div>
          <button class="btn btn-primary grow" id="atc">Add to bag · <span id="atc-total">${money(p.price)}</span></button>
          <button class="icon-btn wish-lg ${wishlist.has(p.id) ? "is-on" : ""}" data-wish="${p.id}" aria-label="Wishlist">${icon.heart}</button>
        </div>
        <button class="btn btn-outline btn-block" id="buy-now">Buy it now</button>

        <form class="pincode" id="pincode">
          <label for="pin">Check delivery</label>
          <div class="inline-form">
            <input id="pin" inputmode="numeric" maxlength="6" placeholder="Enter pincode">
            <button class="btn btn-outline" type="submit">Check</button>
          </div>
          <p id="pin-result" class="small"></p>
        </form>

        <ul class="perks">
          <li>✦ Hand-wrapped in our studio</li>
          <li>✦ Cash on delivery available</li>
          <li>✦ Easy returns on damaged items</li>
        </ul>

        <div class="accordion">
          <details open><summary>What's inside</summary>
            <ul>${p.includes.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
          </details>
          <details><summary>Shipping & delivery</summary>
            <p>Dispatched within 24 hours. Metro cities get it in 1–3 days and the rest of India in 3–6 days. Free shipping on orders above ${money(SV.FREE_SHIPPING_AT)}.</p>
          </details>
          <details><summary>Gifting & personalisation</summary>
            <p>Your note is handwritten on a textured card. Invoices are never placed inside gift parcels. For logo branding or 25+ units, see corporate gifting.</p>
          </details>
          <details id="reviews"><summary>Reviews (${p.reviews})</summary>
            <div class="review"><div>${stars(5)}</div><p>“Beautifully packed, arrived a day early.”</p><small class="muted">Verified buyer</small></div>
            <div class="review"><div>${stars(4)}</div><p>“Lovely quality. I wish the ribbon came in more colours.”</p><small class="muted">Verified buyer</small></div>
          </details>
        </div>
      </div>
    </div>`;

  // Gallery
  const main = document.getElementById("main-img");
  document.querySelector(".thumbs").addEventListener("click", (e) => {
    const b = e.target.closest("[data-img]");
    if (!b) return;
    main.src = b.dataset.img;
    document.querySelectorAll(".thumbs button").forEach((x) => x.classList.toggle("is-active", x === b));
  });

  // Wrap swatches
  let wrap = WRAPS[0].id;
  document.querySelector(".swatches").addEventListener("click", (e) => {
    const b = e.target.closest("[data-wrap]");
    if (!b) return;
    wrap = b.dataset.wrap;
    document.getElementById("wrap-name").textContent = WRAPS.find((w) => w.id === wrap).name;
    document.querySelectorAll(".swatch").forEach((x) => x.classList.toggle("is-active", x === b));
  });

  // Note counter
  const note = document.getElementById("note");
  note.addEventListener("input", () => { document.getElementById("note-count").textContent = note.value.length; });

  // Quantity
  let qty = 1;
  document.querySelector(".qty-lg").addEventListener("click", (e) => {
    const b = e.target.closest("[data-step]");
    if (!b) return;
    qty = Math.max(1, Math.min(20, qty + +b.dataset.step));
    document.getElementById("qty").textContent = qty;
    document.getElementById("atc-total").textContent = money(p.price * qty);
  });

  function addToBag() { cart.add(p.id, qty, wrap, note.value.trim()); }
  document.getElementById("atc").addEventListener("click", () => { addToBag(); open("cart"); });
  document.getElementById("buy-now").addEventListener("click", () => { addToBag(); location.href = "checkout.html"; });

  // Pincode (stub: replace with Shiprocket serviceability API)
  document.getElementById("pincode").addEventListener("submit", (e) => {
    e.preventDefault();
    const pin = document.getElementById("pin").value.trim();
    const out = document.getElementById("pin-result");
    if (!/^[1-9][0-9]{5}$/.test(pin)) { out.className = "small err"; out.textContent = "Please enter a valid 6-digit pincode."; return; }
    const metro = /^(11|40|56|60|70|50|41|12|20)/.test(pin);
    const d = new Date(); d.setDate(d.getDate() + (metro ? 2 : 5));
    out.className = "small ok";
    out.textContent = `Delivers by ${d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })} · COD available`;
  });

  // Sticky add-to-cart on mobile once the main button scrolls away
  const sticky = document.getElementById("sticky-atc");
  sticky.innerHTML = `<img src="${images[0]}" alt=""><div><b>${esc(p.name)}</b><span>${money(p.price)}</span></div><button class="btn btn-primary">Add to bag</button>`;
  sticky.querySelector("button").addEventListener("click", () => { addToBag(); open("cart"); });
  new IntersectionObserver(([entry]) => {
    const show = !entry.isIntersecting && entry.boundingClientRect.top < 0;
    sticky.classList.toggle("is-on", show);
    sticky.setAttribute("aria-hidden", String(!show));
  }).observe(document.getElementById("atc"));

  // Related: share an occasion, best first
  const related = PRODUCTS
    .filter((x) => x.id !== p.id && x.occasions.some((o) => p.occasions.includes(o)))
    .sort((a, b) => b.reviews - a.reviews)
    .slice(0, 4);
  document.getElementById("related").innerHTML = related.map(productCard).join("");
})();
