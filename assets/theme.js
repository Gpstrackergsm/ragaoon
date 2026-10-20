/**
 * RAGAOON ERGONOMICS THEME JAVASCRIPT
 * High-performance Shopify AJAX Cart & Interactive Storefront Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  initShopifyCart();
  initProductGallery();
  initVariantSelector();
  initReclineVisualizer();
  initFAQAccordion();
  initStickyATC();
  initCountdownTimer();
  initQuantityStepper();
  initMobileMenu();
  initLiveViewerCounter();
  initPolicyModal();
});

/* ==========================================================================
   1. SHOPIFY LIVE AJAX CART & CHECKOUT ENGINE
   ========================================================================== */
const ShopifyCart = {
  moneyFormat: (cents) => {
    return '$' + (cents / 100).toFixed(2) + ' USD';
  },

  freeShippingThreshold: 7500, // $75.00 in cents

  // Fetch live cart state from Shopify
  getCart: async () => {
    try {
      const res = await fetch('/cart.js', { credentials: 'same-origin' });
      if (!res.ok) throw new Error('Cart fetch failed');
      return await res.json();
    } catch (e) {
      console.warn('Shopify cart fetch warning:', e);
      return null;
    }
  },

  // Add item to Shopify cart
  addItem: async (variantId, quantity = 1) => {
    const payload = {
      id: Number(variantId),
      quantity: Number(quantity)
    };

    const res = await fetch('/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.description || err.message || 'Unable to add item');
    }
    return await res.json();
  },

  // Change item quantity in cart
  changeItem: async (lineKey, quantity) => {
    const payload = {
      id: lineKey,
      quantity: Number(quantity)
    };

    const res = await fetch('/cart/change.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Could not update cart');
    return await res.json();
  }
};

function initShopifyCart() {
  const drawer = document.getElementById('CartDrawer');
  if (!drawer) return;

  const openBtns = document.querySelectorAll('[data-drawer-open]');
  const closeBtns = document.querySelectorAll('[data-drawer-close]');

  function openDrawer() {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  closeBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  }));

  // Initial render on page load
  refreshCartDrawer(false);

  // Main Product Form submission
  const mainForm = document.getElementById('MainAddToCartForm');
  const mainATC = document.getElementById('MainAddToCartBtn');
  const stickyATC = document.getElementById('StickyATCBtn');
  const buyNowBtn = document.getElementById('MainBuyNowBtn');

  async function handleAddToCart(buttonEl) {
    const variantInput = document.getElementById('ProductVariantIdInput') || document.querySelector('input[name="id"]');
    const qtyInput = document.getElementById('ProductQuantityInput') || document.querySelector('input[name="quantity"]');
    
    const variantId = variantInput ? variantInput.value : '67868873621716';
    const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

    const originalHTML = buttonEl.innerHTML;
    buttonEl.disabled = true;
    buttonEl.innerHTML = '<span>Adding to Cart...</span>';

    try {
      await ShopifyCart.addItem(variantId, quantity);
      buttonEl.innerHTML = '<span>✓ Added to Cart!</span>';
      await refreshCartDrawer(true);
      openDrawer();
    } catch (err) {
      console.error('Add to Cart error:', err);
      // If error (e.g., in theme editor preview without active session), fallback gracefully
      alert(err.message || 'Error adding to cart. Please try again.');
    } finally {
      setTimeout(() => {
        buttonEl.innerHTML = originalHTML;
        buttonEl.disabled = false;
      }, 1600);
    }
  }

  if (mainATC) {
    mainATC.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(mainATC);
    });
  }

  if (mainForm) {
    mainForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (mainATC) handleAddToCart(mainATC);
    });
  }

  if (stickyATC) {
    stickyATC.addEventListener('click', (e) => {
      e.preventDefault();
      handleAddToCart(stickyATC);
    });
  }

  // 1-Click Instant Checkout
  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      const variantInput = document.getElementById('ProductVariantIdInput') || document.querySelector('input[name="id"]');
      const qtyInput = document.getElementById('ProductQuantityInput') || document.querySelector('input[name="quantity"]');
      const variantId = variantInput ? variantInput.value : '67868873621716';
      const quantity = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      buyNowBtn.disabled = true;
      buyNowBtn.innerHTML = '<span>Preparing Checkout...</span>';

      try {
        await ShopifyCart.addItem(variantId, quantity);
        window.location.href = '/checkout';
      } catch (err) {
        // Fallback to Shopify permalink checkout
        window.location.href = `/cart/${variantId}:${quantity}`;
      }
    });
  }

  // Drawer Event Delegation (Qty change, Remove item)
  drawer.addEventListener('click', async (e) => {
    // Quantity increment / decrement
    const qtyBtn = e.target.closest('[data-cart-update-qty]');
    if (qtyBtn) {
      e.preventDefault();
      const lineKey = qtyBtn.getAttribute('data-key');
      const newQty = parseInt(qtyBtn.getAttribute('data-cart-update-qty'), 10);
      if (lineKey && !isNaN(newQty)) {
        try {
          await ShopifyCart.changeItem(lineKey, newQty);
          await refreshCartDrawer(false);
        } catch (err) {
          console.error(err);
        }
      }
      return;
    }

    // Remove item
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      e.preventDefault();
      const lineKey = removeBtn.getAttribute('data-cart-remove');
      if (lineKey) {
        try {
          await ShopifyCart.changeItem(lineKey, 0);
          await refreshCartDrawer(false);
        } catch (err) {
          console.error(err);
        }
      }
      return;
    }

    // Upsell button in drawer
    const upsellBtn = e.target.closest('[data-quick-upsell]');
    if (upsellBtn) {
      e.preventDefault();
      upsellBtn.disabled = true;
      upsellBtn.textContent = 'Adding...';
      const variantInput = document.getElementById('ProductVariantIdInput');
      const variantId = variantInput ? variantInput.value : '67868873621716';
      try {
        await ShopifyCart.addItem(variantId, 1);
        upsellBtn.textContent = '✓ Added';
        await refreshCartDrawer(false);
      } catch (err) {
        upsellBtn.textContent = '+ Add';
        upsellBtn.disabled = false;
      }
    }
  });
}

