import type { Category, Order, Product, Review, Store, User, AuditLog } from "@/types";

export const initialStore: Store = {
  id: "store_cedar_craft_001",
  ownerUserId: "usr_seller_001",
  slug: "cedar-and-craft",
  name: {
    en: "Cedar & Craft",
    ar: "أرز وحِرف",
  },
  description: {
    en: "Useful objects made thoughtfully for everyday life. Hand-cut olive wood, washed linen, and solid brass.",
    ar: "منتجات عملية مصنوعة بعناية للحياة اليومية. خشب زيتون مشغول يدوياً، كتان مغسول، ونحاس صلب.",
  },
  status: "ACTIVE",
  currency: "USD",
};

export const initialCategories: Category[] = [
  {
    id: "cat_home_living",
    slug: "home-living",
    name: { en: "Home & Living", ar: "المنزل والمعيشة" },
    description: {
      en: "Thoughtful essentials for a calmer, intentional home.",
      ar: "أساسيات مختارة لمنزل أكثر راحة وسكينة.",
    },
    sortOrder: 10,
  },
  {
    id: "cat_accessories",
    slug: "accessories",
    name: { en: "Accessories", ar: "الإكسسوارات" },
    description: {
      en: "Small details designed to travel with you through daily rituals.",
      ar: "تفاصيل صغيرة مصممة لترافقك في تفاصيل يومك.",
    },
    sortOrder: 20,
  },
  {
    id: "cat_kitchen_dining",
    slug: "kitchen-dining",
    name: { en: "Kitchen & Dining", ar: "المطبخ وتناول الطعام" },
    description: {
      en: "Artisanal tableware and prep tools crafted for shared feasts.",
      ar: "أدوات مائدة وتحضير حرفية مصممة للولائم المشتركة.",
    },
    sortOrder: 30,
  },
  {
    id: "cat_stationery_paper",
    slug: "stationery-paper",
    name: { en: "Stationery & Reading", ar: "القرطاسية والقراءة" },
    description: {
      en: "Timeless keepsakes for writers, readers, and thinkers.",
      ar: "تذكارات خالدة للكتاب والقراء وأصحاب الفكر.",
    },
    sortOrder: 40,
  },
];

