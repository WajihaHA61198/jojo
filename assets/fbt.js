document.addEventListener("DOMContentLoaded", function () {
  const fbtSection = document.querySelector(".t4s-fbt__wrap");
  if (!fbtSection) return;

  const form = fbtSection.querySelector("form[data-groups-pr-form]");
  if (!form) return;

  const checkboxes = form.querySelectorAll("[data-groups-pr-ck]");
  const totalEl = fbtSection.querySelector("[data-groups-total-price]");
  const submitBtnContainer = fbtSection.querySelector(".t4s-col-auto.is--col-fbt-total-price");
  const submitBtn = form.querySelector('[type="submit"]');
  const btnText = submitBtn?.querySelector('.t4s-btn-atc_text');
  const spinner = submitBtn?.querySelector('.t4s-loading__spinner');

  // --- Lock main product checkbox
  const mainCheckbox = checkboxes[0];
  if (mainCheckbox) {
    mainCheckbox.checked = true;
    mainCheckbox.disabled = true;
  }

 // --- Create error message element below total price and above submit button
let errorEl = document.createElement("div");
errorEl.className = "t4s-fbt__error-message";
errorEl.style.color = "red";
errorEl.style.margin = "5px 0";
errorEl.style.fontWeight = "bold";
errorEl.style.display = "none";
submitBtnContainer.insertBefore(errorEl, submitBtn);

// --- Function to show error and hide after 5 seconds
function showError(message) {
  errorEl.innerText = message;
  errorEl.style.display = "block";
  setTimeout(() => {
    errorEl.style.display = "none";
  }, 5000);
}

  // --- Format money
  function formatMoney(cents) {
    const amount = cents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: {{ shop.currency | json }},
    }).format(amount);
  }

  // --- Recalculate total
  // --- Recalculate total & toggle images
function recalcTotal() {
  let total = 0;
  checkboxes.forEach((ck, idx) => {
    const item = ck.closest("[data-groups-pr-item]");
    const price = parseInt(item.querySelector("[data-price]")?.dataset.price || 0);

    // Toggle image visibility
    const imgLi = fbtSection.querySelector(`.t4s-fbt__list-img li[data-groups-img="${idx}"]`);
    if (imgLi) {
      if (ck.checked) {
        imgLi.classList.remove("is-hiding", "is-hidden");
        setTimeout(() => imgLi.classList.remove("is-hiding"), 10); // fade-in animation
      } else {
        imgLi.classList.add("is-hiding");
        setTimeout(() => imgLi.classList.add("is-hidden"), 350); // after transition
      }
    }

    if (ck.checked) total += price;
  });

  if (totalEl) totalEl.innerHTML = formatMoney(total);
}

checkboxes.forEach((ck) => ck.addEventListener("change", recalcTotal));


  // --- Handle FBT Add to Cart with quantity check
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // --- Reset error message
    errorEl.style.display = "none";
    errorEl.innerText = "";

    // --- Get main product quantity
    const mainItem = form.querySelector("[data-groups-pr-item]");
    const mainQtyInput = mainItem?.querySelector('[name="items[][quantity]"]');
    const mainQty = parseInt(mainQtyInput?.value || 0);

    const available_v = mainItem ? mainItem.querySelectorAll("option, [data-price]") : [];
    let minQty = 1;

    // Attempt to get min quantity from variant data
    const selectedOption = mainItem?.querySelector("select");
    if (selectedOption) {
      const selected = selectedOption.selectedOptions[0];
      if (selected && selected.dataset.min) {
        minQty = parseInt(selected.dataset.min, 10);
      }
    }

    // --- Check quantity
    if (mainQty < minQty) {
      errorEl.innerText = `Minimum quantity for this product is ${minQty}.`;
      errorEl.style.display = "block";
      return;
    }

    // --- Collect items to add
    const itemsToAdd = [];
    form.querySelectorAll("[data-groups-pr-item]").forEach((item) => {
      const ck = item.querySelector("[data-groups-pr-ck]");
      if (!ck.checked) return;

      const variantInput = item.querySelector('[name="items[][id]"]');
      const qtyInput = item.querySelector('[name="items[][quantity]"]');
      if (variantInput && qtyInput) {
        itemsToAdd.push({
          id: parseInt(variantInput.value, 10),
          quantity: parseInt(qtyInput.value, 10) || 1,
        });
      }
    });

    if (!itemsToAdd.length) return;

    // --- Button loading state
    submitBtn.disabled = true;
    if (btnText) btnText.hidden = true;
    if (spinner) spinner.hidden = false;

    try {
      const response = await fetch("/cart/add.js", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: itemsToAdd }),
      });

      if (response.ok) {
        await refreshCartDrawer();
      } else {
        const errText = await response.text();
        console.error("FBT add failed:", errText);
        {% comment %} errorEl.innerText = "The maximum quantity of this item is already in your cart."; {% endcomment %}
        showError("The maximum quantity of this item is already in your cart.");
      }
    } catch (err) {
      console.error("FBT add error:", err);
      errorEl.innerText = "Failed to add products to cart.";
      errorEl.style.display = "block";
    }

    // --- Reset button
    submitBtn.disabled = false;
    if (btnText) btnText.hidden = false;
    if (spinner) spinner.hidden = true;
  });

  // --- Refresh & open Dawn cart drawer
  async function refreshCartDrawer() {
    const cartDrawer = document.querySelector("cart-drawer");
    if (!cartDrawer) return;

    const cartResponse = await fetch("/cart.js");
    const cart = await cartResponse.json();

    const cartCountBubbles = document.querySelectorAll(".cart-count-bubble, [data-ajax-cart-bubble]");
    cartCountBubbles.forEach(bubble => {
      const countElement = bubble.querySelector(".quantity, span") || bubble;
      if (countElement) countElement.textContent = cart.item_count;
    });

    const html = await fetch("/cart?section_id=cart-drawer").then(r => r.text());
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const newCartDrawer = doc.querySelector("cart-drawer");

    if (newCartDrawer) {
      cartDrawer.innerHTML = newCartDrawer.innerHTML;
      cartDrawer.classList.remove('is-empty');
    }

    initializeClickOutsideClose(cartDrawer);

    if (typeof cartDrawer.open === "function") cartDrawer.open();
  }

  function initializeClickOutsideClose(cartDrawer) {
    if (cartDrawer._clickOutsideHandler) {
      document.removeEventListener('click', cartDrawer._clickOutsideHandler);
    }

    cartDrawer._clickOutsideHandler = function(event) {
      const isClickInsideDrawer = cartDrawer.contains(event.target);
      const isCartIcon = event.target.closest('.header__icon--cart, [data-drawer-toggle="cart"]');
      
      if (!isClickInsideDrawer && !isCartIcon && cartDrawer.hasAttribute('open')) {
        if (typeof cartDrawer.close === "function") cartDrawer.close();
        else {
          cartDrawer.removeAttribute('open');
          cartDrawer.classList.remove('active');
          document.body.classList.remove('overflow-hidden-mobile');
        }
      }
    };

    document.addEventListener('click', cartDrawer._clickOutsideHandler);

    const overlay = cartDrawer.querySelector('.cart-drawer__overlay');
    if (overlay) overlay.addEventListener('click', () => cartDrawer.close?.());

    const closeButton = cartDrawer.querySelector('.drawer__close');
    if (closeButton) closeButton.addEventListener('click', () => cartDrawer.close?.());
  }
});