/**
 * Dubai Fragrances - Product Catalog Database
 * 40 Artisanal Arabian Attars & Dehn Al Oudh
 * Exact names as specified.
 * Pricing engine: 6ml is exactly 2x of 3ml, and 12ml is exactly 4x of 3ml (double of 6ml).
 */

const PRODUCTS = [
  // ==========================================
  // 1. COMBOS & OFFERS (8 Items)
  // ==========================================
  {
    id: "combo-01",
    name: "New Launch Combo 15ml",
    category: "Combos & Offers",
    basePrice: 699,
    originalPrice: 1499,
    fixedSize: "15ml Combo Box",
    badge: "NEW LAUNCH",
    rating: 4.9,
    reviewsCount: 420,
    desc: "Our exclusive new launch compilation: 5 best-selling 3ml roll-on attars including Absolute Bond, Musk Tahara, Khamrah, Eternal Grace, and White Oud.",
    notes: {
      top: "Saffron, Bergamot, Damask Rose",
      heart: "Cambodian Agarwood, Lotus, Praline",
      base: "White Musk, Bourbon Vanilla, Ambergris"
    },
    features: ["5 Blends in 1 Box", "Velvet Gift Box Included", "100% Pure Alcohol-Free Oil"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-02",
    name: "Musk Duo",
    category: "Combos & Offers",
    basePrice: 449,
    originalPrice: 899,
    fixedSize: "2 x 6ml Duo",
    badge: "BEST VALUE",
    rating: 4.9,
    reviewsCount: 312,
    desc: "Pure musk harmony: the thick velvety Musk Tahara paired with the crisp, immaculate White Musk.",
    notes: {
      top: "White Lotus, Lily of the Valley",
      heart: "Cotton Flower, Violet Petals",
      base: "Creamy White Musk, Silken Cashmere"
    },
    features: ["Includes 2 Premium Flacons", "Creamy & Silky Profiles", "14+ Hours Skin Sillage"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-03",
    name: "Dehnaloud Crystal 12ml",
    category: "Combos & Offers",
    basePrice: 899,
    originalPrice: 1899,
    fixedSize: "12ml Crystal Flacon",
    badge: "ROYAL COMBO",
    rating: 5.0,
    reviewsCount: 189,
    desc: "A collector's crystal flacon featuring aged Cambodian Dehn Al Oudh with artisanal Mukhallat accords.",
    notes: {
      top: "Smoky Cambodian Oud, Cardamom",
      heart: "Taif Rose, Resinous Incense",
      base: "Aged Assam Agarwood, Black Amber"
    },
    features: ["Crystal Cut Flacon", "Aged Matured Agarwood", "Gold Foil Presentation"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-04",
    name: "Royal Arabian Gift Box",
    category: "Combos & Offers",
    basePrice: 1199,
    originalPrice: 2499,
    fixedSize: "4 x 6ml Box",
    badge: "GIFT SET",
    rating: 4.8,
    reviewsCount: 154,
    desc: "Handcrafted wooden keepsake vault featuring 4 majestic blends: Absolute Bond, Passion D'Amber, Tobacco Noir, and Yaqoot.",
    notes: {
      top: "Bergamot, Saffron, Spiced Orange",
      heart: "Tobacco Blossom, Ambergris, Jasmine",
      base: "Cuban Cedar, Aged Patchouli, Leather"
    },
    features: ["Carved Wood Box", "Glass Wand & Roll-on caps", "Perfect For Gifting"],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-05",
    name: "Fresh Breeze Summer Duo",
    category: "Combos & Offers",
    basePrice: 399,
    originalPrice: 799,
    fixedSize: "2 x 6ml Set",
    badge: "SAVE 50%",
    rating: 4.8,
    reviewsCount: 228,
    desc: "Sun-drenched freshness for hot climates: uplifting citrus combined with opulent Mediterranean floral accords.",
    notes: {
      top: "Sicilian Bergamot, Blood Orange",
      heart: "Damask Rose, Peony, Sparkling Neroli",
      base: "Clean Amber, Sunlit Vetiver"
    },
    features: ["Day & Evening Pair", "Lightweight Pure Oils", "Non-Staining Formula"],
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-06",
    name: "Amber & Rose Romance Set",
    category: "Combos & Offers",
    basePrice: 549,
    originalPrice: 1099,
    fixedSize: "2 x 6ml Duo",
    badge: "LIMITED PACK",
    rating: 4.9,
    reviewsCount: 176,
    desc: "Warm romantic winter indulgence pairing Passion D'Amber with pure Taif Rose oil.",
    notes: {
      top: "Cinnamon Bark, Golden Honey",
      heart: "Damask Rose, Spiced Amber",
      base: "Smoky Benzoin, Bourbon Vanilla Pods"
    },
    features: ["Intense Sillage", "Cold Weather Essential", "Golden Velvet Pouch"],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-07",
    name: "Executive Oud Vault",
    category: "Combos & Offers",
    basePrice: 999,
    originalPrice: 2199,
    fixedSize: "Hamper Box",
    badge: "FESTIVE SPECIAL",
    rating: 5.0,
    reviewsCount: 96,
    desc: "Deluxe heritage set containing concentrated agarwood oils, aged mukhallat, and brass applicator rod.",
    notes: {
      top: "Incense Smoke, Royal Frankincense",
      heart: "Myrrh, Arabian Red Rose",
      base: "Precious Agarwood, Golden Amber"
    },
    features: ["Complete Ritual Hamper", "Includes Brass Applicator", "Authentic Gulf Formulation"],
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "combo-08",
    name: "Crown Jewels Set",
    category: "Combos & Offers",
    basePrice: 599,
    originalPrice: 1299,
    fixedSize: "4 x 3ml Pocket Set",
    badge: "EXECUTIVE",
    rating: 4.8,
    reviewsCount: 205,
    desc: "Four pocket-sized signature attars for boardroom and evening galas: Absolute Bond, Tobacco Noir, Safari, and Decision.",
    notes: {
      top: "Black Pepper, Cardamom, Bergamot",
      heart: "Smoky Birch, Smoked Cedar, Rose",
      base: "Cambodian Oud, Oakmoss, Leather"
    },
    features: ["Compact Pocket Roll-ons", "High Projection", "Lasts 2+ Months"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },

  // ==========================================
  // 2. OUDH & WOODY (8 Items)
  // ==========================================
  {
    id: "oud-01",
    name: "Absolute Bond",
    category: "Oudh & Woody",
    basePrice: 249,
    originalPrice: 499,
    fixedSize: null,
    badge: "BESTSELLER",
    rating: 4.9,
    reviewsCount: 540,
    desc: "A magnetic, commanding blend of dark aged Cambodian agarwood, smoky atlas cedar, and subtle black amber.",
    notes: {
      top: "Bergamot, Saffron, Wild Thyme",
      heart: "Cambodian Agarwood, Bulgarian Rose, Cedarwood",
      base: "Black Amber, Patchouli, Distilled Leather"
    },
    features: ["16+ Hours Longevity", "Smooth Woody Drydown", "Roll-on & Dip Rod Included"],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-02",
    name: "Tobacco Noir",
    category: "Oudh & Woody",
    basePrice: 229,
    originalPrice: 459,
    fixedSize: null,
    badge: "STAFF PICK",
    rating: 4.9,
    reviewsCount: 390,
    desc: "Rich Cuban tobacco leaves steeped in bourbon vanilla, roasted tonka bean, and spiced agarwood chips.",
    notes: {
      top: "Tobacco Leaf, Spicy Ginger, Clove",
      heart: "Tonka Bean, Tobacco Blossom, Cacao",
      base: "Bourbon Vanilla, Woody Accords, Dried Fruits"
    },
    features: ["Warm Gourmand Smoky", "Incredible Sillage", "Unisex Magnetism"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-03",
    name: "White Oud",
    category: "Oudh & Woody",
    basePrice: 199,
    originalPrice: 399,
    fixedSize: null,
    badge: "POPULAR",
    rating: 4.8,
    reviewsCount: 460,
    desc: "A smooth, ethereal oud infused with soft powdery amber, fresh white lilies, and creamy Australian sandalwood.",
    notes: {
      top: "White Lilies, Sweet Lemon, Cardamom",
      heart: "Light Agarwood, Jasmine Sambac, Amber",
      base: "White Sandalwood, Cashmeran, Musk"
    },
    features: ["Non-Overpowering Oud", "Office Safe", "Gentle Creamy Touch"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-04",
    name: "Oud Al Badar",
    category: "Oudh & Woody",
    basePrice: 299,
    originalPrice: 599,
    fixedSize: null,
    badge: "ROYAL BLEND",
    rating: 5.0,
    reviewsCount: 215,
    desc: "Distilled from wild Assam agarwood, opening with deep resinous warmth and drying down to regal honeyed wood.",
    notes: {
      top: "Smoky Assam Woods, Black Pepper",
      heart: "Resinous Pine, Leather, Frankincense",
      base: "Pure Indian Agarwood, Ambergris, Civet Accord"
    },
    features: ["Deep Animalic Richness", "Traditional Deg & Bhapka Distillation", "For True Oud Aficionados"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-05",
    name: "Safari",
    category: "Oudh & Woody",
    basePrice: 219,
    originalPrice: 439,
    fixedSize: null,
    badge: "BOLD",
    rating: 4.8,
    reviewsCount: 184,
    desc: "Untamed forest woods, dry vetiver roots, crisp bergamot, and golden ambergris. Evokes a sunset safari over golden dunes.",
    notes: {
      top: "Crisp Bergamot, Wild Grapefruit",
      heart: "Dry Vetiver, Cedar needles, Clary Sage",
      base: "Smoked Agarwood, Ambergris, Oakmoss"
    },
    features: ["Earthy & Sharp", "All-Season Wear", "Signature Trail"],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-06",
    name: "Hindi Oud",
    category: "Oudh & Woody",
    basePrice: 349,
    originalPrice: 699,
    fixedSize: null,
    badge: "ULTRA PREMIUM",
    rating: 5.0,
    reviewsCount: 128,
    desc: "Collector's grade matured Hindi Dehn Al Oudh with hypnotic depth, sweet hay, and ancient barnyard accords.",
    notes: {
      top: "Aged Hay, Spiced Dried Plum",
      heart: "Dense Assam Agarwood, Smoked Birch",
      base: "Warm Animalic Musks, Aged Resin"
    },
    features: ["Extremely Concentrated", "Aged Matured Agarwood", "One Drop Lasts 24+ Hours"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-07",
    name: "Cambodian Dehn Al Oudh",
    category: "Oudh & Woody",
    basePrice: 329,
    originalPrice: 659,
    fixedSize: null,
    badge: "ARTISANAL",
    rating: 4.9,
    reviewsCount: 198,
    desc: "Sweet, balsamic opening evolving into warm leather, caramelized resinous timber, and ancient forest bark.",
    notes: {
      top: "Caramelized Fig, Cardamom",
      heart: "Cambodian Agarwood, Red Rose",
      base: "Smoked Leather, Ambergris Resin"
    },
    features: ["Fruity Woody Nuances", "Precious Distillate", "Traditional Glass Wand"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oud-08",
    name: "Royal Santal",
    category: "Oudh & Woody",
    basePrice: 239,
    originalPrice: 479,
    fixedSize: null,
    badge: "SMOOTH",
    rating: 4.8,
    reviewsCount: 270,
    desc: "Creamy Mysore sandalwood harmonized with refined agarwood and delicate saffron threads.",
    notes: {
      top: "Kashmiri Saffron, Nutmeg",
      heart: "Mysore Sandalwood Heartwood, Cedar",
      base: "Refined Agarwood, Warm Golden Amber"
    },
    features: ["Calming Meditative Essence", "Velvety Skin Touch", "Pure Wood Distillation"],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },

  // ==========================================
  // 3. PURE MUSK (8 Items)
  // ==========================================
  {
    id: "musk-01",
    name: "Musk Tahara",
    category: "Pure Musk",
    basePrice: 199,
    originalPrice: 399,
    fixedSize: null,
    badge: "ICONIC BESTSELLER",
    rating: 4.9,
    reviewsCount: 890,
    desc: "The legendary white creamy attar. Thick, velvety, opening with pure white lotus, powdery violet, and clean musk.",
    notes: {
      top: "White Lotus, Lily of the Valley, Taif Rose",
      heart: "Powdery Violet, Sweet Jasmine, Iris",
      base: "Creamy White Musk, Vanilla Nectar, Sandalwood"
    },
    features: ["Luxurious Cream Consistency", "The Ultimate Fresh Clean Scent", "Skin-Safe & Hypoallergenic"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-02",
    name: "White Musk",
    category: "Pure Musk",
    basePrice: 179,
    originalPrice: 359,
    fixedSize: null,
    badge: "ALL-DAY FRESH",
    rating: 4.8,
    reviewsCount: 410,
    desc: "Featherlight, crisp, and immaculate white musk with whispers of cotton flower, clean linen, and sweet jasmine.",
    notes: {
      top: "Cotton Flower, Clean Linen accord",
      heart: "Sweet Jasmine, White Freesia",
      base: "Silk White Musk, Blonde Woods"
    },
    features: ["Ultra Clean Linen Scent", "Perfect for Daily Wear", "Alcohol-Free Pure Oil"],
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-03",
    name: "Body Musk",
    category: "Pure Musk",
    basePrice: 169,
    originalPrice: 349,
    fixedSize: null,
    badge: "EVERYDAY ESSENTIAL",
    rating: 4.7,
    reviewsCount: 340,
    desc: "An intimate, clean skin scent with fresh floral undertones and enduring powdery warmth that radiates naturally.",
    notes: {
      top: "Morning Dew, Aldehydic Flowers",
      heart: "Heliotrope, Ylang Ylang, Iris",
      base: "Sensual Body Musk, Soft Cedarwood"
    },
    features: ["Subtle Skin Scent", "Natural Intimacy", "Quick Absorption"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-04",
    name: "Golden Musk",
    category: "Pure Musk",
    basePrice: 209,
    originalPrice: 419,
    fixedSize: null,
    badge: "WARM & SENSUAL",
    rating: 4.9,
    reviewsCount: 295,
    desc: "Gilded musk infused with warm wildflower honeycomb, roasted almond flakes, and glowing golden amber resins.",
    notes: {
      top: "Wild Honeycomb, Bitter Almond",
      heart: "Golden Amber, Heliotrope Blossom",
      base: "Rich Egyptian Musk, Caramelized Sugar"
    },
    features: ["Sweet Warm Musk", "Sensual Evening Scent", "Long Lasting Roll-on"],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-05",
    name: "Powder Musk",
    category: "Pure Musk",
    basePrice: 189,
    originalPrice: 379,
    fixedSize: null,
    badge: "COZY COMFORT",
    rating: 4.8,
    reviewsCount: 230,
    desc: "Soft cashmere vibes with delicate iris petals, subtle baby powder nuances, and silky white musk.",
    notes: {
      top: "Powdery Iris, Bergamot Mist",
      heart: "Cashmeran, White Violet, Rose Water",
      base: "Silky Musk, Tonka, Vanilla Chalk"
    },
    features: ["Velvety Comfort", "Post-Shower Routine", "Hypoallergenic"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-06",
    name: "Black Musk",
    category: "Pure Musk",
    basePrice: 249,
    originalPrice: 499,
    fixedSize: null,
    badge: "MYSTERIOUS",
    rating: 4.9,
    reviewsCount: 188,
    desc: "Intense, dark oriental musk with rich animalic undertones, black velvet rose, and smoked labdanum.",
    notes: {
      top: "Black Pepper, Dark Plum",
      heart: "Black Velvet Rose, Smoked Labdanum",
      base: "Dark Oriental Musk, Birch Tar, Patchouli"
    },
    features: ["Hypnotic Depth", "Daring Animalic Blend", "High Projection"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-07",
    name: "Musk Rose",
    category: "Pure Musk",
    basePrice: 199,
    originalPrice: 399,
    fixedSize: null,
    badge: "ROMANTIC",
    rating: 4.8,
    reviewsCount: 310,
    desc: "Crimson rose petals bathed in luminous white musk, sparkling pink pepper, and sweet vanilla crystals.",
    notes: {
      top: "Pink Pepper, Dewy Red Rose",
      heart: "Turkish Rose Absolute, Peony",
      base: "Luminous White Musk, Bourbon Vanilla"
    },
    features: ["Enchanting Floral Musk", "Bridal Favorite", "Silky Sillage"],
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "musk-08",
    name: "Deer Musk",
    category: "Pure Musk",
    basePrice: 279,
    originalPrice: 559,
    fixedSize: null,
    badge: "ANCIENT TRADITION",
    rating: 5.0,
    reviewsCount: 165,
    desc: "100% cruelty-free botanical recreation of antique royal deer musk (Kasturi), infused with spicy clove and warm earthy resins.",
    notes: {
      top: "Clove Bud, Nutmeg, Saffron",
      heart: "Castoreum Accord (Botanical), Dark Amber",
      base: "Kasturi Musk Resins, Patchouli, Opoponax"
    },
    features: ["100% Ethical & Vegan", "Ancient Royal Formulation", "Warm & Heavy Persistence"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },

  // ==========================================
  // 4. FLORAL & FRESH (8 Items)
  // ==========================================
  {
    id: "floral-01",
    name: "Eternal Grace",
    category: "Floral & Fresh",
    basePrice: 189,
    originalPrice: 379,
    fixedSize: null,
    badge: "FEMININE ELEGANCE",
    rating: 4.9,
    reviewsCount: 480,
    desc: "Sensual Damask rose intertwined with fresh freesia, Italian mandarin, and luminous crystalline musk.",
    notes: {
      top: "Italian Mandarin, Freesia, Pear",
      heart: "Damask Rose, White Magnolia, Peach Blossom",
      base: "Crystalline Musk, Sandalwood, Cashmere Wood"
    },
    features: ["Radiant & Uplifting", "Daytime Signature", "Roll-on Elegance"],
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-02",
    name: "Mukhallat Al Emaraat",
    category: "Floral & Fresh",
    basePrice: 219,
    originalPrice: 439,
    fixedSize: null,
    badge: "EMIRATI HERITAGE",
    rating: 4.9,
    reviewsCount: 360,
    desc: "Regal Arabian bouquet of saffron, blooming Taif roses, warm amber, and hints of green cardamom.",
    notes: {
      top: "Green Cardamom, Kashmiri Saffron",
      heart: "Saudi Taif Rose, Night Jasmine",
      base: "Golden Ambergris, Light Oudh, Sweet Musk"
    },
    features: ["Traditional Gulf Formulation", "Majestic Presence", "Long-Lasting"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-03",
    name: "Yaqoot",
    category: "Floral & Fresh",
    basePrice: 199,
    originalPrice: 399,
    fixedSize: null,
    badge: "AQUATIC FRESH",
    rating: 4.8,
    reviewsCount: 290,
    desc: "Oceanic breeze with salty sea mist, blue water lily, crushed mint leaves, and sun-warmed driftwood.",
    notes: {
      top: "Sea Salt Mist, Crushed Mint, Bergamot",
      heart: "Blue Lotus, Neroli Petals, Calone",
      base: "Driftwood, White Musk, Amber"
    },
    features: ["Ultra Refreshing", "Cooling Sensation", "Great in High Humidity"],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-04",
    name: "Silent Echo",
    category: "Floral & Fresh",
    basePrice: 179,
    originalPrice: 359,
    fixedSize: null,
    badge: "CALMING",
    rating: 4.7,
    reviewsCount: 190,
    desc: "Subtle French lavender fields, calming chamomile, and delicate white lily blooming over a gentle amber bed.",
    notes: {
      top: "French Lavender, Chamomile Mist",
      heart: "White Lily, Heliotrope, Jasmine",
      base: "Golden Honey Amber, Tonka Bean"
    },
    features: ["Aromatherapy Calming", "Bedtime & Relaxation Scent", "Pure Botanical Infusion"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-05",
    name: "Summer Vibe",
    category: "Floral & Fresh",
    basePrice: 169,
    originalPrice: 339,
    fixedSize: null,
    badge: "INVIGORATING",
    rating: 4.8,
    reviewsCount: 275,
    desc: "Zesty Sicilian bergamot, blood orange, sparkling neroli, and sunlit vetiver for an explosive citrus wake-up.",
    notes: {
      top: "Sicilian Bergamot, Blood Orange, Lemon",
      heart: "Orange Blossom, Neroli, Cardamom",
      base: "Haitian Vetiver, White Cedar, Musk"
    },
    features: ["Instant Mood Lifter", "Sparkling Citrus Notes", "Pocket Sized Roll-on"],
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-06",
    name: "Rose Vanilla",
    category: "Floral & Fresh",
    basePrice: 199,
    originalPrice: 399,
    fixedSize: null,
    badge: "SWEET & ADDICTIVE",
    rating: 4.9,
    reviewsCount: 420,
    desc: "Sugared Turkish rose petals drizzled with warm Madagascar vanilla bean paste and blonde white cedar.",
    notes: {
      top: "Sugared Water, Italian Lemon",
      heart: "Turkish Rose Petals, Loukhoum Accord",
      base: "Madagascar Vanilla Bean, White Musk, Cedar"
    },
    features: ["Crowd-Pleasing Gourmand", "Hypnotic Sweet Floral", "Compliment Magnet"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-07",
    name: "Taif Rose",
    category: "Floral & Fresh",
    basePrice: 269,
    originalPrice: 539,
    fixedSize: null,
    badge: "RARE BOTANICAL",
    rating: 5.0,
    reviewsCount: 155,
    desc: "Hydro-distilled Saudi Taif rose oil known for its crisp, dewy, spicy-sweet honeyed floral character.",
    notes: {
      top: "Dewy Mountain Air, Crisp Green Stem",
      heart: "100% Pure Taif Rose Petals, Saffron",
      base: "Honeyed Amber, Soft Sandalwood"
    },
    features: ["Single Origin Taif Distillation", "Regal Floral Sillage", "Dip Rod Applicator"],
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "floral-08",
    name: "Blue Diamond Aqua",
    category: "Floral & Fresh",
    basePrice: 189,
    originalPrice: 379,
    fixedSize: null,
    badge: "COOL BREEZE",
    rating: 4.8,
    reviewsCount: 210,
    desc: "Crisp aquatic notes with crisp green apple, marine driftwood, and icy clean aldehydes.",
    notes: {
      top: "Crisp Green Apple, Icy Aldehydes",
      heart: "Marine Sea Foam, Blue Sage, Lavender",
      base: "Mineral Amber, Driftwood, Musk"
    },
    features: ["Modern Sport Attar", "Active Lifestyle", "Zero Alcohol Sting"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },

  // ==========================================
  // 5. WARM ORIENTAL (8 Items)
  // ==========================================
  {
    id: "oriental-01",
    name: "Decision",
    category: "Warm Oriental",
    basePrice: 229,
    originalPrice: 459,
    fixedSize: null,
    badge: "SIGNATURE MASCULINE",
    rating: 4.9,
    reviewsCount: 460,
    desc: "Sharp cardamom, spicy pink pepper, smoky frankincense, and deep patchouli-amber foundation.",
    notes: {
      top: "Cardamom, Pink Pepper, Violet Leaves",
      heart: "Smoky Incense, Sage, Cinnamon Bark",
      base: "Crystalline Amber, Chestnut, Glazed Vanilla"
    },
    features: ["Charismatic Projection", "Executive Scent Profile", "12+ Hours Longevity"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-02",
    name: "Passion D'Amber",
    category: "Warm Oriental",
    basePrice: 209,
    originalPrice: 419,
    fixedSize: null,
    badge: "HYPNOTIC",
    rating: 4.9,
    reviewsCount: 380,
    desc: "Golden liquid amber enriched with warm benzoin, cinnamon bark, and sensual leather.",
    notes: {
      top: "Coriander, Cinnamon Bark, Bergamot",
      heart: "Golden Amber, Benzoin Tears, Labdanum",
      base: "Madagascar Vanilla, Patchouli, Soft Leather"
    },
    features: ["Warm Resinous Glow", "Evening Date Night Pick", "Rich Golden Oil"],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-03",
    name: "Vintage Cigar",
    category: "Warm Oriental",
    basePrice: 249,
    originalPrice: 499,
    fixedSize: null,
    badge: "CONNOISSEUR",
    rating: 5.0,
    reviewsCount: 340,
    desc: "Aged tobacco leaves, dark spiced rum, roasted cacao beans, and creamy vanilla wood.",
    notes: {
      top: "Dark Jamaican Rum, Pink Pepper, Neroli",
      heart: "Cured Cigar Tobacco, Clary Sage, Cacao",
      base: "Vanilla Bean, Styrax, Cedarwood"
    },
    features: ["Opulent Speakeasy Aroma", "Rich Warm Sillage", "Rare Attar Extraction"],
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-04",
    name: "Dubai Vibe",
    category: "Warm Oriental",
    basePrice: 239,
    originalPrice: 479,
    fixedSize: null,
    badge: "GLAMOUR",
    rating: 4.8,
    reviewsCount: 395,
    desc: "The spirit of Downtown Dubai: saffron, sparkling amber, dry oudh, and velvety caramel praline.",
    notes: {
      top: "Saffron Threads, Candied Citrus",
      heart: "Praline, Turkish Rose, Dry Agarwood",
      base: "Golden Amber, Cedar, White Musk"
    },
    features: ["Opulent Gulf Lifestyle", "Sweet Warm Drydown", "Compliment Winner"],
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-05",
    name: "Khamrah",
    category: "Warm Oriental",
    basePrice: 259,
    originalPrice: 519,
    fixedSize: null,
    badge: "GOURMAND ORIENTAL",
    rating: 5.0,
    reviewsCount: 620,
    desc: "Decadent boozy dates, nutmeg, cinnamon, sweet pralines, and smoky Akigalawood.",
    notes: {
      top: "Cognac accord, Cinnamon, Nutmeg",
      heart: "Dates, Praline, Tuberose, Mahonial",
      base: "Vanilla, Tonka Bean, Benzoin, Akigalawood"
    },
    features: ["Intoxicating Gourmand Warmth", "Winter Viral Sensation", "Unisex Appeal"],
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-06",
    name: "Shamama",
    category: "Warm Oriental",
    basePrice: 279,
    originalPrice: 559,
    fixedSize: null,
    badge: "ANCIENT RECIPE",
    rating: 4.9,
    reviewsCount: 140,
    desc: "A complex heritage formulation of 40+ wild herbs, spices, and roots slow-cooked over pure sandalwood oil.",
    notes: {
      top: "Clove, Saffron, Mace, Cardamom",
      heart: "Spikenard, Sugandh Mantri, Nagarmotha",
      base: "Mysore Sandalwood, Aged Ambergris, Patchouli"
    },
    features: ["Kannauj Deg Heritage", "Dense Herbal Spiciness", "Warming in Cold Weather"],
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-07",
    name: "Bakhoor Al-Arais",
    category: "Warm Oriental",
    basePrice: 219,
    originalPrice: 439,
    fixedSize: null,
    badge: "BRIDAL BLEND",
    rating: 4.8,
    reviewsCount: 280,
    desc: "Exotic bridal bakhoor with resinous frankincense, golden amber, red roses, and clean white musk.",
    notes: {
      top: "Arabian Incense, Taif Rose",
      heart: "Frankincense Tears, Sweet Amber",
      base: "White Musk, Sandalwood, Agarwood"
    },
    features: ["Aroma of Arabian Hospitality", "Rich Festive Atmosphere", "Long Lasting on Fabrics"],
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "oriental-08",
    name: "Golden Ambergris",
    category: "Warm Oriental",
    basePrice: 299,
    originalPrice: 599,
    fixedSize: null,
    badge: "PRECIOUS",
    rating: 5.0,
    reviewsCount: 195,
    desc: "Sun-cured ambergris accords with salty marine warmth, balsam of Peru, and ancient myrrh tears.",
    notes: {
      top: "Salty Sea Spray, Bergamot",
      heart: "Ambergris Resins, Balsam of Peru",
      base: "Ancient Myrrh, Labdanum, Sweet Woods"
    },
    features: ["Marine-Amber Royalty", "Velvety Skin Chemistry", "Rare Connoisseur Oil"],
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80"
  }
];

// Helper to look up a product by ID
function getProductById(id) {
  return PRODUCTS.find(p => p.id === id);
}

/**
 * Calculate prices for a given size.
 * Strict doubling pricing engine:
 * - 3ml: basePrice
 * - 6ml: exactly double of 3ml (basePrice * 2)
 * - 12ml: exactly double of 6ml (basePrice * 4)
 */
function getPriceForSize(product, size) {
  if (product.fixedSize) {
    return {
      price: product.basePrice,
      originalPrice: product.originalPrice,
      sizeLabel: product.fixedSize,
      savingsPct: Math.round(((product.originalPrice - product.basePrice) / product.originalPrice) * 100)
    };
  }

  let price = product.basePrice;
  let originalPrice = product.originalPrice;
  let sizeLabel = "3 ml";

  if (size === "6ml") {
    price = product.basePrice * 2;
    originalPrice = product.originalPrice * 2;
    sizeLabel = "6 ml";
  } else if (size === "12ml") {
    price = product.basePrice * 4;
    originalPrice = product.originalPrice * 4;
    sizeLabel = "12 ml";
  }

  const savingsPct = Math.round(((originalPrice - price) / originalPrice) * 100);

  return { price, originalPrice, sizeLabel, savingsPct };
}