export const initialProducts: Product[] = [
  {
    id: "prod_cc_board_001",
    storeId: "store_cedar_craft_001",
    slug: "olive-wood-serving-board",
    sku: "CC-BOARD-001",
    title: {
      en: "Olive Wood Serving Board",
      ar: "لوح تقديم من خشب الزيتون",
    },
    description: {
      en: "A hand-finished serving board with a warm natural grain carved from sustainably pruned Mediterranean olive orchards. Treated only with food-grade cold-pressed organic mineral oil.",
      ar: "لوح تقديم مشغول يدوياً بعروق خشبية طبيعية دافئة منحوتة من بساتين الزيتون المتوسطية. معالج بزيوت عضوية آمنة غذائياً.",
    },
    categoryId: "cat_kitchen_dining",
    priceMinor: 4800, // $48.00
    compareAtPriceMinor: 5800,
    currency: "USD",
    stockOnHand: 18,
    lowStockThreshold: 5,
    images: [
      {
        url: "/src/assets/images/product_olive_wood_board_1794265186415.jpg",
        alt: {
          en: "Hand-finished olive wood serving board on travertine stone",
          ar: "لوح تقديم من خشب الزيتون المشغول يدوياً على حجر الترافرتين",
        },
      },
    ],
    attributes: [
      { key: { en: "Material", ar: "المادة" }, value: { en: "Aged Olive Wood", ar: "خشب زيتون معتق" } },
      { key: { en: "Dimensions", ar: "الأبعاد" }, value: { en: "38cm × 18cm × 2.2cm", ar: "38 سم × 18 سم × 2.2 سم" } },
      { key: { en: "Finish", ar: "التشطيب" }, value: { en: "Organic Mineral Wax", ar: "شمع معدني عضوي" } },
    ],
    rating: {
      count: 14,
      average: 4.9,
    },
    soldCount: 38,
    status: "ACTIVE",
    storeSnapshot: {
      slug: "cedar-and-craft",
      name: { en: "Cedar & Craft", ar: "أرز وحِرف" },
      status: "ACTIVE",
    },
    createdAt: "2026-10-15T10:00:00Z",
    updatedAt: "2026-11-01T12:00:00Z",
  },
  {
    id: "prod_cc_tote_002",
    storeId: "store_cedar_craft_001",
    slug: "woven-market-tote",
    sku: "CC-TOTE-002",
    title: {
      en: "Woven Market Tote",
      ar: "حقيبة سوق منسوجة",
    },
    description: {
      en: "A sturdy woven tote crafted from harvested wild palm reeds and full-grain vegetable-tanned leather straps. Sized comfortably for local markets, laptop work, and weekend escapes.",
      ar: "حقيبة منسوجة متينة مصنوعة من سعف النخيل البري وأحزمة من الجلد الطبيعي المدبوغ نباتياً. مناسبة للتسوق والعمل وعطلات نهاية الأسبوع.",
    },
    categoryId: "cat_accessories",
    priceMinor: 3600, // $36.00
    compareAtPriceMinor: null,
    currency: "USD",
    stockOnHand: 4, // low stock!
    lowStockThreshold: 5,
    images: [
      {
        url: "/src/assets/images/product_woven_market_tote_1794265186661.jpg",
        alt: {
          en: "Woven market tote bag with saddle leather straps",
          ar: "حقيبة سوق منسوجة بأحزمة من الجلد الفاخر",
        },
      },
    ],
    attributes: [
      { key: { en: "Material", ar: "المادة" }, value: { en: "Wild Palm & Saddle Leather", ar: "سعف نخيل بري وجلد سروج" } },
      { key: { en: "Capacity", ar: "السعة" }, value: { en: "24 Liters", ar: "24 لتر" } },
      { key: { en: "Origin", ar: "المنشأ" }, value: { en: "Artisan Co-op Workshop", ar: "ورشة تعاونية حرفية" } },
    ],
    rating: {
      count: 9,
      average: 4.8,
    },
    soldCount: 26,
    status: "ACTIVE",
    storeSnapshot: {
      slug: "cedar-and-craft",
      name: { en: "Cedar & Craft", ar: "أرز وحِرف" },
      status: "ACTIVE",
    },
    createdAt: "2026-10-18T14:30:00Z",
    updatedAt: "2026-11-05T09:00:00Z",
  },
  {
    id: "prod_cc_linen_003",
    storeId: "store_cedar_craft_001",
    slug: "linen-table-runner",
    sku: "CC-LINEN-003",
    title: {
      en: "Washed Linen Table Runner",
      ar: "مفرش طاولة من الكتان المغسول",
    },
    description: {
      en: "Soft stone-washed French flax linen that brings quiet, tactile warmth to the table. Gets softer and more characterful with every cycle in the wash.",
      ar: "كتان فرنسي ناعم مغسول بالأحجار يضفي دفئاً هادئاً وملمساً أصيلاً على المائدة. يزداد نعومة وجمالاً مع كل غسلة.",
    },
    categoryId: "cat_home_living",
    priceMinor: 2900, // $29.00
    compareAtPriceMinor: 3500,
    currency: "USD",
    stockOnHand: 27,
    lowStockThreshold: 6,
    images: [
      {
        url: "/src/assets/images/product_washed_linen_runner_1794265188571.jpg",
        alt: {
          en: "Soft washed natural flax linen table runner folded on oak table",
          ar: "مفرش طاولة كتان طبيعي مغسول ومطوي على طاولة خشب بلوط",
        },
      },
    ],
    attributes: [
      { key: { en: "Weave", ar: "النسيج" }, value: { en: "220 GSM 100% Pure Flax", ar: "كتان خالص 220 غرام/م²" } },
      { key: { en: "Length", ar: "الطول" }, value: { en: "180cm × 45cm", ar: "180 سم × 45 سم" } },
      { key: { en: "Care", ar: "العناية" }, value: { en: "Gentle Machine Wash", ar: "غسيل آلي لطيف" } },
    ],
    rating: {
      count: 22,
      average: 4.7,
    },
    soldCount: 54,
    status: "ACTIVE",
    storeSnapshot: {
      slug: "cedar-and-craft",
      name: { en: "Cedar & Craft", ar: "أرز وحِرف" },
      status: "ACTIVE",
    },
    createdAt: "2026-10-20T11:15:00Z",
    updatedAt: "2026-11-04T16:20:00Z",
  },
  {
    id: "prod_cc_brass_004",
    storeId: "store_cedar_craft_001",
    slug: "brass-bookmark",
    sku: "CC-BRASS-004",
    title: {
      en: "Hand-cut Brass Bookmark",
      ar: "علامة كتاب نحاسية يدوية",
    },
    description: {
      en: "A slim hand-cut solid brass bookmark with organic arabesque openwork that develops a unique, rich amber patina as it journeys through your reading collection.",
      ar: "علامة كتاب رفيعة مقصوصة يدوياً من النحاس الأصفر الصلب بنقوش أرابيسك مفرغة تكتسب طابعاً عنبرياً فريداً مع تقليب صفحات كتبك.",
    },
    categoryId: "cat_stationery_paper",
    priceMinor: 1400, // $14.00
    compareAtPriceMinor: null,
    currency: "USD",
    stockOnHand: 42,
    lowStockThreshold: 8,
    images: [
      {
        url: "/src/assets/images/product_brass_bookmark_1794265187734.jpg",
        alt: {
          en: "Artisanal hand-cut solid brass bookmark on open hardcover book",
          ar: "علامة كتاب نحاسية يدوية على كتاب مفتوح بتجليد قماشي",
        },
      },
    ],
    attributes: [
      { key: { en: "Metal", ar: "المعدن" }, value: { en: "Solid Brass (Unlacquered)", ar: "نحاس أصفر صلب غير مطلي" } },
      { key: { en: "Thickness", ar: "السماكة" }, value: { en: "0.8mm Precision Cut", ar: "0.8 مم قطع دقيق" } },
      { key: { en: "Weight", ar: "الوزن" }, value: { en: "18 grams", ar: "18 غرام" } },
    ],
    rating: {
      count: 31,
      average: 5.0,
    },
    soldCount: 79,
    status: "ACTIVE",
    storeSnapshot: {
      slug: "cedar-and-craft",
      name: { en: "Cedar & Craft", ar: "أرز وحِرف" },
      status: "ACTIVE",
    },
    createdAt: "2026-10-22T08:00:00Z",
    updatedAt: "2026-11-07T18:40:00Z",
  },
];

