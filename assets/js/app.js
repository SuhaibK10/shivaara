// Shared storefront behaviour: header/footer, cart drawer, wishlist, search, toasts.
(function () {
  const FREE_SHIPPING_AT = 999;
  const GIFT_WRAP_FEE = 49;

  // ---------- storage (wrapped: private windows can throw) ----------
  function load(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch (e) { return fallback; }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  // ---------- helpers ----------
  const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const param = (k) => new URLSearchParams(location.search).get(k);

  const icon = {
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>'
  };

  // ---------- cart ----------
  const cart = {
    items: () => load("sv_cart", []),
    set(items) { save("sv_cart", items); renderCart(); updateCounts(); },
    add(id, qty = 1, wrap = "kraft", note = "") {
      const items = cart.items();
      const line = items.find((l) => l.id === id && l.wrap === wrap && l.note === note);
      if (line) line.qty += qty; else items.push({ id, qty, wrap, note });
      cart.set(items);
    },
    update(index, qty) {
      const items = cart.items();
      if (qty <= 0) items.splice(index, 1); else items[index].qty = qty;
      cart.set(items);
    },
    count: () => cart.items().reduce((n, l) => n + l.qty, 0),
    subtotal: () => cart.items().reduce((s, l) => s + (byId(l.id)?.price || 0) * l.qty, 0),
    giftWrap: () => load("sv_giftwrap", false),
    setGiftWrap(v) { save("sv_giftwrap", v); renderCart(); },
    clear() { save("sv_giftwrap", false); cart.set([]); }
  };

  // ---------- wishlist ----------
  const wishlist = {
    ids: () => load("sv_wishlist", []),
    has: (id) => wishlist.ids().includes(id),
    toggle(id) {
      const ids = wishlist.ids();
      const i = ids.indexOf(id);
      if (i >= 0) ids.splice(i, 1); else ids.push(id);
      save("sv_wishlist", ids);
      updateCounts();
      document.querySelectorAll(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("is-on", i < 0));
      toast(i < 0 ? "Saved to your wishlist" : "Removed from wishlist");
    }
  };

  // ---------- shared markup ----------
  function stars(rating) {
    const full = Math.round(rating);
    return `<span class="stars" aria-label="${rating} out of 5">${Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < full ? "on" : ""}">${icon.star}</i>`).join("")}</span>`;
  }

  function priceHTML(p) {
    const off = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
    return `<span class="price">${money(p.price)}</span>` +
      (p.compareAt ? `<s class="compare">${money(p.compareAt)}</s><span class="off">${off}% off</span>` : "");
  }

  function productCard(p) {
    const url = `product.html?id=${p.id}`;
    return `
      <article class="card">
        <div class="card-media">
          <a href="${url}" aria-label="${esc(p.name)}">
            <img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy">
            <img class="alt" src="${p.images[1] || p.images[0]}" alt="" loading="lazy">
          </a>
          ${p.badge ? `<span class="badge badge-${p.badge.toLowerCase()}">${p.badge}</span>` : ""}
          <button class="wish ${wishlist.has(p.id) ? "is-on" : ""}" data-wish="${p.id}" aria-label="Add to wishlist">${icon.heart}</button>
          <button class="quick-add" data-add="${p.id}">Add to bag</button>
        </div>
        <div class="card-body">
          <a class="card-title" href="${url}">${esc(p.name)}</a>
          <div class="card-rating">${stars(p.rating)}<span>(${p.reviews})</span></div>
          <div class="card-price">${priceHTML(p)}</div>
        </div>
      </article>`;
  }

  function renderHeader() {
    const el = document.getElementById("site-header");
    if (!el) return;
    const announcements = [
      `Free shipping on orders above ${money(FREE_SHIPPING_AT)}`,
      "Diwali hampers are live. Order by 25 Oct for festive delivery",
      "Every gift comes with a free handwritten note",
      "Cash on delivery available across India"
    ];
    const occasionLinks = OCCASIONS.map((o) => `<a href="collection.html?c=${o.slug}">${o.name}</a>`).join("");
    el.innerHTML = `
      <div class="announce" role="region" aria-label="Announcements">
        <div class="announce-track">${announcements.concat(announcements).map((t) => `<span>${t}</span>`).join("")}</div>
      </div>
      <header class="header">
        <div class="header-inner">
          <button class="icon-btn only-mobile" data-open="mobile-nav" aria-label="Menu">${icon.menu}</button>
          <nav class="main-nav" aria-label="Primary">
            <a href="collection.html">Shop All</a>
            <div class="has-mega">
              <a href="collection.html">Occasions</a>
              <div class="mega">
                <div class="mega-links">${occasionLinks}</div>
                <a class="mega-feature" href="collection.html?c=diwali">
                  <img src="assets/img/diya-tray.jpg" alt="">
                  <span>The Diwali Edit →</span>
                </a>
              </div>
            </div>
            <a href="collection.html?c=bestsellers">Bestsellers</a>
            <a href="collection.html?c=corporate">Corporate</a>
          </nav>
          <a class="logo" href="index.html" aria-label="Shivara home">
            <span class="logo-mark">✦</span>Shivara
          </a>
          <div class="header-icons">
            <button class="icon-btn" data-open="search" aria-label="Search">${icon.search}</button>
            <a class="icon-btn hide-mobile" href="#" aria-label="Account">${icon.user}</a>
            <a class="icon-btn" href="collection.html?c=wishlist" aria-label="Wishlist">${icon.heart}<span class="count" data-count="wish"></span></a>
            <button class="icon-btn" data-open="cart" aria-label="Bag">${icon.bag}<span class="count" data-count="cart"></span></button>
          </div>
        </div>
      </header>`;

    window.addEventListener("scroll", () => {
      el.classList.toggle("is-scrolled", window.scrollY > 40);
    }, { passive: true });
  }

  function renderFooter() {
    const el = document.getElementById("site-footer");
    if (!el) return;
    el.innerHTML = `
      <section class="newsletter">
        <div class="container newsletter-inner">
          <div>
            <h2>Get first word on festive edits</h2>
            <p>New collections, early-bird hamper prices and gifting reminders before the big days. One email a fortnight at most.</p>
          </div>
          <form class="inline-form" data-form="newsletter">
            <input type="email" required placeholder="Your email address" aria-label="Email">
            <button class="btn btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
      <footer class="footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <a class="logo" href="index.html"><span class="logo-mark">✦</span>Shivara</a>
            <p>Thoughtful gifts, wrapped by hand and delivered across India.</p>
            <div class="socials">
              <a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="Facebook">FB</a>
              <a href="#" aria-label="Pinterest">PI</a><a href="#" aria-label="WhatsApp">WA</a>
            </div>
          </div>
          <div><h4>Shop</h4>
            ${OCCASIONS.slice(0, 5).map((o) => `<a href="collection.html?c=${o.slug}">${o.name}</a>`).join("")}
          </div>
          <div><h4>Help</h4>
            <a href="#">Track your order</a><a href="#">Shipping & delivery</a><a href="#">Returns</a><a href="#">FAQs</a><a href="#">Contact us</a>
          </div>
          <div><h4>Company</h4>
            <a href="#">Our story</a><a href="collection.html?c=corporate">Corporate gifting</a><a href="#">Bulk & wedding orders</a><a href="#">Privacy policy</a><a href="#">Terms</a>
          </div>
        </div>
        <div class="container footer-bottom">
          <span>© ${new Date().getFullYear()} Shivara. All rights reserved.</span>
          <span class="pay">UPI · Cards · Netbanking · COD</span>
          <span class="credit">Photos: Pexels</span>
        </div>
      </footer>`;
  }

  function renderOverlays() {
    document.body.insertAdjacentHTML("beforeend", `
      <div class="scrim" data-close></div>
      <aside class="drawer" id="cart" aria-label="Shopping bag" aria-hidden="true">
        <div class="drawer-head"><h3>Your bag</h3><button class="icon-btn" data-close aria-label="Close">${icon.close}</button></div>
        <div class="drawer-ship"></div>
        <div class="drawer-body"></div>
        <div class="drawer-foot"></div>
      </aside>
      <aside class="drawer drawer-left" id="mobile-nav" aria-label="Menu" aria-hidden="true">
        <div class="drawer-head"><a class="logo" href="index.html"><span class="logo-mark">✦</span>Shivara</a><button class="icon-btn" data-close aria-label="Close">${icon.close}</button></div>
        <nav class="mobile-links">
          <a href="collection.html">Shop All</a>
          <a href="collection.html?c=bestsellers">Bestsellers</a>
          <a href="collection.html?c=new">New Arrivals</a>
          <p class="mobile-label">Occasions</p>
          ${OCCASIONS.map((o) => `<a href="collection.html?c=${o.slug}">${o.name}</a>`).join("")}
          <p class="mobile-label">Account</p>
          <a href="collection.html?c=wishlist">Wishlist</a><a href="#">Track order</a>
        </nav>
      </aside>
      <div class="search-panel" id="search" aria-hidden="true">
        <div class="container">
          <div class="search-bar">
            ${icon.search}
            <input type="search" placeholder="Search hampers, candles, diyas…" aria-label="Search products">
            <button class="icon-btn" data-close aria-label="Close search">${icon.close}</button>
          </div>
          <div class="search-suggest">
            <span>Popular:</span>
            ${["Diwali hamper", "Candles", "Roses", "Journal", "Corporate"].map((t) => `<button data-term="${t}">${t}</button>`).join("")}
          </div>
          <div class="search-results"></div>
        </div>
      </div>
      <div class="toast" role="status" aria-live="polite"></div>`);
  }

  // ---------- cart drawer ----------
  function renderCart() {
    const drawer = document.getElementById("cart");
    if (!drawer) return;
    const items = cart.items();
    const subtotal = cart.subtotal();
    const wrap = cart.giftWrap();
    const left = FREE_SHIPPING_AT - subtotal;
    const pct = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

    drawer.querySelector(".drawer-ship").innerHTML = items.length ? `
      <p>${left > 0 ? `You're <b>${money(left)}</b> away from free shipping` : "You've unlocked <b>free shipping</b> 🎉"}</p>
      <div class="bar"><span style="width:${pct}%"></span></div>` : "";

    drawer.querySelector(".drawer-body").innerHTML = items.length ? items.map((l, i) => {
      const p = byId(l.id);
      if (!p) return "";
      const wrapName = WRAPS.find((w) => w.id === l.wrap)?.name || "";
      return `
        <div class="line">
          <a href="product.html?id=${p.id}"><img src="${p.images[0]}" alt=""></a>
          <div class="line-info">
            <a href="product.html?id=${p.id}" class="line-title">${esc(p.name)}</a>
            <small>${wrapName}${l.note ? ` · “${esc(l.note.slice(0, 40))}${l.note.length > 40 ? "…" : ""}”` : ""}</small>
            <div class="line-row">
              <div class="qty">
                <button data-qty="${i}" data-delta="-1" aria-label="Decrease">−</button>
                <span>${l.qty}</span>
                <button data-qty="${i}" data-delta="1" aria-label="Increase">+</button>
              </div>
              <b>${money(p.price * l.qty)}</b>
            </div>
          </div>
          <button class="line-remove" data-remove="${i}" aria-label="Remove">${icon.close}</button>
        </div>`;
    }).join("") : `
      <div class="empty">
        <p>Your bag is empty.</p>
        <a class="btn btn-primary" href="collection.html">Start gifting</a>
      </div>`;

    drawer.querySelector(".drawer-foot").innerHTML = items.length ? `
      <label class="wrap-toggle">
        <input type="checkbox" data-giftwrap ${wrap ? "checked" : ""}>
        <span>Add premium gift wrap & wax seal <b>+${money(GIFT_WRAP_FEE)}</b></span>
      </label>
      <div class="sum-row"><span>Subtotal</span><b>${money(subtotal + (wrap ? GIFT_WRAP_FEE : 0))}</b></div>
      <p class="muted small">Taxes included. Shipping calculated at checkout.</p>
      <a class="btn btn-primary btn-block" href="checkout.html">Checkout</a>` : "";
  }

  function updateCounts() {
    const c = cart.count(), w = wishlist.ids().length;
    document.querySelectorAll('[data-count="cart"]').forEach((e) => { e.textContent = c || ""; });
    document.querySelectorAll('[data-count="wish"]').forEach((e) => { e.textContent = w || ""; });
  }

  // ---------- panels ----------
  function open(id) {
    closeAll();
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("lock");
    if (id === "search") setTimeout(() => el.querySelector("input").focus(), 50);
  }
  function closeAll() {
    document.querySelectorAll(".drawer.is-open, .search-panel.is-open").forEach((el) => {
      el.classList.remove("is-open");
      el.setAttribute("aria-hidden", "true");
    });
    document.body.classList.remove("lock");
  }

  let toastTimer;
  function toast(msg) {
    const t = document.querySelector(".toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2400);
  }

  // ---------- search ----------
  function searchProducts(q) {
    q = q.trim().toLowerCase();
    if (!q) return [];
    const terms = q.split(/\s+/);
    return PRODUCTS.filter((p) => {
      const hay = (p.name + " " + p.description + " " + p.occasions.join(" ") + " " + p.includes.join(" ")).toLowerCase();
      return terms.every((t) => hay.includes(t.replace(/s$/, "")));
    });
  }

  function renderSearch(q) {
    const box = document.querySelector(".search-results");
    const res = searchProducts(q);
    if (!q.trim()) { box.innerHTML = ""; return; }
    box.innerHTML = res.length ? `
      <div class="search-grid">${res.slice(0, 6).map((p) => `
        <a class="search-hit" href="product.html?id=${p.id}">
          <img src="${p.images[0]}" alt=""><span>${esc(p.name)}<b>${money(p.price)}</b></span>
        </a>`).join("")}</div>
      <a class="link" href="collection.html?q=${encodeURIComponent(q)}">See all ${res.length} results →</a>`
      : `<p class="muted">No gifts match “${esc(q)}”. Try “candle” or “hamper”.</p>`;
  }

  // ---------- events ----------
  function bind() {
    document.addEventListener("click", (e) => {
      const t = e.target.closest("[data-open],[data-close],[data-add],[data-wish],[data-qty],[data-remove],[data-term]");
      if (!t) return;
      if (t.dataset.open) { e.preventDefault(); open(t.dataset.open); }
      else if (t.hasAttribute("data-close")) closeAll();
      else if (t.dataset.add) {
        e.preventDefault();
        cart.add(t.dataset.add);
        open("cart");
      }
      else if (t.dataset.wish) { e.preventDefault(); wishlist.toggle(t.dataset.wish); }
      else if (t.dataset.qty) {
        const i = +t.dataset.qty;
        cart.update(i, cart.items()[i].qty + +t.dataset.delta);
      }
      else if (t.dataset.remove) cart.update(+t.dataset.remove, 0);
      else if (t.dataset.term) {
        const input = document.querySelector(".search-bar input");
        input.value = t.dataset.term;
        renderSearch(input.value);
      }
    });

    document.addEventListener("change", (e) => {
      if (e.target.matches("[data-giftwrap]")) cart.setGiftWrap(e.target.checked);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAll();
      if (e.key === "Enter" && e.target.matches(".search-bar input") && e.target.value.trim()) {
        location.href = `collection.html?q=${encodeURIComponent(e.target.value.trim())}`;
      }
    });

    document.addEventListener("input", (e) => {
      if (e.target.matches(".search-bar input")) renderSearch(e.target.value);
    });

    document.addEventListener("submit", (e) => {
      const f = e.target.closest("[data-form]");
      if (!f) return;
      e.preventDefault();
      const messages = {
        newsletter: "You're on the list. Welcome to Shivara!",
        corporate: "Thanks! Our gifting team will reach out within one working day."
      };
      toast(messages[f.dataset.form] || "Submitted");
      f.reset();
    });
  }

  // ---------- boot ----------
  renderHeader();
  renderFooter();
  renderOverlays();
  renderCart();
  updateCounts();
  bind();

  window.SV = { money, byId, esc, param, stars, priceHTML, productCard, cart, wishlist, toast, open, searchProducts, icon, FREE_SHIPPING_AT, GIFT_WRAP_FEE };
})();
