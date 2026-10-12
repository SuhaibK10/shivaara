// Catalog data for the Shivara storefront prototype.
// Swap this file for a Shopify Storefront API call when the real store is ready.

window.OCCASIONS = [
  { slug: "diwali", name: "Diwali & Festive", blurb: "Diyas, mithai and hampers that glow", image: "assets/img/diya-lighting.jpg" },
  { slug: "birthday", name: "Birthdays", blurb: "Little surprises, big smiles", image: "assets/img/birthday-card.jpg" },
  { slug: "love", name: "Anniversary & Love", blurb: "Roses, truffles and keepsakes", image: "assets/img/roses-gift.jpg" },
  { slug: "wedding", name: "Wedding & Shagun", blurb: "Favours and keepsake boxes", image: "assets/img/white-bloom.jpg" },
  { slug: "housewarming", name: "Housewarming", blurb: "Candles, tea and warm welcomes", image: "assets/img/candle-corner.jpg" },
  { slug: "corporate", name: "Corporate", blurb: "Branded sets for teams and clients", image: "assets/img/lavender-journal.jpg" }
];

window.WRAPS = [
  { id: "kraft", name: "Signature Kraft", swatch: "#C8A27A" },
  { id: "red", name: "Festive Red", swatch: "#A8222E" },
  { id: "ivory", name: "Ivory Silk", swatch: "#F1E8D8" }
];

