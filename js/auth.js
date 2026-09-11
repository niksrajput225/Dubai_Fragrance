/**
 * Dubai Fragrances - User Authentication & Account Management Engine
 * Pure client-side authentication backed by localStorage (df_user, df_users_db).
 * Requires account creation before placing orders and provides seamless transition.
 */

const USER_SESSION_KEY = "df_user";
const USERS_DB_KEY = "df_users_db";

// Store pending action when login was required (e.g. trying to checkout)
let pendingAuthAction = null;

function getCurrentUser() {
  try {
    const raw = localStorage.getItem(USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Error reading current user:", e);
    return null;
  }
}

function getUsersDB() {
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error reading users db:", e);
    return [];
  }
}

function saveUsersDB(db) {
  try {
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Error saving users db:", e);
  }
}

function setCurrentUser(user) {
  try {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
    updateAuthUI();
  } catch (e) {
    console.error("Error setting current user:", e);
  }
}

/**
 * Register a new customer account
 */
function registerUser(name, phone, email, password) {
  const cleanName = name.trim();
  const cleanPhone = phone.trim().replace(/\s+/g, "");
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = password.trim();

  // Validations
  if (!cleanName) {
    showToast("Please enter your full name.", "error");
    return false;
  }

  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(cleanPhone)) {
    showToast("Please enter a valid 10-digit Indian mobile number.", "error");
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleanEmail)) {
    showToast("Please enter a valid email address.", "error");
    return false;
  }

  if (cleanPass.length < 4) {
    showToast("Password must be at least 4 characters long.", "error");
    return false;
  }

  const db = getUsersDB();
  const existing = db.find(u => u.phone === cleanPhone || u.email === cleanEmail);
  if (existing) {
    showToast("An account already exists with this phone or email. Please sign in.", "warning");
    switchAuthTab("login");
    const loginIdentifier = document.getElementById("loginIdentifier");
    if (loginIdentifier) loginIdentifier.value = cleanPhone;
    return false;
  }

  const newUser = {
    id: "user_" + Math.random().toString(36).substring(2, 9),
    name: cleanName,
    phone: cleanPhone,
    email: cleanEmail,
    password: cleanPass,
    createdAt: new Date().toISOString()
  };

  db.push(newUser);
  saveUsersDB(db);

  // Set session (omit password in active session for hygiene)
  const sessionUser = {
    id: newUser.id,
    name: newUser.name,
    phone: newUser.phone,
    email: newUser.email,
    createdAt: newUser.createdAt
  };
  setCurrentUser(sessionUser);

  showToast(`Welcome to Dubai Fragrances, ${newUser.name}! 👑`, "success");
  closeAuthModal();

  // Execute any pending checkout action
  executePendingAction();
  return true;
}

/**
 * Sign in existing user
 */
function loginUser(identifier, password) {
  const cleanId = identifier.trim().toLowerCase().replace(/\s+/g, "");
  const cleanPass = password.trim();

  if (!cleanId || !cleanPass) {
    showToast("Please enter your mobile/email and password.", "error");
    return false;
  }

  const db = getUsersDB();
  const user = db.find(u => (u.phone === cleanId || u.email.toLowerCase() === cleanId) && u.password === cleanPass);

  if (!user) {
    showToast("Invalid credentials. Please check phone/email and password.", "error");
    return false;
  }

  const sessionUser = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
    createdAt: user.createdAt
  };
  setCurrentUser(sessionUser);

  showToast(`Welcome back, ${user.name}! ✨`, "success");
  closeAuthModal();

  // Execute pending checkout action
  executePendingAction();
  return true;
}

function logoutUser() {
  const user = getCurrentUser();
  const name = user ? user.name : "Customer";
  setCurrentUser(null);
  closeProfileModal();
  showToast(`Signed out of ${name}'s account.`, "info");
}

/**
 * Pending Checkout Action Handler
 */
function setPendingAction(action) {
  pendingAuthAction = action;
}

function executePendingAction() {
  if (!pendingAuthAction) return;

  const action = pendingAuthAction;
  pendingAuthAction = null;

  if (action.type === "direct_buy") {
    buyNowCOD(action.productId, action.size);
  } else if (action.type === "cart_checkout") {
    proceedToCartCheckout();
  }
}

/**
 * Auth Modal UI Controls
 */
