/**
 * JECQCUPG ERGONOMICS THEME JAVASCRIPT
 * High-performance, vanilla JavaScript interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initProductGallery();
  initVariantSelector();
  initReclineVisualizer();
  initFAQAccordion();
  initStickyATC();
  initCountdownTimer();
  initQuantityStepper();
  initMobileMenu();
});

/* ==========================================================================
   1. AJAX CART DRAWER
   ========================================================================== */
function initCartDrawer() {
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

  openBtns.forEach(btn => btn.addEventListener('click', openDrawer));
  closeBtns.forEach(btn => btn.addEventListener('click', closeDrawer));

  // Main Add to Cart buttons
  const mainATC = document.getElementById('MainAddToCartBtn');
  const stickyATC = document.getElementById('StickyATCBtn');
  const buyNowBtn = document.getElementById('MainBuyNowBtn');

  if (mainATC) {
    mainATC.addEventListener('click', (e) => {
      e.preventDefault();
      addToCartWithFeedback(mainATC);
    });
  }

  if (stickyATC) {
    stickyATC.addEventListener('click', (e) => {
      e.preventDefault();
      addToCartWithFeedback(stickyATC);
    });
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', () => {
      // Simulate direct checkout
      window.location.href = '/checkout';
    });
  }

  // Quick upsell button
  const upsellBtn = document.querySelector('[data-quick-upsell]');
  if (upsellBtn) {
    upsellBtn.addEventListener('click', () => {
      upsellBtn.textContent = '✓ Added!';
      upsellBtn.disabled = true;
      openDrawer();
    });
  }

  // Drawer quantity controls
  drawer.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn) {
      const itemEl = removeBtn.closest('.cart-item');
      if (itemEl) {
        itemEl.style.opacity = '0';
        setTimeout(() => {
          itemEl.remove();
          updateCartCounts(0);
        }, 200);
      }
    }
  });
}

function addToCartWithFeedback(button) {
  const originalText = button.innerHTML;
  button.innerHTML = '<span>Adding...</span>';
  button.disabled = true;

  setTimeout(() => {
    button.innerHTML = '<span>✓ Added to Bag!</span>';
    updateCartCounts(1);
    const drawer = document.getElementById('CartDrawer');
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 1500);
  }, 400);
}

function updateCartCounts(count) {
  const badges = document.querySelectorAll('[data-cart-count]');
  badges.forEach(b => b.textContent = count);
}

/* ==========================================================================
   2. PRODUCT GALLERY THUMBNAIL SWITCHER
   ========================================================================== */
function initProductGallery() {
  const mainImg = document.getElementById('MainProductImage');
  const thumbs = document.querySelectorAll('.thumb-btn');
  if (!mainImg || thumbs.length === 0) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.getAttribute('data-img');
      if (newSrc) {
        mainImg.style.opacity = '0.3';
        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';
        }, 150);
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
  const stickyPicker = document.getElementById('StickyVariantPicker');
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

      // Sync Sticky dropdown
      if (stickyPicker) {
        for (let i = 0; i < stickyPicker.options.length; i++) {
          if (stickyPicker.options[i].getAttribute('data-color') === color) {
            stickyPicker.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  if (stickyPicker) {
    stickyPicker.addEventListener('change', () => {
      const selectedOption = stickyPicker.options[stickyPicker.selectedIndex];
      const color = selectedOption.getAttribute('data-color');
      swatches.forEach(s => {
        if (s.getAttribute('data-color') === color) {
          s.click();
        }
      });
    });
  }
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
    tab.addEventListener('click', () => {
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
   5. FAQ ACCORDION
   ========================================================================== */
function initFAQAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');
  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parent = trigger.closest('.faq-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-trigger')?.setAttribute('aria-expanded', 'false');
      });

      if (!isExpanded) {
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
    // Show sticky bar once user scrolls past the top of the product overview
    if (rect.bottom < 100) {
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

  if (!minus || !plus || !display) return;

  let qty = 1;

  minus.addEventListener('click', () => {
    if (qty > 1) {
      qty--;
      display.textContent = qty;
      if (input) input.value = qty;
    }
  });

  plus.addEventListener('click', () => {
    qty++;
    display.textContent = qty;
    if (input) input.value = qty;
  });
}

/* ==========================================================================
   9. MOBILE MENU TOGGLE
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.getElementById('MobileMenuToggle');
  const nav = document.getElementById('HeaderNav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    if (nav.style.display === 'block') {
      nav.style.display = 'none';
    } else {
      nav.style.display = 'block';
      nav.style.position = 'absolute';
      nav.style.top = '100%';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = '#0a0c10';
      nav.style.padding = '20px';
      nav.style.borderBottom = '1px solid #27303f';
    }
  });
}