// Refresh the contents of the Cart Drawer dynamically
async function refreshCartDrawer(triggerHighlight = false) {
  const cart = await ShopifyCart.getCart();
  if (!cart) return;

  // 1. Update Badge Counters across site
  const badges = document.querySelectorAll('[data-cart-count]');
  badges.forEach(b => {
    b.textContent = cart.item_count;
    b.style.display = cart.item_count > 0 ? 'inline-flex' : 'none';
  });

  // 2. Update Subtotal
  const subtotalEls = document.querySelectorAll('[data-cart-subtotal]');
  subtotalEls.forEach(el => {
    el.textContent = ShopifyCart.moneyFormat(cart.total_price);
  });

  // 3. Update Free Shipping Goal Progress
  const threshold = ShopifyCart.freeShippingThreshold;
  const progressFill = document.querySelector('[data-shipping-meter-fill]');
  const progressText = document.querySelector('[data-shipping-meter-text]');

  if (progressFill && progressText) {
    const progressPct = Math.min(100, Math.round((cart.total_price / threshold) * 100));
    progressFill.style.width = `${progressPct}%`;

    if (cart.total_price >= threshold) {
      progressText.innerHTML = '<span class="shipping-unlocked">🎉 <strong>CONGRATULATIONS!</strong> You unlocked <strong>FREE Express Delivery</strong>!</span>';
    } else {
      const remainingCents = threshold - cart.total_price;
      progressText.innerHTML = `<span>Add <strong>${ShopifyCart.moneyFormat(remainingCents)}</strong> more to unlock <strong>FREE Express Delivery</strong>!</span>`;
    }
  }

  // 4. Update Cart Items List
  const container = document.querySelector('[data-cart-items-container]');
  if (!container) return;

  if (cart.item_count === 0) {
    container.innerHTML = `
      <div class="cart-drawer-empty">
        <div class="empty-icon-wrap">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
        </div>
        <h4>Your cart is empty</h4>
        <p>Experience the 51cm pocket spring ergonomic comfort.</p>
        <button class="btn btn-primary" data-drawer-close>Explore Ragaoon Chair ($89)</button>
      </div>
    `;
    const closeBtn = container.querySelector('[data-drawer-close]');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        document.getElementById('CartDrawer')?.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
    return;
  }

  // Render items
  let itemsHTML = '<div class="cart-drawer-items">';
  cart.items.forEach(item => {
    const itemImg = item.image || 'https://cdn.shopify.com/s/files/1/0863/8509/8964/files/Screenshot2026-10-20at00.07.32.png?v=1792454958';
    const variantTitle = item.variant_title && item.variant_title !== 'Default Title' ? `<span class="cart-item-variant">${item.variant_title}</span>` : '';
    
    itemsHTML += `
      <div class="cart-item" data-line-item-key="${item.key}">
        <div class="cart-item-image">
          <img src="${itemImg}" alt="${item.title}" loading="lazy">
        </div>
        <div class="cart-item-details">
          <a href="${item.url}" class="cart-item-title">${item.product_title || item.title}</a>
          ${variantTitle}
          <div class="cart-item-price-row">
            <span class="cart-item-price">${ShopifyCart.moneyFormat(item.final_line_price)}</span>
            ${item.original_line_price > item.final_line_price ? `<s class="cart-item-original-price">${ShopifyCart.moneyFormat(item.original_line_price)}</s>` : ''}
          </div>
          <div class="cart-item-qty-actions">
            <div class="qty-control">
              <button class="qty-btn" data-cart-update-qty="${item.quantity - 1}" data-key="${item.key}" aria-label="Decrease quantity">-</button>
              <input type="number" class="qty-input" value="${item.quantity}" readonly aria-label="Quantity">
              <button class="qty-btn" data-cart-update-qty="${item.quantity + 1}" data-key="${item.key}" aria-label="Increase quantity">+</button>
            </div>
            <button class="cart-item-remove" data-cart-remove="${item.key}" aria-label="Remove item">Remove</button>
          </div>
        </div>
      </div>
    `;
  });
  itemsHTML += '</div>';

  container.innerHTML = itemsHTML;
}

