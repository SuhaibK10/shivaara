// Checkout prototype: contact, address, delivery, payment, order summary, confirmation.
// In production this hands off to Shopify / GoKwik checkout instead.
(function () {
  const { cart, byId, money, esc, FREE_SHIPPING_AT, GIFT_WRAP_FEE } = SV;
  const root = document.getElementById("checkout");
  const SHIPPING_FEE = 79;
  const COD_FEE = 49;
  const COUPONS = { SHIVAARA10: 0.1, DIWALI15: 0.15 };
  const STATES = ["Andhra Pradesh", "Assam", "Bihar", "Chandigarh", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh",
    "Jammu & Kashmir", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu",
    "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"];

  let coupon = null;

  function totals(payment) {
    const subtotal = cart.subtotal();
    const wrap = cart.giftWrap() ? GIFT_WRAP_FEE : 0;
    const discount = coupon ? Math.round(subtotal * COUPONS[coupon]) : 0;
    const shipping = subtotal >= FREE_SHIPPING_AT ? 0 : SHIPPING_FEE;
    const cod = payment === "cod" ? COD_FEE : 0;
    return { subtotal, wrap, discount, shipping, cod, total: subtotal + wrap - discount + shipping + cod };
  }

  if (!cart.items().length) {
    root.innerHTML = `<div class="empty wide"><h2>Your bag is empty</h2><a class="btn btn-primary" href="collection.html">Find a gift</a></div>`;
    return;
  }

  root.innerHTML = `
    <div class="checkout">
      <form id="co-form" novalidate>
        <section class="co-step">
          <h2>Contact</h2>
          <div class="field-row">
            <label>Mobile number<input name="phone" type="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" required placeholder="10-digit mobile"></label>
            <label>Email<input name="email" type="email" required></label>
          </div>
          <label class="check"><input type="checkbox" checked> Send me order updates on WhatsApp</label>
        </section>

        <section class="co-step">
          <h2>Delivery address</h2>
          <label class="check"><input type="checkbox" id="is-gift" checked> This is a gift. Hide prices on the packing slip.</label>
          <div class="field-row">
            <label>Recipient's full name<input name="name" required></label>
            <label>Recipient's phone<input name="rphone" type="tel" inputmode="numeric" pattern="[6-9][0-9]{9}" maxlength="10" required></label>
          </div>
          <label>Flat, house, building<input name="line1" required></label>
          <label>Area, street, landmark<input name="line2"></label>
          <div class="field-row three">
            <label>Pincode<input name="pin" inputmode="numeric" pattern="[1-9][0-9]{5}" maxlength="6" required></label>
            <label>City<input name="city" required></label>
            <label>State<select name="state" required><option value="">Select</option>${STATES.map((s) => `<option>${s}</option>`).join("")}</select></label>
          </div>
          <label>Preferred delivery date <small class="muted">(we'll try our best)</small><input type="date" name="date"></label>
        </section>

        <section class="co-step">
          <h2>Payment</h2>
          <div class="pay-options">
            <label class="pay"><input type="radio" name="pay" value="upi" checked><span><b>UPI</b><small>GPay, PhonePe, Paytm, BHIM</small></span></label>
            <label class="pay"><input type="radio" name="pay" value="card"><span><b>Credit / Debit card</b><small>Visa, Mastercard, RuPay, Amex</small></span></label>
            <label class="pay"><input type="radio" name="pay" value="netbanking"><span><b>Netbanking</b><small>All major banks</small></span></label>
            <label class="pay"><input type="radio" name="pay" value="cod"><span><b>Cash on delivery</b><small>+${money(COD_FEE)} handling fee</small></span></label>
          </div>
        </section>

        <p class="form-error" id="co-error" role="alert"></p>
        <button class="btn btn-primary btn-block btn-lg" type="submit" id="place">Place order</button>
      </form>

      <aside class="summary">
        <h2>Order summary</h2>
        <div class="summary-lines">${cart.items().map((l) => {
          const p = byId(l.id);
          return p ? `<div class="s-line"><span class="s-img"><img src="${p.images[0]}" alt=""><i>${l.qty}</i></span>
            <span class="s-name">${esc(p.name)}${l.note ? `<small>Note: “${esc(l.note)}”</small>` : ""}</span><b>${money(p.price * l.qty)}</b></div>` : "";
        }).join("")}</div>
        <form class="inline-form coupon" id="coupon">
          <input placeholder="Discount code" aria-label="Discount code">
          <button class="btn btn-outline" type="submit">Apply</button>
        </form>
        <p class="small muted" id="coupon-msg">Try SHIVAARA10</p>
        <div id="sum-totals"></div>
      </aside>
    </div>`;

  const form = document.getElementById("co-form");
  const pay = () => form.querySelector("input[name=pay]:checked").value;

  function renderTotals() {
    const t = totals(pay());
    document.getElementById("sum-totals").innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      ${t.wrap ? `<div class="sum-row"><span>Premium gift wrap</span><span>${money(t.wrap)}</span></div>` : ""}
      ${t.discount ? `<div class="sum-row ok"><span>Discount (${coupon})</span><span>−${money(t.discount)}</span></div>` : ""}
      <div class="sum-row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : "Free"}</span></div>
      ${t.cod ? `<div class="sum-row"><span>COD fee</span><span>${money(t.cod)}</span></div>` : ""}
      <div class="sum-row total"><span>Total</span><b>${money(t.total)}</b></div>`;
    document.getElementById("place").textContent = `${pay() === "cod" ? "Place COD order" : "Pay"} · ${money(t.total)}`;
  }

  form.addEventListener("change", (e) => { if (e.target.name === "pay") renderTotals(); });

  document.getElementById("coupon").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = e.target.querySelector("input").value.trim().toUpperCase();
    const msg = document.getElementById("coupon-msg");
    if (COUPONS[code]) { coupon = code; msg.className = "small ok"; msg.textContent = `${code} applied: ${COUPONS[code] * 100}% off`; }
    else { coupon = null; msg.className = "small err"; msg.textContent = "That code isn't valid."; }
    renderTotals();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const err = document.getElementById("co-error");
    const bad = [...form.querySelectorAll("input, select")].find((i) => !i.checkValidity());
    if (bad) {
      err.textContent = "Please check the highlighted field.";
      form.classList.add("show-errors");
      bad.focus();
      return;
    }
    const t = totals(pay());
    const data = Object.fromEntries(new FormData(form));
    const orderNo = "SV" + Date.now().toString().slice(-7);
    cart.clear();
    root.innerHTML = `
      <div class="confirm">
        <div class="confirm-mark">✦</div>
        <h1>Thank you, your gift is on its way to being wrapped</h1>
        <p>Order <b>#${orderNo}</b> · ${money(t.total)} · ${data.pay === "cod" ? "Cash on delivery" : "Paid"}</p>
        <p class="muted">Delivering to ${esc(data.name)}, ${esc(data.city)} ${esc(data.pin)}. We've sent updates to ${esc(data.phone)}.</p>
        <a class="btn btn-primary" href="index.html">Continue shopping</a>
      </div>`;
    window.scrollTo(0, 0);
  });

  renderTotals();
})();
