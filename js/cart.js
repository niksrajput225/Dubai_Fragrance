/**
 * Dubai Fragrances - Shopping Cart & Cash On Delivery (COD) Checkout Engine
 * Pure client-side state backed by localStorage (df_cart).
 * Features dynamic size pricing, line-item totals, free shipping progress,
 * user authentication gating, and automated WhatsApp order dispatching.
 */

const CART_STORAGE_KEY = "df_cart";
const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 49;
const STORE_WHATSAPP_NUMBER = "919876543210"; // Can be replaced by store owner

// Holds temporary single-item direct checkout if "Buy COD" is clicked on a card
let directCheckoutItem = null;

function getCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading cart:", e);
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadges();
    renderCartDrawer();
  } catch (e) {
    console.error("Error saving cart:", e);
  }
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateCartBadges() {
  const count = getCartCount();
  const badges = document.querySelectorAll(".cart-count-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });
}

/**
 * Add an item to the cart keyed by productId and size
 */
function addToCart(productId, size = "3ml", quantity = 1) {
  const product = getProductById(productId);
  if (!product) return;

  const resolvedSize = product.fixedSize ? "fixed" : size;
  const priceDetails = getPriceForSize(product, resolvedSize);
  const cartKey = `${productId}__${resolvedSize}`;

  let cart = getCart();
  const existingIndex = cart.findIndex(item => item.key === cartKey);

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      key: cartKey,
      productId: product.id,
      name: product.name,
      category: product.category,
      size: resolvedSize,
      sizeLabel: priceDetails.sizeLabel,
      price: priceDetails.price,
      originalPrice: priceDetails.originalPrice,
      image: product.image,
      quantity: quantity
    });
  }

  saveCart(cart);
  showToast(`Added ${product.name} (${priceDetails.sizeLabel}) to your Bag! 🛍️`, "success");
}

function updateQuantity(cartKey, delta) {
  let cart = getCart();
  const itemIndex = cart.findIndex(i => i.key === cartKey);
  if (itemIndex === -1) return;

  cart[itemIndex].quantity += delta;
  if (cart[itemIndex].quantity <= 0) {
    const removedName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    showToast(`Removed "${removedName}" from Bag`, "info");
  }

  saveCart(cart);
}

function removeFromCart(cartKey) {
  let cart = getCart();
  const item = cart.find(i => i.key === cartKey);
  cart = cart.filter(i => i.key !== cartKey);
  saveCart(cart);
  if (item) {
    showToast(`Removed "${item.name}" from Bag`, "info");
  }
}

function clearCart() {
  saveCart([]);
}

/**
 * Cart Drawer Open / Close Controls
 */
