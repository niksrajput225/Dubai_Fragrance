/**
 * Dubai Fragrances - Wishlist Engine
 * Handles wishlist persistence, syncing with product cards, and drawer management.
 */

const WISHLIST_STORAGE_KEY = "df_wishlist";

function getWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading wishlist:", e);
    return [];
  }
}

function saveWishlist(items) {
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    updateWishlistBadges();
    syncHeartButtons();
  } catch (e) {
    console.error("Error saving wishlist:", e);
  }
}

function isInWishlist(productId) {
  const list = getWishlist();
  return list.includes(productId);
}

function toggleWishlist(productId) {
  let list = getWishlist();
  const product = getProductById(productId);
  const prodName = product ? product.name : "Attar";

  if (list.includes(productId)) {
    list = list.filter(id => id !== productId);
    saveWishlist(list);
    showToast(`Removed "${prodName}" from wishlist`, "info");
  } else {
    list.push(productId);
    saveWishlist(list);
    showToast(`Added "${prodName}" to your wishlist ❤️`, "success");
  }

  renderWishlistDrawer();
}

function updateWishlistBadges() {
  const count = getWishlist().length;
  const badges = document.querySelectorAll(".wishlist-count-badge");
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove("hidden");
    } else {
      badge.classList.add("hidden");
    }
  });
}

function syncHeartButtons() {
  const list = getWishlist();
  const buttons = document.querySelectorAll("[data-wishlist-id]");
  buttons.forEach(btn => {
    const id = btn.getAttribute("data-wishlist-id");
    const isWishlisted = list.includes(id);
    const icon = btn.querySelector("i, svg");

    if (isWishlisted) {
      btn.classList.add("text-rose-500", "active-wishlist");
      btn.classList.remove("text-gold-300", "text-zinc-400");
      if (icon) {
        icon.classList.add("fill-rose-500");
      }
    } else {
      btn.classList.remove("text-rose-500", "active-wishlist");
      btn.classList.add("text-zinc-400");
      if (icon) {
        icon.classList.remove("fill-rose-500");
      }
    }
  });
}

function openWishlistDrawer() {
  renderWishlistDrawer();
  const drawer = document.getElementById("wishlistDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    backdrop.classList.remove("hidden");
    drawer.classList.remove("translate-x-full");
    document.body.style.overflow = "hidden";
  }
}

function closeWishlistDrawer() {
  const drawer = document.getElementById("wishlistDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  if (drawer && backdrop) {
    drawer.classList.add("translate-x-full");
    backdrop.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function renderWishlistDrawer() {
  const container = document.getElementById("wishlistDrawerItems");
  const countLabel = document.getElementById("wishlistDrawerCount");
  if (!container) return;

  const wishlistIds = getWishlist();
  if (countLabel) {
    countLabel.textContent = `(${wishlistIds.length} items)`;
  }

  if (wishlistIds.length === 0) {
    container.innerHTML = `
      <div class="flex flex-col items-center justify-center py-16 text-center px-4">
        <div class="w-16 h-16 rounded-full bg-onyx-800 border border-gold-500/20 flex items-center justify-center mb-4 text-gold-400">
          <i data-lucide="heart" class="w-8 h-8 opacity-40"></i>
        </div>
        <h4 class="font-serif text-lg text-white font-medium mb-1">Your Royal Wishlist is Empty</h4>
        <p class="text-zinc-400 text-xs max-w-xs mb-6">Explore our artisanal collection and tap the heart icon on your favorite blends.</p>
        <button onclick="closeWishlistDrawer()" class="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold-500 to-amber-600 text-black font-semibold text-xs uppercase tracking-wider hover:opacity-95 transition-all shadow-gold">
          Explore Blends
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  const itemsHtml = wishlistIds.map(id => {
    const product = getProductById(id);
    if (!product) return "";

    const priceInfo = getPriceForSize(product, "3ml");

    return `
      <div class="flex items-center gap-3 p-3 rounded-xl bg-onyx-800/80 border border-zinc-800/80 hover:border-gold-500/30 transition-all group">
        <img src="${product.image}" alt="${product.name}" class="w-16 h-16 rounded-lg object-cover border border-gold-500/20" />
        <div class="flex-1 min-w-0">
          <span class="text-[10px] tracking-wider uppercase text-gold-400 font-semibold">${product.category}</span>
          <h5 class="text-sm font-medium text-white truncate group-hover:text-gold-300 transition-colors">${product.name}</h5>
          <div class="flex items-center gap-2 mt-1">
            <span class="text-sm font-bold text-gold-400">₹${priceInfo.price}</span>
            <span class="text-xs text-zinc-500 line-through">₹${priceInfo.originalPrice}</span>
            <span class="text-[10px] text-emerald-400 font-medium">Save ${priceInfo.savingsPct}%</span>
          </div>
        </div>
        <div class="flex flex-col items-end gap-2">
          <button onclick="toggleWishlist('${product.id}')" title="Remove" class="text-zinc-400 hover:text-rose-400 p-1 transition-colors">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
          <button onclick="moveWishlistToCart('${product.id}')" class="px-3 py-1 rounded-md bg-gold-500/10 hover:bg-gold-500 text-gold-400 hover:text-black border border-gold-500/30 text-xs font-semibold tracking-wide transition-all">
            + Bag
          </button>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = itemsHtml;
  if (window.lucide) lucide.createIcons();
}

function moveWishlistToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const defaultSize = product.fixedSize ? "fixed" : "3ml";
  addToCart(productId, defaultSize, 1);
  toggleWishlist(productId);
  openCartDrawer();
}

// Global initialization for wishlist
document.addEventListener("DOMContentLoaded", () => {
  updateWishlistBadges();
  syncHeartButtons();
});
