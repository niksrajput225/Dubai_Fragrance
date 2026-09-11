/**
 * Dubai Fragrances - Application UI Controller
 * Manages product rendering, instant size switching & dynamic price recalculation,
 * live search, category filtering, olfactory pyramid modal, and toasts.
 */

// Application State
const appState = {
  currentCategory: "All",
  searchQuery: "",
  sortBy: "popular",
  selectedSizes: {}, // Maps productId -> '3ml' | '6ml' | '12ml'
  modalCurrentProduct: null,
  modalCurrentSize: "3ml"
};

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initSearch();
  initCategoryPills();
  initSort();
  renderProducts();
  initMobileNav();
});

/**
 * Renders the products grid based on current filters and search
 */
function renderProducts() {
  const container = document.getElementById("productsGrid");
  const countLabel = document.getElementById("productCountLabel");
  if (!container) return;

  let filtered = [...PRODUCTS];

  // 1. Category Filtering
  if (appState.currentCategory !== "All") {
    filtered = filtered.filter(p => p.category === appState.currentCategory);
  }

  // 2. Search Query Filtering (Searches title, category, description, and fragrance notes)
  if (appState.searchQuery.trim() !== "") {
    const q = appState.searchQuery.toLowerCase().trim();
    filtered = filtered.filter(p => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.category.toLowerCase().includes(q);
      const matchDesc = p.desc.toLowerCase().includes(q);
      const matchTopNotes = p.notes?.top?.toLowerCase().includes(q);
      const matchHeartNotes = p.notes?.heart?.toLowerCase().includes(q);
      const matchBaseNotes = p.notes?.base?.toLowerCase().includes(q);
      return matchName || matchCat || matchDesc || matchTopNotes || matchHeartNotes || matchBaseNotes;
    });
  }

  // 3. Sorting
  if (appState.sortBy === "price-low") {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (appState.sortBy === "price-high") {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else if (appState.sortBy === "rating") {
    filtered.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
  } else if (appState.sortBy === "saving") {
    filtered.sort((a, b) => {
      const saveA = (a.originalPrice - a.basePrice) / a.originalPrice;
      const saveB = (b.originalPrice - b.basePrice) / b.originalPrice;
      return saveB - saveA;
    });
  } else {
    // "popular" / default: combos first or high review count
    filtered.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  // Update product count
  if (countLabel) {
    countLabel.textContent = `Showing ${filtered.length} Artisanal Blends`;
  }

  // Empty state
  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 rounded-full bg-onyx-800 border border-gold-500/20 mx-auto flex items-center justify-center mb-4 text-gold-400">
          <i data-lucide="search-x" class="w-8 h-8 opacity-50"></i>
        </div>
        <h3 class="font-serif text-xl text-white font-medium mb-1">No matching attars found</h3>
        <p class="text-zinc-400 text-sm max-w-sm mx-auto mb-6">
          Try searching for different scent notes like "amber", "oud", "rose", "musk", or clear your current filters.
        </p>
        <button onclick="resetFilters()" class="px-6 py-2.5 rounded-full bg-onyx-800 border border-gold-500/40 text-gold-300 font-semibold text-xs tracking-wider uppercase hover:bg-gold-500 hover:text-black transition-all">
          Clear All Filters
        </button>
      </div>
    `;
    if (window.lucide) lucide.createIcons();
    return;
  }

  // Render product cards
  const wishlist = getWishlist();
  const cardsHtml = filtered.map(product => {
    // Current selected size for this card (defaults to 3ml or fixed)
    const currentSize = appState.selectedSizes[product.id] || (product.fixedSize ? "fixed" : "3ml");
    const priceInfo = getPriceForSize(product, currentSize);
    const isWishlisted = wishlist.includes(product.id);

    return `
      <div class="product-card group relative flex flex-col rounded-2xl bg-onyx-900/90 border border-zinc-800/80 hover:border-gold-500/40 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-gold/10" id="card-${product.id}">
        
        <!-- Image & Badges Container -->
        <div class="relative w-full aspect-[4/5] overflow-hidden bg-onyx-950">
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy"
            class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
          />
          
          <!-- Subtle Dark Gradient Overlay for Contrast -->
          <div class="absolute inset-0 bg-gradient-to-t from-onyx-950 via-transparent to-black/30 pointer-events-none"></div>

          <!-- Product Badges -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
            ${product.badge ? `
              <span class="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase rounded-md bg-gold-500/90 text-black backdrop-blur-md shadow-md">
                ${product.badge}
              </span>
            ` : ""}
            <span class="save-badge px-2 py-0.5 text-[9px] font-bold rounded-md bg-rose-600/90 text-white backdrop-blur-md">
              SAVE ${priceInfo.savingsPct}%
            </span>
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            type="button"
            data-wishlist-id="${product.id}"
            onclick="toggleWishlist('${product.id}')"
            title="Add to Wishlist"
            class="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-onyx-900/80 backdrop-blur-md border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-110 ${isWishlisted ? 'text-rose-500 active-wishlist' : 'text-zinc-400 hover:text-rose-400'}"
          >
            <i data-lucide="heart" class="w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}"></i>
          </button>

          <!-- Fragrance Notes Quick Trigger -->
          <button 
            type="button"
            onclick="openPyramidModal('${product.id}')"
            class="absolute bottom-2.5 left-2.5 right-2.5 py-1.5 px-3 rounded-lg bg-onyx-900/90 backdrop-blur-md border border-gold-500/30 text-gold-300 text-[11px] font-medium flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 group-hover:border-gold-400 transition-all shadow-md hover:bg-gold-500/20"
          >
            <i data-lucide="sparkles" class="w-3.5 h-3.5 text-gold-400"></i>
            <span>Olfactory Notes</span>
          </button>
        </div>

        <!-- Product Card Body -->
        <div class="flex flex-col flex-1 p-3.5 sm:p-4">
          
          <!-- Category & Rating Row -->
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="text-[11px] font-medium tracking-wider uppercase text-gold-400/90 truncate">${product.category}</span>
            <div class="flex items-center gap-1 bg-onyx-800/80 px-1.5 py-0.5 rounded border border-zinc-700/60 shrink-0">
              <i data-lucide="star" class="w-3 h-3 text-amber-400 fill-amber-400"></i>
              <span class="text-[11px] font-bold text-white">${product.rating}</span>
              <span class="text-[10px] text-zinc-400">(${product.reviewsCount})</span>
            </div>
          </div>

          <!-- Product Name -->
          <h4 class="text-sm sm:text-base font-medium text-white font-serif line-clamp-1 group-hover:text-gold-300 transition-colors mb-2" title="${product.name}">
            ${product.name}
          </h4>

          <!-- Dynamic Price Recalculation Display -->
          <div class="flex items-baseline gap-2 mb-3">
            <span class="price-current text-lg sm:text-xl font-extrabold text-gold-400 font-sans tracking-tight" id="price-${product.id}">
              ₹${priceInfo.price.toLocaleString("en-IN")}
            </span>
            <span class="price-original text-xs sm:text-sm text-zinc-500 line-through font-sans" id="orig-${product.id}">
              ₹${priceInfo.originalPrice.toLocaleString("en-IN")}
            </span>
            <span class="size-label text-[11px] text-zinc-400 hidden sm:inline" id="sizelabel-${product.id}">
              (${priceInfo.sizeLabel})
            </span>
          </div>

          <!-- Instant Size Switcher Engine -->
          <div class="mb-4">
            ${product.fixedSize ? `
              <div class="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-onyx-800 border border-gold-500/20 text-gold-300 text-xs">
                <i data-lucide="box" class="w-3.5 h-3.5 text-gold-400"></i>
                <span class="font-medium">${product.fixedSize}</span>
              </div>
            ` : `
              <div class="grid grid-cols-3 gap-1.5 size-selector-group" data-product-id="${product.id}">
                <button 
                  type="button" 
                  onclick="selectProductSize('${product.id}', '3ml')"
                  class="size-pill py-1 px-1.5 text-center text-xs rounded-lg font-semibold border transition-all ${currentSize === '3ml' ? 'bg-gold-500 text-black border-gold-400 shadow-sm' : 'bg-onyx-800 text-zinc-300 border-zinc-700/80 hover:border-gold-500/50 hover:text-white'}"
                  data-size="3ml"
                >
                  3 ml
                </button>
                <button 
                  type="button" 
                  onclick="selectProductSize('${product.id}', '6ml')"
                  class="size-pill py-1 px-1.5 text-center text-xs rounded-lg font-semibold border transition-all ${currentSize === '6ml' ? 'bg-gold-500 text-black border-gold-400 shadow-sm' : 'bg-onyx-800 text-zinc-300 border-zinc-700/80 hover:border-gold-500/50 hover:text-white'}"
                  data-size="6ml"
                >
                  6 ml
                </button>
                <button 
                  type="button" 
                  onclick="selectProductSize('${product.id}', '12ml')"
                  class="size-pill py-1 px-1.5 text-center text-xs rounded-lg font-semibold border transition-all ${currentSize === '12ml' ? 'bg-gold-500 text-black border-gold-400 shadow-sm' : 'bg-onyx-800 text-zinc-300 border-zinc-700/80 hover:border-gold-500/50 hover:text-white'}"
                  data-size="12ml"
                >
                  12 ml
                </button>
              </div>
            `}
          </div>

          <!-- Dual Button Action System (Add to Bag + Buy COD) -->
          <div class="mt-auto grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800/80">
            <button 
              type="button"
              onclick="handleCardAddToBag('${product.id}')"
              class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-onyx-800 hover:bg-onyx-700 text-gold-300 border border-gold-500/30 text-xs font-semibold tracking-wide transition-all duration-200 active:scale-95"
            >
              <i data-lucide="shopping-bag" class="w-3.5 h-3.5 text-gold-400"></i>
              <span>Add Bag</span>
            </button>
            <button 
              type="button"
              onclick="handleCardBuyCOD('${product.id}')"
              class="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-gradient-to-r from-gold-500 via-amber-500 to-gold-600 hover:opacity-95 text-black text-xs font-bold tracking-wide transition-all duration-200 shadow-gold/20 shadow-sm active:scale-95"
            >
              <i data-lucide="zap" class="w-3.5 h-3.5 fill-black text-black"></i>
              <span>Buy COD</span>
            </button>
          </div>

        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = cardsHtml;
  if (window.lucide) lucide.createIcons();
}

/**
 * Dynamic Size Switcher Handler (Instant card price recalculation)
 */
function selectProductSize(productId, size) {
  appState.selectedSizes[productId] = size;
  const product = getProductById(productId);
  if (!product) return;

  const priceInfo = getPriceForSize(product, size);

  // Update elements inside this specific card without re-rendering everything
  const card = document.getElementById(`card-${productId}`);
  if (card) {
    const priceEl = card.querySelector(`#price-${productId}`);
    const origEl = card.querySelector(`#orig-${productId}`);
    const labelEl = card.querySelector(`#sizelabel-${productId}`);
    const saveBadgeEl = card.querySelector(`.save-badge`);

    if (priceEl) priceEl.textContent = `₹${priceInfo.price.toLocaleString("en-IN")}`;
    if (origEl) origEl.textContent = `₹${priceInfo.originalPrice.toLocaleString("en-IN")}`;
    if (labelEl) labelEl.textContent = `(${priceInfo.sizeLabel})`;
    if (saveBadgeEl) saveBadgeEl.textContent = `SAVE ${priceInfo.savingsPct}%`;

    // Update active styling on the size pills
    const pills = card.querySelectorAll(".size-pill");
    pills.forEach(pill => {
      const pillSize = pill.getAttribute("data-size");
      if (pillSize === size) {
        pill.className = "size-pill py-1 px-1.5 text-center text-xs rounded-lg font-semibold border transition-all bg-gold-500 text-black border-gold-400 shadow-sm";
      } else {
        pill.className = "size-pill py-1 px-1.5 text-center text-xs rounded-lg font-semibold border transition-all bg-onyx-800 text-zinc-300 border-zinc-700/80 hover:border-gold-500/50 hover:text-white";
      }
    });
  }
}

/**
 * Card CTA: Add to Bag
 */
function handleCardAddToBag(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const chosenSize = appState.selectedSizes[productId] || (product.fixedSize ? "fixed" : "3ml");
  addToCart(productId, chosenSize, 1);
  openCartDrawer();
}

/**
 * Card CTA: Direct Buy COD (Instant single item checkout modal)
 */
function handleCardBuyCOD(productId) {
  const product = getProductById(productId);
  if (!product) return;
  const chosenSize = appState.selectedSizes[productId] || (product.fixedSize ? "fixed" : "3ml");
  buyNowCOD(productId, chosenSize);
}

/**
 * Search initialization (Desktop & Mobile)
 */
function initSearch() {
  const searchInputs = [
    document.getElementById("desktopSearchInput"),
    document.getElementById("mobileSearchInput")
  ];

  searchInputs.forEach(input => {
    if (!input) return;
    input.addEventListener("input", (e) => {
      const val = e.target.value;
      appState.searchQuery = val;
      // Sync other search bar
      searchInputs.forEach(other => {
        if (other && other !== input) other.value = val;
      });
      renderProducts();
    });
  });
}

/**
 * Category filter pills initialization
 */
function initCategoryPills() {
  const pillButtons = document.querySelectorAll("[data-category-pill]");
  pillButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category-pill");
      appState.currentCategory = category;

      // Update pill active classes
      pillButtons.forEach(b => {
        if (b.getAttribute("data-category-pill") === category) {
          b.classList.add("bg-gold-500", "text-black", "font-bold", "shadow-gold/30");
          b.classList.remove("bg-onyx-800", "text-zinc-300");
        } else {
          b.classList.remove("bg-gold-500", "text-black", "font-bold", "shadow-gold/30");
          b.classList.add("bg-onyx-800", "text-zinc-300");
        }
      });

      renderProducts();
    });
  });
}

