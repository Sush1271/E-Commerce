export const locales = ["en", "ar"] as const;
export type Locale = (typeof locales)[number];

export type LocalizedText = {
  en: string;
  ar: string;
};

export type Role = "ADMIN" | "SELLER" | "CUSTOMER";
export type UserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING_VERIFICATION";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  mustChangePassword?: boolean;
  createdAt: string;
};

export type Store = {
  id: string;
  ownerUserId: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  status: "ACTIVE" | "SUSPENDED" | "PENDING";
  currency: string;
};

export type Category = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  sortOrder: number;
};

export type MediaRef = {
  url: string;
  publicId?: string;
  alt: LocalizedText;
  width?: number;
  height?: number;
};

export type ProductStatus = "ACTIVE" | "DRAFT" | "ARCHIVED" | "SUSPENDED";

export type Product = {
  id: string;
  storeId: string;
  slug: string;
  sku: string;
  title: LocalizedText;
  description: LocalizedText;
  categoryId: string;
  priceMinor: number; // e.g. 4800 = $48.00
  compareAtPriceMinor?: number | null;
  currency: string;
  stockOnHand: number;
  lowStockThreshold: number;
  images: MediaRef[];
  attributes?: Array<{ key: LocalizedText; value: LocalizedText }>;
  rating: {
    count: number;
    average: number;
  };
  soldCount: number;
  status: ProductStatus;
  storeSnapshot: {
    slug: string;
    name: LocalizedText;
    status: "ACTIVE" | "SUSPENDED" | "PENDING";
  };
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  slug: string;
  title: LocalizedText;
  imageUrl: string;
  priceMinor: number;
  currency: string;
  storeId: string;
  storeName: LocalizedText;
  quantity: number;
  stockSnapshot: number;
};

export type ShippingAddress = {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  region?: string;
  postalCode?: string;
  countryCode: string;
};

export type OrderStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type OrderLine = {
  id: string;
  productId: string;
  sku: string;
  title: LocalizedText;
  imageUrl: string;
  unitPriceMinor: number;
  quantity: number;
  lineTotalMinor: number;
};

export type Order = {
  id: string;
  orderNumber: string;
  checkoutGroupId: string;
  customerId: string;
  storeId: string;
  customerSnapshot: {
    displayName: string;
    phone: string;
    email: string;
  };
  storeSnapshot: {
    name: LocalizedText;
    slug: string;
  };
  shippingAddressSnapshot: ShippingAddress;
  items: OrderLine[];
  totals: {
    subtotalMinor: number;
    shippingMinor: number;
    taxMinor: number;
    discountMinor: number;
    totalMinor: number;
  };
  currency: string;
  payment: {
    method: "VIRTUAL";
    status: "PAID" | "REFUNDED";
    reference: string;
    paidAt: string;
  };
  status: OrderStatus;
  statusHistory: Array<{
    status: OrderStatus;
    actorId: string;
    actorRole: "CUSTOMER" | "SELLER" | "ADMIN" | "SYSTEM";
    at: string;
    reason?: string;
  }>;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  productId: string;
  storeId: string;
  customerId: string;
  customerName: string;
  orderId: string;
  rating: number;
  title: string;
  body: string;
  language: Locale;
  status: "PUBLISHED" | "HIDDEN";
  createdAt: string;
};

export type AuditLog = {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: "STORE" | "PRODUCT" | "ORDER" | "USER" | "CHECKOUT";
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type CatalogSort = "newest" | "price_asc" | "price_desc" | "rating";