function openAuthModal(pendingAction = null, tab = "signup") {
  if (pendingAction) {
    setPendingAction(pendingAction);
  }

  const modal = document.getElementById("authModal");
  if (!modal) return;

  switchAuthTab(tab);
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (window.lucide) lucide.createIcons();
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

function switchAuthTab(tab) {
  const signupTabBtn = document.getElementById("tabBtnSignup");
  const loginTabBtn = document.getElementById("tabBtnLogin");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const noticeText = document.getElementById("authNoticeText");

  if (tab === "signup") {
    signupTabBtn.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all bg-gold-500 text-black shadow-md";
    loginTabBtn.className = "flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-transparent text-zinc-400 hover:text-white";
    signupForm.classList.remove("hidden");
    loginForm.classList.add("hidden");
    if (noticeText) {
      noticeText.textContent = "Create an account to track your royal attar orders and access Cash On Delivery.";
    }
  } else {
    loginTabBtn.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all bg-gold-500 text-black shadow-md";
    signupTabBtn.className = "flex-1 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all bg-transparent text-zinc-400 hover:text-white";
    loginForm.classList.remove("hidden");
    signupForm.classList.add("hidden");
    if (noticeText) {
      noticeText.textContent = "Sign in to access your saved delivery addresses and placed orders.";
    }
  }
}

/**
 * Profile / Account Details Modal
 */
function openProfileModal() {
  const user = getCurrentUser();
  if (!user) {
    openAuthModal(null, "login");
    return;
  }

  const modal = document.getElementById("profileModal");
  if (!modal) return;

  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profilePhone").textContent = "+91 " + user.phone;
  document.getElementById("profileEmail").textContent = user.email;

  // Render past orders from localStorage
  const ordersContainer = document.getElementById("profileOrdersList");
  if (ordersContainer) {
    try {
      const allOrders = JSON.parse(localStorage.getItem("df_orders") || "[]");
      const userOrders = allOrders.filter(o => o.customer && (o.customer.phone === user.phone || o.userId === user.id));

      if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
          <div class="py-8 text-center text-zinc-500 text-xs">
            <i data-lucide="package-open" class="w-8 h-8 mx-auto mb-2 opacity-40 text-gold-400"></i>
            <p>No orders placed yet. Explore our artisanal attars!</p>
          </div>
        `;
      } else {
        ordersContainer.innerHTML = userOrders.map(order => `
          <div class="p-3.5 rounded-xl bg-onyx-950 border border-zinc-800/80 mb-2.5 text-xs space-y-1.5">
            <div class="flex items-center justify-between pb-1.5 border-b border-zinc-800">
              <span class="font-mono font-bold text-gold-400">${order.orderId}</span>
              <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                ${order.paymentMethod}
              </span>
            </div>
            <div class="text-zinc-300">
              ${order.items.map(i => `${i.name} (${i.sizeLabel}) x ${i.quantity}`).join(", ")}
            </div>
            <div class="flex items-center justify-between pt-1 text-zinc-400 text-[11px]">
              <span>Delivering to: ${order.customer.city}</span>
              <span class="font-bold text-white font-sans text-xs">₹${order.totalPayable.toLocaleString("en-IN")}</span>
            </div>
          </div>
        `).join("");
      }
    } catch (e) {
      console.error("Error reading orders:", e);
    }
  }

  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  if (window.lucide) lucide.createIcons();
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  if (modal) {
    modal.classList.add("hidden");
    document.body.style.overflow = "";
  }
}

/**
 * Synchronize Header & Mobile Navigation with Auth State
 */
function updateAuthUI() {
  const user = getCurrentUser();
  const headerBtn = document.getElementById("headerAccountBtn");
  const mobileNavBtn = document.querySelector("[data-nav-target='account']");

  if (headerBtn) {
    if (user) {
      const firstName = user.name.split(" ")[0];
      headerBtn.innerHTML = `
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 text-gold-400 flex items-center justify-center font-bold text-xs">
            ${firstName.charAt(0).toUpperCase()}
          </div>
          <div class="text-left hidden lg:block">
            <span class="text-[10px] text-zinc-400 block -mb-0.5">Account</span>
            <span class="text-xs font-bold text-gold-300 block truncate max-w-[80px]">${firstName}</span>
          </div>
        </div>
      `;
      headerBtn.onclick = openProfileModal;
    } else {
      headerBtn.innerHTML = `
        <div class="flex items-center gap-1.5 text-zinc-300 hover:text-gold-400">
          <i data-lucide="user" class="w-4 h-4 text-gold-400"></i>
          <span class="hidden lg:inline text-xs font-semibold">Sign In</span>
        </div>
      `;
      headerBtn.onclick = () => openAuthModal();
    }
  }

  if (mobileNavBtn) {
    const label = mobileNavBtn.querySelector("span");
    if (label) {
      label.textContent = user ? "Profile" : "Sign In";
    }
    mobileNavBtn.onclick = () => {
      if (user) {
        openProfileModal();
      } else {
        openAuthModal();
      }
    };
  }

  if (window.lucide) lucide.createIcons();
}

// Global Auth Form Submit Handlers
function handleSignupSubmit(e) {
  e.preventDefault();
  const form = e.target;
  registerUser(
    form.name.value,
    form.phone.value,
    form.email.value,
    form.password.value
  );
}

function handleLoginSubmit(e) {
  e.preventDefault();
  const form = e.target;
  loginUser(
    form.identifier.value,
    form.password.value
  );
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();
});