export const demoUsers: User[] = [
  {
    id: "usr_cust_001",
    name: "Demo Customer",
    email: "customer@example.com",
    role: "CUSTOMER",
    status: "ACTIVE",
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "usr_seller_001",
    name: "Demo Seller",
    email: "seller@example.com",
    role: "SELLER",
    status: "ACTIVE",
    createdAt: "2026-10-01T00:00:00Z",
  },
  {
    id: "usr_admin_001",
    name: "Demo Administrator",
    email: "admin@example.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-10-01T00:00:00Z",
  },
];

export const initialOrders: Order[] = [
  {
    id: "ord_demo_001",
    orderNumber: "ORD-DEMO-0001",
    checkoutGroupId: "chk_demo_001",
    customerId: "usr_cust_001",
    storeId: "store_cedar_craft_001",
    customerSnapshot: {
      displayName: "Demo Customer",
      phone: "+1 (555) 382-9901",
      email: "customer@example.com",
    },
    storeSnapshot: {
      name: { en: "Cedar & Craft", ar: "أرز وحِرف" },
      slug: "cedar-and-craft",
    },
    shippingAddressSnapshot: {
      fullName: "Demo Customer",
      phone: "+1 (555) 382-9901",
      line1: "742 Evergreen Terrace",
      city: "Portland",
      region: "Oregon",
      postalCode: "97201",
      countryCode: "US",
    },
    items: [
      {
        id: "line_001",
        productId: "prod_cc_board_001",
        sku: "CC-BOARD-001",
        title: { en: "Olive Wood Serving Board", ar: "لوح تقديم من خشب الزيتون" },
        imageUrl: "/src/assets/images/product_olive_wood_board_1794265186415.jpg",
        unitPriceMinor: 4800,
        quantity: 1,
        lineTotalMinor: 4800,
      },
    ],
    totals: {
      subtotalMinor: 4800,
      shippingMinor: 0,
      taxMinor: 0,
      discountMinor: 0,
      totalMinor: 4800,
    },
    currency: "USD",
    payment: {
      method: "VIRTUAL",
      status: "PAID",
      reference: "VIRTUAL-DEMO-0001",
      paidAt: "2026-11-04T12:00:00Z",
    },
    status: "DELIVERED",
    statusHistory: [
      {
        status: "PLACED",
        actorId: "usr_cust_001",
        actorRole: "CUSTOMER",
        at: "2026-11-04T12:00:00Z",
      },
      {
        status: "PROCESSING",
        actorId: "usr_seller_001",
        actorRole: "SELLER",
        at: "2026-11-04T15:30:00Z",
      },
      {
        status: "SHIPPED",
        actorId: "usr_seller_001",
        actorRole: "SELLER",
        at: "2026-11-05T09:00:00Z",
      },
      {
        status: "DELIVERED",
        actorId: "usr_seller_001",
        actorRole: "SELLER",
        at: "2026-11-06T14:15:00Z",
      },
    ],
    createdAt: "2026-11-04T12:00:00Z",
    updatedAt: "2026-11-06T14:15:00Z",
  },
];

export const initialReviews: Review[] = [
  {
    id: "rev_001",
    productId: "prod_cc_board_001",
    storeId: "store_cedar_craft_001",
    customerId: "usr_cust_001",
    customerName: "Demo Customer",
    orderId: "ord_demo_001",
    rating: 5,
    title: "Beautifully made & heirloom quality",
    body: "The finish and wood grain are outstanding. It arrived in plastic-free packaging and smells wonderfully of natural olive wood oil.",
    language: "en",
    status: "PUBLISHED",
    createdAt: "2026-11-07T08:30:00Z",
  },
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: "log_001",
    actorId: "usr_admin_001",
    actorName: "Demo Administrator",
    action: "DEMO_DATA_SEEDED",
    entityType: "STORE",
    entityId: "store_cedar_craft_001",
    metadata: { productCount: 4, storeSlug: "cedar-and-craft" },
    createdAt: "2026-11-08T09:00:00Z",
  },
];
