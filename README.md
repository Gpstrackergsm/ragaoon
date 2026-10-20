# Ragaoon Ergonomic Gaming Chair – Official Shopify Theme

A high-converting Direct-to-Consumer (DTC) Shopify Online Store 2.0 theme built exclusively for **ragaoon** ([ragaoon.com.co](https://ragaoon.com.co/products/ragaoon-ergonomic-gaming-chair)).

Designed for lasting comfort, flexible seating, and reliable support for gaming, working, studying, or relaxing.

---

## 🎯 Key Conversion Features

1. **High-Impact Hero Section (`sections/hero-banner.liquid`)**
   - High-resolution hero imagery directly from Ragaoon.
   - Live spec callouts: *Synchronized Armrests*, *Pocket Springs + Foam Core*, *Reinforced Steel Base (150 kg / 330 lbs)*.
   - Dual CTAs with smooth scrolling to the purchase module and video demonstration.

2. **Flagship Purchase Engine (`sections/main-product.liquid`)**
   - **Official Pricing**: **$89.00 USD** (Compare at $139.00 USD — Save $50).
   - **9 Real High-Res Product Angles**: Thumbnails for front view, 7-point ergonomic support, 51cm flat wingless seat, pocket springs + high-density foam cutaway, 90°–135° recline with synchronized armrests, 150 kg load steel base, exact dimensions, PU leather, and easy assembly.
   - **Urgency & Scarcity**: Real-time batch inventory meter (*"Only 6 chairs remaining at $89.00"*) and live countdown timer for same-day dispatch.
   - **Financing & 1-Click Buy**: Klarna / Afterpay 4-interest-free installments ($22.25/mo), quantity stepper, and instant 1-click checkout.

3. **Official Video Showcase (`sections/video-showcase.liquid`)**
   - Integrated HTML5 video player streaming the official product demonstration video showcasing the smooth 90°–135° recline, synchronized armrests, and 51cm pocket spring seat in motion.

4. **Interactive 90°–135° Recline Visualizer (`sections/recline-showcase.liquid`)**
   - Real-time interactive angle switching:
     - **90°**: Focused Work & Orthopedic Alignment
     - **110°**: Gaming & Casual Immersion
     - **135°**: Zero-G Rest & Power Nap (synchronized armrests tilt automatically to keep elbows supported)

5. **7-Point Orthopedic Anatomy Breakdown (`sections/ergonomic-anatomy.liquid`)**
   - Deep dive into full-body relief: Headrest, Shoulder Support, Lumbar Curve, Synchronized Armrests, 51cm Flat Wingless Pocket Spring Cushion, and Reinforced Steel Construction.

6. **Sofa-Grade Cushion Engineering (`sections/cushion-engineering.liquid`)**
   - 4-layer cutaway breakdown: Breathable Black PU Leather, 50D Molded Foam, 16-Pocket Spring Core Mattress Matrix, Alloy Steel Foundation.
   - Explains why cheap slab foam flattens in 3 months vs. how Ragaoon's pocket springs bounce back for years.

7. **Direct-Response Feature Matrix (`sections/comparison-table.liquid`)**
   - Comparison: **Ragaoon ($89.00 USD)** vs. Generic Office Chairs ($130–$180) vs. Overpriced Racer Brands ($350–$500+).

8. **Technical Specifications & Blueprint (`sections/product-specs.liquid`)**
   - Exact specifications: Brand: Ragaoon, Color: Black, Seat Width: 51 cm, Max Weight: 150 kg (330 lbs), Dimensions: 55.3" D × 28.27" W × 28.28" H, Weight: 42.6 lbs.

9. **Verified Buyer Reviews (`sections/reviews-testimonials.liquid`)**
   - 4.9/5 aggregate rating, verified buyer badges, and real customer testimonials.

10. **Buyer FAQ Accordion (`sections/faq.liquid`)**
    - Answers to all key questions: assembly time (15 mins, tools included), 150 kg weight capacity, synchronized armrests, 51 cm flat seat cross-legged comfort, and 30-day trial.

11. **Slide-Out AJAX Cart Drawer (`snippets/cart-drawer.liquid`)**
    - Free shipping unlock progress meter, rollerblade wheel upsell, subtotal calculation, and direct checkout.

12. **Sticky Add-to-Cart Bar (`snippets/sticky-atc.liquid`)**
    - Persistent sliding purchase bar with quick $89 add-to-cart on desktop and mobile.

---

## 📁 Architecture & File Layout

```
ragaoon/
├── assets/
│   ├── theme.css             # Performance CSS (responsive, dark mode, zero bloated libraries)
│   └── theme.js              # Vanilla JS for drawer, recline visualizer, variants, FAQs
├── config/
│   ├── settings_schema.json  # Theme settings customizer schema
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
│   ├── video-showcase.liquid
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
   - Compress the repository into a `.zip` archive.
   - In Shopify Admin, navigate to **Online Store > Themes**.
   - Click **Add theme > Upload zip file**.
   - Click **Publish**!