function openCartDrawer() {
  renderCartDrawer();
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.remove("hidden");
    drawer.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    drawer.classList.add("translate-x-full");
    backdrop.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/**
 * Render Cart Drawer markup
 */
function renderCartDrawer() {
  const container = document.getElementById("cartDrawerItems");
  const subtotalEl = document.getElementById("cartDrawerSubtotal");
  const countLabel = document.getElementById("cartDrawerCount");
  const freeShippingText = document.getElementById("freeShippingText");
  const freeShippingBar = document.getElementById("freeShippingBar");
  const checkoutBtn = document.getElementById("cartDrawerCheckoutBtn");

  if (!container) return;

  const cart = getCart();
  const subtotal = getCartSubtotal();
  const totalCount = getCartCount();

  if (countLabel) countLabel.textContent = `(${totalCount} items)`;
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;

  // Update Free Shipping Progress Bar
  if (freeShippingText && freeShippingBar) {
    if (subtotal >= FREE_SHIPPING_THRESHOLD) {
      freeShippingText.innerHTML = `🎉 <span class="text-emerald-400 font-semibold">Congratulations!</span> You unlocked <span class="text-gold-300 font-bold">FREE Royal Delivery</span>!`;
      freeShippingBar.style.width = "100%";
      freeShippingBar.className = "h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-teal-400";
    } else {
      const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
      const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));
      freeShippingText.innerHTML = `Add <span class="text-gold-400 font-bold">₹${remaining.toLocaleString("en-IN")}</span> more to unlock <span class="text-white font-semibold">FREE Royal Delivery</span>`;
      freeShippingBar.style.width = `${progress}%`;
      freeShippingBar.className = "h-full rounded-full transition-all duration-500 bg-gradient-to-r from-gold-500 to-amber-500";
    }
  }

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
    if (cart.length === 0) {
      checkoutBtn.classList.add("opacity-50", "cursor-not-allowed");
    } else {
      checkoutBtn.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center px-4">
        <div class="w-16 h-16 rounded-full bg-onyx-800 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400">
          <i data-lucide="shopping-bag" class="w-8 h-8 opacity-40"></i>
        </div>
        <h4 class="font-serif text-lg text-white font-medium mb-1">Your Fragrance Bag is Empty</h4>
        <p class="text-zinc-400 text-xs max-w-xs mb-6">Discover our artisanal attars, pure musks, and rare agarwood oils.</p>
        <button onclick="closeCartDrawer()" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-gold">
          Start Shopping
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const itemsHtml = cart.map(item => {
    const lineTotal = item.price * item.quantity;
    return `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-onyx-800/80 border border-zinc-800/80 hover:border-gold-500/30 transition-all">
        <img src="${item.image}" alt="${item.name}" class="w-16 h-16 rounded-lg object-cover border border-gold-500/20 shrink-0" />
        <div class="flex-1 min-w-0">
          <h5 class="text-sm font-medium text-white truncate">${item.name}</h5>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-gold-500/10 text-gold-400 border border-gold-500/20">
              ${item.sizeLabel}
            </span>
            <span class="text-xs text-gold-400 font-bold">₹${item.price}</span>
            <span class="text-[10px] text-zinc-500 line-through">₹${item.originalPrice}</span>
          </div>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center border border-zinc-700 rounded-lg overflow-hidden bg-onyx-900">
              <button onclick="updateQuantity('${item.key}', -1)" class="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:bg-onyx-800 transition-colors">
                <i data-lucide="minus" class="w-3.5 h-3.5"></i>
              </button>
              <span class="w-8 text-center text-xs font-semibold text-white">${item.quantity}</span>
              <button onclick="updateQuantity('${item.key}', 1)" class="w-7 h-7 flex items-center justify-center text-zinc-300 hover:text-gold-400 hover:bg-onyx-800 transition-colors">
                <i data-lucide="plus" class="w-3.5 h-3.5"></i>
              </button>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-white">₹${lineTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
        <button onclick="removeFromCart('${item.key}')" title="Remove" class="text-zinc-500 hover:text-rose-400 p-1.5 transition-colors self-start">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
  }).join("");

  container.innerHTML = itemsHtml;
  if (window.lucide) lucide.createIcons();
}

/**
 * =========================================================
 * CASH ON DELIVERY (COD) CHECKOUT ENGINE & MODAL CONTROLLERS
 * WITH MANDATORY USER ACCOUNT GATING
 * =========================================================
 */

/**
 * Trigger COD Modal for direct single item ("Buy COD" on card)
 * Gated: Requires user account creation first!
 */
function buyNowCOD(productId, size) {
  // Check user authentication
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    showToast("Please create an account or sign in to place your order 👑", "warning");
    if (typeof openAuthModal === "function") {
      openAuthModal({ type: "direct_buy", productId, size }, "signup");
    }
    return;
  }

  const product = getProductById(productId);
  if (!product) return;

  const resolvedSize = product.fixedSize ? "fixed" : size;
  const priceDetails = getPriceForSize(product, resolvedSize);

  directCheckoutItem = {
    key: `${productId}__${resolvedSize}`,
    productId: product.id,
    name: product.name,
    category: product.category,
    size: resolvedSize,
    sizeLabel: priceDetails.sizeLabel,
    price: priceDetails.price,
    originalPrice: priceDetails.originalPrice,
    image: product.image,
    quantity: 1
  };

  openCheckoutModal([directCheckoutItem]);
}

/**
 * Trigger COD Modal for the entire Cart ("Proceed to COD" from drawer)
 * Gated: Requires user account creation first!
 */
function proceedToCartCheckout() {
  const cart = getCart();
  if (cart.length === 0) {
    showToast("Your bag is empty! Add an attar first.", "warning");
    return;
  }

  // Check user authentication
  const currentUser = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!currentUser) {
    showToast("Please create an account or sign in to place your order 👑", "warning");
    if (typeof openAuthModal === "function") {
      openAuthModal({ type: "cart_checkout" }, "signup");
    }
    return;
  }

  directCheckoutItem = null; // Indicates checking out full cart
  closeCartDrawer();
  openCheckoutModal(cart);
}

function openCheckoutModal(itemsToCheckout) {
  const modal = document.getElementById("checkoutModal");
  if (!modal) return;

  renderCheckoutSummary(itemsToCheckout);

  // Autofill current user information into form
  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  const form = modal.querySelector("form");
  if (form && user) {
    if (form.fullName) form.fullName.value = user.name || "";
    if (form.phone) form.phone.value = user.phone || "";
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeCheckoutModal() {
  const modal = document.getElementById("checkoutModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function renderCheckoutSummary(items) {
  const summaryContainer = document.getElementById("checkoutItemsSummary");
  const subtotalEl = document.getElementById("checkoutSubtotal");
  const shippingEl = document.getElementById("checkoutShipping");
  const codFeeEl = document.getElementById("checkoutCodFee");
  const totalEl = document.getElementById("checkoutTotalPayable");

  if (!summaryContainer) return;

  let subtotal = 0;
  const itemsHtml = items.map(item => {
    const lineTotal = item.price * item.quantity;
    subtotal += lineTotal;
    return `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-zinc-800/60 last:border-0">
        <div class="flex items-center gap-2 truncate pr-2">
          <span class="w-4 h-4 rounded-full bg-gold-500/20 text-gold-400 text-[10px] flex items-center justify-center font-bold shrink-0">
            ${item.quantity}
          </span>
          <span class="text-zinc-200 truncate">${item.name}</span>
          <span class="text-zinc-500 text-[10px]">(${item.sizeLabel})</span>
        </div>
        <span class="font-semibold text-gold-400 shrink-0">₹${lineTotal.toLocaleString("en-IN")}</span>
      </div>
    `;
  }).join("");

  summaryContainer.innerHTML = itemsHtml;

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const shippingCharge = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const totalPayable = subtotal + shippingCharge;

  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  if (shippingEl) {
    shippingEl.innerHTML = isFreeShipping
      ? `<span class="text-emerald-400 font-bold">FREE</span>`
      : `₹${shippingCharge}`;
  }
  if (codFeeEl) codFeeEl.innerHTML = `<span class="text-emerald-400 font-bold">₹0 (FREE)</span>`;
  if (totalEl) totalEl.textContent = `₹${totalPayable.toLocaleString("en-IN")}`;
}

/**
 * Handle Order Submission & Generate WhatsApp Confirmation
 */
function handleCheckoutFormSubmit(event) {
  event.preventDefault();

  const user = typeof getCurrentUser === "function" ? getCurrentUser() : null;
  if (!user) {
    showToast("Please sign in or create an account to proceed.", "warning");
    closeCheckoutModal();
    if (typeof openAuthModal === "function") openAuthModal();
    return;
  }

  const form = event.target;
  const fullName = form.fullName.value.trim();
  const phone = form.phone.value.trim();
  const address = form.address.value.trim();
  const city = form.city.value.trim();
  const pincode = form.pincode.value.trim();
  const notes = form.notes ? form.notes.value.trim() : "";

  // Validation
  if (!fullName || !phone || !address || !city || !pincode) {
    showToast("Please fill in all required delivery details.", "error");
    return;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone.replace(/\s+/g, ""))) {
    showToast("Please enter a valid 10-digit Indian mobile number.", "error");
    return;
  }

  const pincodeRegex = /^\d{6}$/;
  if (!pincodeRegex.test(pincode.replace(/\s+/g, ""))) {
    showToast("Please enter a valid 6-digit postal pincode.", "error");
    return;
  }

  // Determine items being purchased
  const items = directCheckoutItem ? [directCheckoutItem] : getCart();
  if (items.length === 0) {
    showToast("No items found to checkout!", "error");
    return;
  }

  let subtotal = 0;
  items.forEach(i => {
    subtotal += i.price * i.quantity;
  });

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
  const totalPayable = subtotal + shipping;

  // Generate Unique Order ID (DF-XXXXXX)
  const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const orderId = `DF-${randomCode}`;

  const orderData = {
    orderId: orderId,
    userId: user.id,
    date: new Date().toISOString(),
    customer: { fullName, phone, email: user.email, address, city, pincode, notes },
    paymentMethod: "Cash On Delivery (COD)",
    items: items,
    subtotal: subtotal,
    shipping: shipping,
    totalPayable: totalPayable
  };

  // Persist order in local history
  try {
    const orders = JSON.parse(localStorage.getItem("df_orders") || "[]");
    orders.unshift(orderData);
    localStorage.setItem("df_orders", JSON.stringify(orders));
  } catch (e) {
    console.error("Failed to save order to history:", e);
  }

  // If this was checked out from the main cart, clear it now
  if (!directCheckoutItem) {
    clearCart();
  }

  // Close checkout modal & open order confirmation modal
  closeCheckoutModal();
  openOrderSuccessModal(orderData);
  form.reset();
}

/**
 * Order Success Modal & WhatsApp Integration
 */
function openOrderSuccessModal(orderData) {
  const modal = document.getElementById("orderSuccessModal");
  if (!modal) return;

  // Fill in order details
  const idEl = document.getElementById("successOrderId");
  const nameEl = document.getElementById("successCustomerName");
  const phoneEl = document.getElementById("successCustomerPhone");
  const addressEl = document.getElementById("successCustomerAddress");
  const amountEl = document.getElementById("successTotalAmount");
  const whatsappBtn = document.getElementById("sendOrderWhatsAppBtn");

  if (idEl) idEl.textContent = orderData.orderId;
  if (nameEl) nameEl.textContent = orderData.customer.fullName;
  if (phoneEl) phoneEl.textContent = orderData.customer.phone;
  if (addressEl) {
    addressEl.textContent = `${orderData.customer.address}, ${orderData.customer.city} - ${orderData.customer.pincode}`;
  }
  if (amountEl) amountEl.textContent = `₹${orderData.totalPayable.toLocaleString("en-IN")}`;

  // Build formatted WhatsApp message
  const itemsText = orderData.items
    .map((item, idx) => `${idx + 1}. *${item.name}* (${item.sizeLabel}) x ${item.quantity} = ₹${(item.price * item.quantity).toLocaleString("en-IN")}`)
    .join("\n");

  const waMessage = `👑 *NEW COD ORDER CONFIRMATION* 👑
------------------------------------
*Order ID:* ${orderData.orderId}
*Customer:* ${orderData.customer.fullName}
*Phone:* +91 ${orderData.customer.phone}

📦 *Delivery Address:*
${orderData.customer.address}, ${orderData.customer.city} - ${orderData.customer.pincode}
${orderData.customer.notes ? `*Note:* ${orderData.customer.notes}\n` : ""}
------------------------------------
🛍️ *Items Ordered:*
${itemsText}

------------------------------------
*Subtotal:* ₹${orderData.subtotal.toLocaleString("en-IN")}
*Shipping:* ${orderData.shipping === 0 ? "FREE" : "₹" + orderData.shipping}
*Payment Mode:* Cash On Delivery (COD)
💰 *Total Payable at Doorstep:* ₹${orderData.totalPayable.toLocaleString("en-IN")}
------------------------------------
Please verify and dispatch my order. Thank you!`;

  const encodedMsg = encodeURIComponent(waMessage);
  const waUrl = `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodedMsg}`;

  if (whatsappBtn) {
    whatsappBtn.href = waUrl;
    whatsappBtn.setAttribute("target", "_blank");
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (window.lucide) lucide.createIcons();
}

function closeOrderSuccessModal() {
  const modal = document.getElementById("orderSuccessModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

// Initial badge sync on DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();
});