/* ==========================================================================
   2. PRODUCT GALLERY THUMBNAIL SWITCHER
   ========================================================================== */
function initProductGallery() {
  const mainImg = document.getElementById('MainProductImage');
  const thumbs = document.querySelectorAll('.thumb-btn');
  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', (e) => {
      e.preventDefault();
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.getAttribute('data-img');
      if (newSrc && mainImg.src !== newSrc) {
        mainImg.style.opacity = '0.4';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 120);
      }
    });
  });
}

/* ==========================================================================
   3. COLOR VARIANT SELECTOR
   ========================================================================== */
function initVariantSelector() {
  const swatches = document.querySelectorAll('.swatch-option');
  const selectedName = document.getElementById('SelectedColorName');
  const productPrice = document.getElementById('ProductPrice');
  const mainImg = document.getElementById('MainProductImage');
  const stickyPrice = document.getElementById('StickyPrice');

  if (swatches.length === 0) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      const color = swatch.getAttribute('data-color');
      const price = swatch.getAttribute('data-price');
      const img = swatch.getAttribute('data-img');

      if (selectedName) selectedName.textContent = color;
      if (productPrice) productPrice.textContent = price;
      if (stickyPrice) stickyPrice.textContent = price;

      if (img && mainImg) {
        mainImg.src = img;
      }
    });
  });
}

/* ==========================================================================
   4. INTERACTIVE 90°-135° RECLINE VISUALIZER
   ========================================================================== */
function initReclineVisualizer() {
  const tabs = document.querySelectorAll('.angle-tab');
  const backrest = document.getElementById('BackrestVisual');
  const armrest = document.getElementById('ArmrestVisual');
  const footrest = document.getElementById('FootrestVisual');
  const badge = document.getElementById('AngleBadge');
  const heading = document.getElementById('AngleHeading');
  const desc = document.getElementById('AngleDesc');
  const indicator = document.getElementById('AngleDegreesIndicator');

  if (tabs.length === 0) return;

  const data = {
    '90': {
      title: 'Active Mode: 90° Focus Work',
      heading: 'Locked-In Orthopedic Alignment',
      desc: 'Maintains proper spinal curvature during long typing, high-stakes competitive gaming, or video editing. Provides steady lumbar support and keeps your posture upright and alert without fatigue.',
      backrestDeg: '0deg',
      armrestDeg: '0deg',
      footrestActive: false
    },
    '110': {
      title: 'Active Mode: 110° Gaming & Casual',
      heading: 'Ergonomic Immersion & Controller Play',
      desc: 'Opens the hip angle to 110 degrees, taking significant pressure off the sacral joint. The synchronized armrests tilt slightly to naturally support your forearms while holding a controller or watching streams.',
      backrestDeg: '20deg',
      armrestDeg: '-10deg',
      footrestActive: false
    },
    '135': {
      title: 'Active Mode: 135° Power Nap & Zero-G Rest',
      heading: 'Deep Rest with Retractable Footrest',
      desc: 'Transforms into a zero-strain lounger. The padded footrest slides out effortlessly to elevate your legs, while the synchronized armrests pivot back so your forearms never lose support.',
      backrestDeg: '45deg',
      armrestDeg: '-22deg',
      footrestActive: true
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.preventDefault();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const angle = tab.getAttribute('data-angle');
      const info = data[angle];
      if (!info) return;

      if (badge) badge.textContent = info.title;
      if (heading) heading.textContent = info.heading;
      if (desc) desc.textContent = info.desc;
      if (indicator) indicator.textContent = `Current Angle: ${angle}°`;

      if (backrest) {
        backrest.style.transform = `rotate(${info.backrestDeg})`;
      }
      if (armrest) {
        armrest.style.transform = `rotate(${info.armrestDeg})`;
      }
      if (footrest) {
        if (info.footrestActive) {
          footrest.style.opacity = '1';
          footrest.style.transform = 'translateX(20px)';
        } else {
          footrest.style.opacity = '0';
          footrest.style.transform = 'translateX(-30px)';
        }
      }
    });
  });
}

