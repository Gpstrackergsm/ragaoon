# JECQCUPG Ergonomic Flagship Shopify Theme

A high-converting Direct-to-Consumer (DTC) Shopify Online Store 2.0 theme purpose-built for the **JECQCUPG Upgraded Ergonomic Gaming & Executive Office Chair**.

Inspired by industry leaders (Secretlab, Herman Miller, Razer Enki), this theme bridges the gap between high-performance gaming aesthetics and medical-grade orthopedic ergonomics.

---

## 🎯 Key Conversion Features

1. **High-Impact Hero Section**
   - Floating feature callouts: *Synchronized Linkage Armrests*, *16-Pocket Spring Core*, *SGS Class-4 Gas Cylinder (400 LBS)*.
   - Dual CTAs with smooth scrolling anchors to purchase module.
   - Real-time launch discount badge (-31% OFF).

2. **Flagship Single-Product Purchase Engine (`sections/main-product.liquid`)**
   - **Live Gallery**: Instant angle switching with thumbnail previews.
   - **Variant Swatches**: Arctic Black, Crimson Red, Jet Black, Arctic White with real-time price & image updating.
   - **Urgency Scarcity Bar**: Real-time stock meter (*"Only 6 units left"*) and live countdown timer.
   - **Installment Financing Callout**: Klarna / Afterpay 4-interest-free payments indicator.
   - **Quantity Stepper & Instant 1-Click Buy Now** checkout trigger.

3. **Interactive 90°–135° Recline Visualizer (`sections/recline-showcase.liquid`)**
   - Real-time interactive angle switching:
     - **90°**: Peak Work & Competitive Alignment
     - **110°**: Gaming & Casual Immersion
     - **135°**: Zero-G Rest & Power Nap (retractable footrest deployed, linkage armrests auto-adjusted)

4. **7-Point Orthopedic Anatomy Explorer (`sections/ergonomic-anatomy.liquid`)**
   - Detailed breakdown across: Headrest, Shoulder Cradle, Lumbar Curve, Synchronized Armrests, 51cm Wingless Pocket Spring Cushion, Class-4 Gas Cylinder, and Retractable Footrest.

5. **Sofa-Grade Cushion Engineering (`sections/cushion-engineering.liquid`)**
   - 4-layer cutaway breakdown: Breathable PU leather, 50D comfort foam, 16-pocket spring mattress matrix, alloy steel frame.
   - Direct comparison against traditional slab foam chairs that sag after 2 hours.

6. **Direct-Response Feature Comparison Matrix (`sections/comparison-table.liquid`)**
   - Side-by-side comparison: *JECQCUPG* vs. *Cheap Office Chairs* vs. *Overpriced $500+ Racing Chairs*.

7. **Technical Specifications & Blueprint (`sections/product-specs.liquid`)**
   - Complete dimensions, max weight (400 lbs / 181 kg), SGS & TUV certifications, materials, package contents.

8. **Verified Social Proof & Reviews (`sections/reviews-testimonials.liquid`)**
   - 4.9/5 star aggregate rating breakdown, verified buyer reviews with variant tags and customer feedback.

9. **Interactive FAQ Accordion (`sections/faq.liquid`)**
   - Addresses common buyer hesitations: assembly time (15 mins), weight limit (400 lbs), linkage armrests, trial period, and delivery speed.

10. **Slide-Out AJAX Cart Drawer with Gamified Shipping Progress (`snippets/cart-drawer.liquid`)**
    - Free shipping unlock progress bar.
    - Frequently Added Together 1-click upsell (*Silent Rollerblade Caster Wheels*).
    - Subtotal calculation, trust seals, and direct checkout button.

11. **Floating Sticky Add to Cart (`snippets/sticky-atc.liquid`)**
    - Persistently slides up when user scrolls past the buy box, driving effortless impulse conversions on mobile and desktop.

---

## 📁 Architecture & Shopify OS 2.0 Compliance

```
ragaoon/
├── assets/
│   ├── theme.css             # Performance CSS (responsive, dark mode, zero bloated libraries)
│   └── theme.js              # Vanilla JS for drawer, recline visualizer, variants, FAQs
├── config/
│   ├── settings_schema.json  # Shopify theme customizer settings
│   └── settings_data.json    # Default store colors & preferences
├── layout/
│   └── theme.liquid          # Master layout with SEO & OpenGraph tags
├── locales/
│   └── en.default.json       # English locale dictionary
├── sections/
│   ├── announcement-bar.liquid
│   ├── header.liquid
│   ├── hero-banner.liquid
│   ├── main-product.liquid
│   ├── recline-showcase.liquid
│   ├── ergonomic-anatomy.liquid
│   ├── cushion-engineering.liquid
│   ├── comparison-table.liquid
│   ├── product-specs.liquid
│   ├── reviews-testimonials.liquid
│   ├── faq.liquid
│   ├── guarantee-banner.liquid
│   ├── footer.liquid
│   ├── main-cart.liquid
│   ├── main-page.liquid
│   └── main-404.liquid
├── snippets/
│   ├── cart-drawer.liquid
│   ├── sticky-atc.liquid
│   ├── product-card.liquid
│   └── icon.liquid
└── templates/
    ├── index.json
    ├── product.json
    ├── cart.json
    ├── page.json
    └── 404.json
```

---

## 🚀 How to Deploy to Shopify

1. **Option A: Using Shopify CLI (Local Development / Live Push)**
   ```bash
   shopify theme dev --store your-store.myshopify.com
   shopify theme push --store your-store.myshopify.com
   ```

2. **Option B: ZIP Upload to Shopify Admin**
   - Compress the repository contents into a `.zip` archive.
   - In Shopify Admin, navigate to **Online Store > Themes**.
   - Click **Add theme > Upload zip file**.
   - Click **Publish**!