/**
 * Sorting dropdown initialization
 */
function initSort() {
  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) {
    sortSelect.addEventListener("change", (e) => {
      appState.sortBy = e.target.value;
      renderProducts();
    });
  }
}

/**
 * Reset all active search and category filters
 */
function resetFilters() {
  appState.searchQuery = "";
  appState.currentCategory = "All";
  appState.sortBy = "popular";

  const searchInputs = [
    document.getElementById("desktopSearchInput"),
    document.getElementById("mobileSearchInput")
  ];
  searchInputs.forEach(i => { if (i) i.value = ""; });

  const sortSelect = document.getElementById("sortSelect");
  if (sortSelect) sortSelect.value = "popular";

  initCategoryPills();
  renderProducts();
}

/**
 * =========================================================
 * OLFACTORY PYRAMID & FRAGRANCE DETAILS MODAL
 * =========================================================
 */
function openPyramidModal(productId) {
  const product = getProductById(productId);
  if (!product) return;

  appState.modalCurrentProduct = product;
  appState.modalCurrentSize = product.fixedSize ? "fixed" : (appState.selectedSizes[productId] || "3ml");

  const modal = document.getElementById("pyramidModal");
  if (!modal) return;

  // Populate data
  document.getElementById("pyramidModalImage").src = product.image;
  document.getElementById("pyramidModalCategory").textContent = product.category;
  document.getElementById("pyramidModalName").textContent = product.name;
  document.getElementById("pyramidModalDesc").textContent = product.desc;
  document.getElementById("pyramidModalRating").textContent = product.rating;
  document.getElementById("pyramidModalReviews").textContent = `(${product.reviewsCount} reviews)`;

  // Notes
  document.getElementById("pyramidTopNotes").textContent = product.notes?.top || "Sparkling Bergamot, Saffron";
  document.getElementById("pyramidHeartNotes").textContent = product.notes?.heart || "Taif Rose, Aged Agarwood, Spices";
  document.getElementById("pyramidBaseNotes").textContent = product.notes?.base || "White Musk, Ambergris, Bourbon Vanilla";

  // Features list
  const featuresContainer = document.getElementById("pyramidFeatures");
  if (featuresContainer && product.features) {
    featuresContainer.innerHTML = product.features.map(f => `
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-onyx-800 text-zinc-300 text-xs border border-zinc-700">
        <i data-lucide="check" class="w-3.5 h-3.5 text-gold-400"></i> ${f}
      </span>
    `).join("");
  }

  // Size chips in modal
  renderModalSizes();

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (window.lucide) lucide.createIcons();
}