/* ==========================================================================
   5. FAQ ACCORDION (With safe max-height)
   ========================================================================== */
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.faq-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close other items
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parent) {
          item.classList.remove('active');
          item.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      if (isExpanded) {
        parent.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        parent.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   6. STICKY ADD TO CART BAR
   ========================================================================== */
function initStickyATC() {
  const stickyBar = document.getElementById('StickyATC');
  const triggerEl = document.getElementById('ProductOverview');
  if (!stickyBar || !triggerEl) return;

  window.addEventListener('scroll', () => {
    const rect = triggerEl.getBoundingClientRect();
    if (rect.bottom < 150) {
      stickyBar.classList.add('visible');
    } else {
      stickyBar.classList.remove('visible');
    }
  }, { passive: true });
}

/* ==========================================================================
   7. LIVE COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  const timerEl = document.getElementById('CountdownTimer');
  if (!timerEl) return;

  let totalSeconds = 3 * 3600 + 42 * 60 + 19;

  setInterval(() => {
    if (totalSeconds <= 0) totalSeconds = 4 * 3600;
    totalSeconds--;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n) => String(n).padStart(2, '0');
    timerEl.textContent = `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  }, 1000);
}

/* ==========================================================================
   8. QUANTITY STEPPER
   ========================================================================== */
function initQuantityStepper() {
  const minus = document.getElementById('QtyMinus');
  const plus = document.getElementById('QtyPlus');
  const display = document.getElementById('QtyDisplay');
  const input = document.getElementById('ProductQuantityInput');

  if (!minus || !plus || !display || !input) return;

  minus.addEventListener('click', (e) => {
    e.preventDefault();
    let val = parseInt(input.value, 10) || 1;
    if (val > 1) {
      val--;
      input.value = val;
      display.textContent = val;
    }
  });

  plus.addEventListener('click', (e) => {
    e.preventDefault();
    let val = parseInt(input.value, 10) || 1;
    val++;
    input.value = val;
    display.textContent = val;
  });
}

/* ==========================================================================
   9. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('MobileMenuToggle');
  const nav = document.getElementById('HeaderNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    const isOpen = nav.classList.contains('mobile-nav-open');
    if (isOpen) {
      nav.classList.remove('mobile-nav-open');
      toggle.classList.remove('active');
    } else {
      nav.classList.add('mobile-nav-open');
      toggle.classList.add('active');
    }
  });

  // Close nav when clicking any link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('mobile-nav-open');
      toggle.classList.remove('active');
    });
  });
}

/* ==========================================================================
   10. REALISTIC LIVE VIEWER SOCIAL PROOF
   ========================================================================== */
function initLiveViewerCounter() {
  const viewerEl = document.getElementById('LiveViewerCount');
  if (!viewerEl) return;

  let currentCount = parseInt(viewerEl.textContent, 10) || 23;
  function updateCount() {
    const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
    currentCount = Math.max(17, Math.min(31, currentCount + delta));
    viewerEl.textContent = currentCount;
    const nextInterval = Math.floor(Math.random() * 5000) + 6000; // 6 to 11s
    setTimeout(updateCount, nextInterval);
  }
  setTimeout(updateCount, 7000);
}

/* ==========================================================================
   11. INTERACTIVE POLICY & TRUST MODAL
   ========================================================================== */
function initPolicyModal() {
  const modal = document.getElementById('PolicyModal');
  if (!modal) return;

  const tabButtons = modal.querySelectorAll('[data-policy-tab]');
  const panels = modal.querySelectorAll('.policy-panel');
  const closeTriggers = modal.querySelectorAll('[data-policy-close]');
  const orderBtn = modal.querySelector('[data-policy-order-btn]');

  function switchTab(tabKey) {
    tabButtons.forEach(btn => {
      const match = btn.getAttribute('data-policy-tab') === tabKey;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    panels.forEach(panel => {
      if (panel.id === `PolicyPanel-${tabKey}`) {
        panel.style.display = 'block';
        panel.classList.add('active');
      } else {
        panel.style.display = 'none';
        panel.classList.remove('active');
      }
    });
  }

  function openModal(defaultTab = 'shipping') {
    switchTab(defaultTab);
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind all triggers across page (footer, 404, badges)
  document.querySelectorAll('[data-policy-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = trigger.getAttribute('data-policy-trigger') || 'shipping';
      openModal(tab);
    });
  });

  // Tab switching inside modal
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabKey = btn.getAttribute('data-policy-tab');
      switchTab(tabKey);
    });
  });

  // Close triggers (X button and backdrop)
  closeTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Order CTA in modal footer
  if (orderBtn) {
    orderBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      const target = document.getElementById('ProductOverview') || document.querySelector('.main-product-section');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.location.href = '/#ProductOverview';
      }
    });
  }
}