window.PRODUCTS = [
  {
    id: "festive-glow-hamper",
    name: "Festive Glow Hamper",
    price: 2499, compareAt: 2999,
    occasions: ["diwali", "corporate"],
    images: ["assets/img/festive-basket.jpg", "assets/img/twin-kraft.jpg"],
    badge: "Bestseller", rating: 4.8, reviews: 212, isNew: false,
    description: "A hand-packed wicker basket for the festive season, with dry-fruit pouches, artisanal cookies and a jar of saffron honey, finished with a ribbon and a handwritten card.",
    includes: ["Wicker basket with liner", "Roasted almond & cashew pouches", "Butter cookies (200 g)", "Saffron honey (120 g)", "Handwritten greeting card"]
  },
  {
    id: "marigold-diya-set",
    name: "Marigold Diya Set of 6",
    price: 899, compareAt: null,
    occasions: ["diwali", "housewarming"],
    images: ["assets/img/diya-railing.jpg", "assets/img/diya-closeup.jpg"],
    badge: "New", rating: 4.7, reviews: 64, isNew: true,
    description: "Six hand-thrown terracotta diyas, painted by potters in Khurja and packed in a marigold-print box. They're ready to light, gift or keep.",
    includes: ["6 terracotta diyas", "12 cotton wicks", "Marigold-print gift box"]
  },
  {
    id: "brass-glow-diya-box",
    name: "Brass Glow Diya Gift Box",
    price: 1299, compareAt: 1599,
    occasions: ["diwali"],
    images: ["assets/img/diya-closeup.jpg", "assets/img/diya-night.jpg"],
    badge: null, rating: 4.6, reviews: 91, isNew: false,
    description: "A pair of polished brass diyas with a tin of ghee wicks, nested in a velvet-lined keepsake box that's worth keeping after the festival.",
    includes: ["2 brass diyas", "Ghee wick tin (30 wicks)", "Velvet-lined box"]
  },
  {
    id: "kraft-love-note-box",
    name: "Kraft Love-Note Box",
    price: 1199, compareAt: null,
    occasions: ["birthday", "love"],
    images: ["assets/img/kraft-bow.jpg", "assets/img/holding-gift.jpg"],
    badge: "Personalise", rating: 4.9, reviews: 148, isNew: false,
    description: "Pick a few favourites and we'll tie them up in kraft paper and a satin bow with a note in your words. It's simple and warm, and it always lands well.",
    includes: ["Kraft gift box with satin bow", "Dark chocolate bar", "Mini scented candle", "Personalised note card"]
  },
  {
    id: "sage-ribbon-box",
    name: "Sage Ribbon Keepsake Box",
    price: 1499, compareAt: null,
    occasions: ["birthday", "wedding"],
    images: ["assets/img/sage-ribbon.jpg", "assets/img/holding-gift.jpg"],
    badge: null, rating: 4.7, reviews: 57, isNew: true,
    description: "A sage-green box with a peach ribbon and a small curated set inside. It's soft, calm and easy to give.",
    includes: ["Rigid sage gift box", "Hand cream (50 ml)", "Herbal tea sachets", "Pressed-flower bookmark"]
  },
  {
    id: "blush-bow-box",
    name: "Blush Bow Surprise Box",
    price: 999, compareAt: 1199,
    occasions: ["birthday", "love"],
    images: ["assets/img/blush-bow.jpg", "assets/img/coral-trellis.jpg"],
    badge: null, rating: 4.5, reviews: 83, isNew: false,
    description: "A striped blush box with an oversized bow, filled with sweet treats and a little keepsake. It makes a good \"just because\" gift.",
    includes: ["Striped blush box", "Assorted truffles (6 pc)", "Rose-gold keychain", "Greeting card"]
  },
  {
    id: "rose-truffle-box",
    name: "Rose & Truffle Box",
    price: 1799, compareAt: null,
    occasions: ["love"],
    images: ["assets/img/roses-gift.jpg", "assets/img/rose-chocolates.jpg"],
    badge: "Bestseller", rating: 4.9, reviews: 301, isNew: false,
    description: "Long-stem red roses with a box of handmade truffles. It's our most-ordered anniversary gift.",
    includes: ["3 long-stem roses", "Handmade truffles (9 pc)", "Red ribbon wrap", "Message card"]
  },
  {
    id: "white-bloom-keepsake",
    name: "White Bloom Keepsake",
    price: 2199, compareAt: null,
    occasions: ["wedding", "love"],
    images: ["assets/img/white-bloom.jpg", "assets/img/dried-bloom.jpg"],
    badge: null, rating: 4.8, reviews: 46, isNew: true,
    description: "White blooms arranged in a hexagonal keepsake box. It's made for shagun, bridal showers and thank-yous to the people who made the day.",
    includes: ["Hexagonal keepsake box", "Seasonal white florals", "Shagun envelope", "Satin ribbon"]
  },
  {
    id: "soy-candle-trio",
    name: "Soy Candle Trio",
    price: 1349, compareAt: null,
    occasions: ["housewarming", "birthday"],
    images: ["assets/img/candle-gift-box.jpg", "assets/img/candle-corner.jpg"],
    badge: "Bestseller", rating: 4.8, reviews: 176, isNew: false,
    description: "Three hand-poured soy candles in sandalwood, jasmine and vetiver, presented in a ribboned box with a magnetic lid.",
    includes: ["3 soy candles (80 g each)", "Magnetic-lid gift box", "Care card"]
  },
  {
    id: "calm-corner-kit",
    name: "Calm Corner Candle Kit",
    price: 1649, compareAt: null,
    occasions: ["housewarming"],
    images: ["assets/img/candle-corner.jpg", "assets/img/candle-gift-box.jpg"],
    badge: null, rating: 4.6, reviews: 38, isNew: true,
    description: "A large jar candle, a ceramic bud vase and a few dried stems. It's a cosy corner, ready to set up in a new home.",
    includes: ["Jar candle (200 g)", "Ceramic bud vase", "Dried flower stems", "Matchbox"]
  },
  {
    id: "crimson-classic-box",
    name: "Crimson Classic Box",
    price: 799, compareAt: null,
    occasions: ["love", "birthday"],
    images: ["assets/img/crimson-ribbon.jpg", "assets/img/noir-boxes.jpg"],
    badge: null, rating: 4.4, reviews: 72, isNew: false,
    description: "An ivory box with a big crimson bow. Fill it with our chocolate assortment, or choose \"empty\" and add your own gift.",
    includes: ["Ivory rigid box", "Crimson satin bow", "Chocolate assortment (optional)"]
  },
  {
    id: "coral-trellis-gift",
    name: "Coral Trellis Gift Box",
    price: 899, compareAt: null,
    occasions: ["birthday"],
    images: ["assets/img/coral-trellis.jpg", "assets/img/blush-bow.jpg"],
    badge: null, rating: 4.5, reviews: 29, isNew: false,
    description: "Coral trellis paper with a mint ribbon. It's cheerful and bright, and good for birthdays at any age.",
    includes: ["Trellis-wrapped box", "Mini cookie jar", "Birthday candle", "Card"]
  },
  {
    id: "executive-noir-set",
    name: "Executive Noir Set (Pack of 3)",
    price: 3299, compareAt: 3899,
    occasions: ["corporate", "diwali"],
    images: ["assets/img/noir-boxes.jpg", "assets/img/lavender-journal.jpg"],
    badge: "Corporate", rating: 4.7, reviews: 54, isNew: false,
    description: "Three matte-black boxes with crimson and black bows, made for client and team gifting. Logo printing is available from 25 units.",
    includes: ["3 matte-black gift boxes", "Journal + metal pen", "Coffee sampler", "Optional logo sleeve"]
  },
  {
    id: "blush-journal-set",
    name: "Blush Journal & Pencil Set",
    price: 749, compareAt: null,
    occasions: ["corporate", "birthday"],
    images: ["assets/img/blush-journal.jpg", "assets/img/pen-notebook.jpg"],
    badge: null, rating: 4.6, reviews: 88, isNew: false,
    description: "Two linen-bound journals in blush and marble with a pair of cedar pencils. It's for list-makers and dreamers.",
    includes: ["2 A5 journals (120 pages)", "2 cedar pencils", "Kraft sleeve"]
  },
  {
    id: "lavender-leather-journal",
    name: "Lavender Leather Journal & Pen",
    price: 1099, compareAt: null,
    occasions: ["corporate"],
    images: ["assets/img/lavender-journal.jpg", "assets/img/pen-notebook.jpg"],
    badge: null, rating: 4.7, reviews: 61, isNew: false,
    description: "A vegan-leather journal in lavender with a weighted black pen. It can be monogrammed with up to three initials.",
    includes: ["Vegan-leather journal", "Weighted gel pen", "Gift box", "Monogram (optional)"]
  },
  {
    id: "tea-ritual-box",
    name: "Tea Ritual Box",
    price: 1249, compareAt: null,
    occasions: ["housewarming", "corporate"],
    images: ["assets/img/tea-ritual.jpg", "assets/img/festive-basket.jpg"],
    badge: null, rating: 4.8, reviews: 97, isNew: false,
    description: "Three single-estate teas from Darjeeling, Assam and the Nilgiris, with a double-walled glass cup. It makes a slow morning in a box.",
    includes: ["3 loose-leaf teas (50 g each)", "Double-walled glass cup", "Steel infuser"]
  },
  {
    id: "twin-kraft-gift-pair",
    name: "Twin Kraft Gift Pair",
    price: 1399, compareAt: null,
    occasions: ["wedding", "diwali"],
    images: ["assets/img/twin-kraft.jpg", "assets/img/presents-pile.jpg"],
    badge: null, rating: 4.6, reviews: 42, isNew: true,
    description: "Two stacked kraft boxes in pastel ribbons, one with sweets and one with a keepsake. It's a good pick for return gifts and favours.",
    includes: ["2 kraft boxes", "Assorted mithai (250 g)", "Brass keepsake", "Ribbon set"]
  },
  {
    id: "birthday-bloom-card-set",
    name: "Birthday Bloom Card & Gift",
    price: 649, compareAt: null,
    occasions: ["birthday"],
    images: ["assets/img/birthday-card.jpg", "assets/img/blush-bow.jpg"],
    badge: null, rating: 4.4, reviews: 33, isNew: false,
    description: "A bright pop-up card paired with a mini gift box. It's the easiest way to say you remembered.",
    includes: ["Pop-up birthday card", "Mini gift box", "Confetti pouch"]
  },
  {
    id: "mini-surprise-box",
    name: "Mini Surprise Box",
    price: 499, compareAt: null,
    occasions: ["birthday", "love"],
    images: ["assets/img/mini-box.jpg", "assets/img/sage-ribbon.jpg"],
    badge: null, rating: 4.5, reviews: 120, isNew: false,
    description: "A palm-sized aqua box with a white ribbon. Put a ring, earrings or a note inside. It's small but it gets noticed.",
    includes: ["Aqua rigid mini box", "White satin ribbon", "Velvet insert"]
  },
  {
    id: "dried-bloom-wrap",
    name: "Dried Bloom Kraft Wrap",
    price: 1099, compareAt: null,
    occasions: ["wedding", "love"],
    images: ["assets/img/dried-bloom.jpg", "assets/img/white-bloom.jpg"],
    badge: null, rating: 4.7, reviews: 26, isNew: true,
    description: "A tall kraft-wrapped gift dressed with dried blooms and sheer ribbon. It's rustic and elegant, and it lasts long after the day.",
    includes: ["Kraft-wrapped gift tube", "Dried flower posy", "Sheer ribbon", "Tag"]
  }
];