function renderModalSizes() {
  const product = appState.modalCurrentProduct;
  const container = document.getElementById("pyramidModalSizes");
  const priceEl = document.getElementById("pyramidModalPrice");
  const origEl = document.getElementById("pyramidModalOrigPrice");

  if (!product || !container) return;

  const priceInfo = getPriceForSize(product, appState.modalCurrentSize);
  if (priceEl) priceEl.textContent = `₹${priceInfo.price.toLocaleString("en-IN")}`;
  if (origEl) origEl.textContent = `₹${priceInfo.originalPrice.toLocaleString("en-IN")}`;

  if (product.fixedSize) {
    container.innerHTML = `
      <span class="px-3 py-1.5 rounded-lg bg-gold-500/10 text-gold-300 border border-gold-500/30 text-xs font-semibold">
        ${product.fixedSize}
      </span>
    `;
    return;
  }

  const sizes = ["3ml", "6ml", "12ml"];
  container.innerHTML = sizes.map(sz => {
    const isSelected = appState.modalCurrentSize === sz;
    const label = sz === "12ml" ? "12 ml (1 Tola)" : sz.replace("ml", " ml");
    return `
      <button 
        type="button" 
        onclick="setModalSize('${sz}')" 
        class="py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${isSelected ? 'bg-gold-500 text-black border-gold-400 font-bold' : 'bg-onyx-800 text-zinc-300 border-zinc-700 hover:border-gold-500/50'}"
      >
        ${label}
      </button>
    `;
  }).join("");
}

function setModalSize(size) {
  appState.modalCurrentSize = size;
  renderModalSizes();
}

function handleModalAddToBag() {
  if (!appState.modalCurrentProduct) return;
  addToCart(appState.modalCurrentProduct.id, appState.modalCurrentSize, 1);
  closePyramidModal();
  openCartDrawer();
}

function handleModalBuyCOD() {
  if (!appState.modalCurrentProduct) return;
  const prod = appState.modalCurrentProduct;
  const size = appState.modalCurrentSize;
  closePyramidModal();
  buyNowCOD(prod.id, size);
}

function closePyramidModal() {
  const modal = document.getElementById("pyramidModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/**
 * Mobile Bottom Nav Controller
 */
function initMobileNav() {
  const navItems = document.querySelectorAll("[data-nav-target]");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const target = item.getAttribute("data-nav-target");
      if (target === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (target === "search") {
        const mobileInput = document.getElementById("mobileSearchInput");
        if (mobileInput) {
          mobileInput.focus();
          mobileInput.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else if (target === "wishlist") {
        openWishlistDrawer();
      } else if (target === "cart") {
        openCartDrawer();
      }
    });
  });
}

/**
 * Toast Notification System
 */
function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toastContainer");
  if (!toastContainer) return;

  const toast = document.createElement("div");
  toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-4 opacity-0 pointer-events-auto ${
    type === "success" 
      ? "bg-onyx-900/95 border-gold-500/40 text-zinc-100" 
      : type === "warning"
      ? "bg-onyx-900/95 border-amber-500/40 text-amber-200"
      : "bg-onyx-900/95 border-rose-500/40 text-zinc-100"
  }`;

  let iconName = "check-circle-2";
  let iconColor = "text-gold-400";
  if (type === "warning") {
    iconName = "alert-triangle";
    iconColor = "text-amber-400";
  } else if (type === "error") {
    iconName = "alert-circle";
    iconColor = "text-rose-400";
  } else if (type === "info") {
    iconName = "info";
    iconColor = "text-zinc-400";
  }

  toast.innerHTML = `
    <i data-lucide="${iconName}" class="w-5 h-5 shrink-0 ${iconColor}"></i>
    <p class="text-xs sm:text-sm font-medium leading-snug">${message}</p>
  `;

  toastContainer.appendChild(toast);
  if (window.lucide) lucide.createIcons();

  // Trigger entrance
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // Auto remove after 3 seconds
  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-2");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3200);
}
