import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AuditLog,
  CartItem,
  Category,
  Locale,
  Order,
  OrderLine,
  OrderStatus,
  Product,
  Review,
  Role,
  ShippingAddress,
  Store,
  User,
} from "@/types";
import {
  demoUsers,
  initialAuditLogs,
  initialCategories,
  initialOrders,
  initialProducts,
  initialReviews,
  initialStore,
} from "./seed-data";

export type NavTab = "home" | "shop" | "categories" | "story" | "account" | "seller" | "admin";

interface MarketplaceState {
  // Localization & Theme
  locale: Locale;
  setLocale: (locale: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;

  // Active navigation & view state
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;

  // Modal / Drawer state
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  completedOrder: Order | null;
  setCompletedOrder: (order: Order | null) => void;

  // Auth & Session
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  switchPersona: (role: Role) => void;

  // Entities
  store: Store;
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  orders: Order[];
  reviews: Review[];
  users: User[];
  auditLogs: AuditLog[];

  // Cart actions
  addToCart: (product: Product, quantity?: number) => boolean;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Order actions
  placeVirtualOrder: (params: {
    shippingAddress: ShippingAddress;
    customerNotes?: string;
  }) => { success: boolean; order?: Order; error?: string };
  cancelOrder: (orderId: string, reason?: string) => boolean;
  updateOrderStatus: (orderId: string, status: OrderStatus) => boolean;

  // Product actions (Seller)
  addProduct: (product: Omit<Product, "id" | "createdAt" | "updatedAt" | "soldCount" | "rating" | "storeSnapshot" | "storeId">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Review actions (Customer)
  addReview: (params: {
    productId: string;
    orderId: string;
    rating: number;
    title: string;
    body: string;
  }) => boolean;

  // Admin actions
  toggleUserStatus: (userId: string) => void;
  updateUserRole: (userId: string, role: Role) => void;
  toggleProductStatus: (productId: string) => void;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
        set({ locale });
      },
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        set({ theme: next });
      },

      activeTab: "home",
      setActiveTab: (activeTab) => {
        set({ activeTab });
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
      selectedProductSlug: null,
      setSelectedProductSlug: (selectedProductSlug) => {
        set({ selectedProductSlug });
        if (selectedProductSlug) {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      },
      searchQuery: "",
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      selectedCategorySlug: null,
      setSelectedCategorySlug: (selectedCategorySlug) => set({ selectedCategorySlug }),

      isCartOpen: false,
      setIsCartOpen: (isCartOpen) => set({ isCartOpen }),
      isCheckoutOpen: false,
      setIsCheckoutOpen: (isCheckoutOpen) => set({ isCheckoutOpen }),
      isAuthModalOpen: false,
      setIsAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),
      completedOrder: null,
      setCompletedOrder: (completedOrder) => set({ completedOrder }),

      currentUser: demoUsers[0], // Default: Demo Customer
      setCurrentUser: (currentUser) => set({ currentUser }),
      switchPersona: (role) => {
        const found = get().users.find((u) => u.role === role) || demoUsers.find((u) => u.role === role);
        if (found) {
          set({ currentUser: found });
          if (role === "SELLER") set({ activeTab: "seller" });
          else if (role === "ADMIN") set({ activeTab: "admin" });
          else set({ activeTab: "home" });
        }
      },

      store: initialStore,
      categories: initialCategories,
      products: initialProducts,
      cart: [],
      wishlist: [],
      orders: initialOrders,
      reviews: initialReviews,
      users: demoUsers,
      auditLogs: initialAuditLogs,

      addToCart: (product, quantity = 1) => {
        if (product.stockOnHand <= 0) return false;
        const currentCart = get().cart;
        const existing = currentCart.find((item) => item.productId === product.id);
        const currentQty = existing ? existing.quantity : 0;
        const newQty = Math.min(currentQty + quantity, product.stockOnHand);

        if (existing) {
          set({
            cart: currentCart.map((item) =>
              item.productId === product.id ? { ...item, quantity: newQty } : item
            ),
          });
        } else {
          const newItem: CartItem = {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            imageUrl: product.images[0]?.url || "",
            priceMinor: product.priceMinor,
            currency: product.currency,
            storeId: product.storeId,
            storeName: product.storeSnapshot.name,
            quantity: Math.min(quantity, product.stockOnHand),
            stockSnapshot: product.stockOnHand,
          };
          set({ cart: [...currentCart, newItem] });
        }
        return true;
      },

      updateCartQuantity: (productId, quantity) => {
        const currentCart = get().cart;
        const product = get().products.find((p) => p.id === productId);
        const maxStock = product ? product.stockOnHand : 99;

        if (quantity <= 0) {
          set({ cart: currentCart.filter((item) => item.productId !== productId) });
        } else {
          const safeQty = Math.min(quantity, maxStock);
          set({
            cart: currentCart.map((item) =>
              item.productId === productId ? { ...item, quantity: safeQty } : item
            ),
          });
        }
      },

      removeFromCart: (productId) => {
        set({ cart: get().cart.filter((item) => item.productId !== productId) });
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },

      isWishlisted: (productId) => get().wishlist.includes(productId),

      placeVirtualOrder: ({ shippingAddress }) => {
        const state = get();
        const cartItems = state.cart;
        if (cartItems.length === 0) return { success: false, error: "Cart is empty" };

        // Verify stock for all items
        for (const item of cartItems) {
          const prod = state.products.find((p) => p.id === item.productId);
          if (!prod || prod.stockOnHand < item.quantity) {
            return {
              success: false,
              error: `Insufficient stock for ${item.title.en}. Only ${prod?.stockOnHand || 0} remaining.`,
            };
          }
        }

        const now = new Date().toISOString();
        const randId = Math.floor(1000 + Math.random() * 9000);
        const orderNumber = `ORD-2026-${randId}`;
        const checkoutGroupId = `CHK-2026-${randId}`;
        const refNumber = `VIRTUAL-${randId}`;

        const subtotalMinor = cartItems.reduce(
          (acc, item) => acc + item.priceMinor * item.quantity,
          0
        );
        const shippingMinor = subtotalMinor >= 5000 ? 0 : 700; // Free over $50
        const totalMinor = subtotalMinor + shippingMinor;

        const customer = state.currentUser || demoUsers[0];

        const newOrder: Order = {
          id: `ord_${Date.now()}`,
          orderNumber,
          checkoutGroupId,
          customerId: customer.id,
          storeId: state.store.id,
          customerSnapshot: {
            displayName: customer.name,
            phone: shippingAddress.phone,
            email: customer.email,
          },
          storeSnapshot: {
            name: state.store.name,
            slug: state.store.slug,
          },
          shippingAddressSnapshot: shippingAddress,
          items: cartItems.map((item, index) => ({
            id: `line_${Date.now()}_${index}`,
            productId: item.productId,
            sku: state.products.find((p) => p.id === item.productId)?.sku || "CC-ITEM",
            title: item.title,
            imageUrl: item.imageUrl,
            unitPriceMinor: item.priceMinor,
            quantity: item.quantity,
            lineTotalMinor: item.priceMinor * item.quantity,
          })),
          totals: {
            subtotalMinor,
            shippingMinor,
            taxMinor: 0,
            discountMinor: 0,
            totalMinor,
          },
          currency: "USD",
          payment: {
            method: "VIRTUAL",
            status: "PAID",
            reference: refNumber,
            paidAt: now,
          },
          status: "PLACED",
          statusHistory: [
            {
              status: "PLACED",
              actorId: customer.id,
              actorRole: "CUSTOMER",
              at: now,
            },
          ],
          createdAt: now,
          updatedAt: now,
        };

        // Atomically deduct inventory
        const updatedProducts = state.products.map((p) => {
          const cartItem = cartItems.find((c) => c.productId === p.id);
          if (cartItem) {
            return {
              ...p,
              stockOnHand: Math.max(0, p.stockOnHand - cartItem.quantity),
              soldCount: p.soldCount + cartItem.quantity,
              updatedAt: now,
            };
          }
          return p;
        });

        // Add audit log
        const newLog: AuditLog = {
          id: `log_${Date.now()}`,
          actorId: customer.id,
          actorName: customer.name,
          action: "VIRTUAL_ORDER_PLACED",
          entityType: "ORDER",
          entityId: newOrder.id,
          metadata: {
            orderNumber,
            totalMinor,
            itemCount: cartItems.length,
          },
          createdAt: now,
        };

        set({
          orders: [newOrder, ...state.orders],
          products: updatedProducts,
          cart: [],
          completedOrder: newOrder,
          auditLogs: [newLog, ...state.auditLogs],
        });

        return { success: true, order: newOrder };
      },

      cancelOrder: (orderId, reason = "Customer requested cancellation") => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        if (!order || order.status !== "PLACED") return false;

        const now = new Date().toISOString();
        const actor = state.currentUser || demoUsers[0];

        // Restore stock
        const updatedProducts = state.products.map((p) => {
          const item = order.items.find((i: OrderLine) => i.productId === p.id);
          if (item) {
            return {
              ...p,
              stockOnHand: p.stockOnHand + item.quantity,
              soldCount: Math.max(0, p.soldCount - item.quantity),
              updatedAt: now,
            };
          }
          return p;
        });

        const updatedOrders = state.orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status: "CANCELLED" as OrderStatus,
              statusHistory: [
                ...o.statusHistory,
                {
                  status: "CANCELLED" as OrderStatus,
                  actorId: actor.id,
                  actorRole: actor.role,
                  at: now,
                  reason,
                },
              ],
              updatedAt: now,
            };
          }
          return o;
        });

        const newLog: AuditLog = {
          id: `log_${Date.now()}`,
          actorId: actor.id,
          actorName: actor.name,
          action: "ORDER_CANCELLED",
          entityType: "ORDER",
          entityId: order.id,
          metadata: { orderNumber: order.orderNumber, reason },
          createdAt: now,
        };

        set({
          orders: updatedOrders,
          products: updatedProducts,
          auditLogs: [newLog, ...state.auditLogs],
        });
        return true;
      },

      updateOrderStatus: (orderId, status) => {
        const state = get();
        const actor = state.currentUser || demoUsers[1];
        const now = new Date().toISOString();

        const updatedOrders = state.orders.map((o) => {
          if (o.id === orderId) {
            return {
              ...o,
              status,
              statusHistory: [
                ...o.statusHistory,
                {
                  status,
                  actorId: actor.id,
                  actorRole: actor.role,
                  at: now,
                },
              ],
              updatedAt: now,
            };
          }
          return o;
        });

        const newLog: AuditLog = {
          id: `log_${Date.now()}`,
          actorId: actor.id,
          actorName: actor.name,
          action: "ORDER_STATUS_CHANGED",
          entityType: "ORDER",
          entityId: orderId,
          metadata: { newStatus: status },
          createdAt: now,
        };

        set({
          orders: updatedOrders,
          auditLogs: [newLog, ...state.auditLogs],
        });
        return true;
      },

      addProduct: (newProductData) => {
        const state = get();
        const now = new Date().toISOString();
        const newProduct: Product = {
          ...newProductData,
          id: `prod_${Date.now()}`,
          storeId: state.store.id,
          soldCount: 0,
          rating: { count: 0, average: 5.0 },
          storeSnapshot: {
            slug: state.store.slug,
            name: state.store.name,
            status: "ACTIVE",
          },
          createdAt: now,
          updatedAt: now,
        };

        const actor = state.currentUser || demoUsers[1];
        const newLog: AuditLog = {
          id: `log_${Date.now()}`,
          actorId: actor.id,
          actorName: actor.name,
          action: "PRODUCT_CREATED",
          entityType: "PRODUCT",
          entityId: newProduct.id,
          metadata: { title: newProduct.title.en, sku: newProduct.sku },
          createdAt: now,
        };

        set({
          products: [newProduct, ...state.products],
          auditLogs: [newLog, ...state.auditLogs],
        });
      },

      updateProduct: (id, updates) => {
        const state = get();
        const now = new Date().toISOString();
        const actor = state.currentUser || demoUsers[1];

        set({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: now } : p
          ),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: actor.id,
              actorName: actor.name,
              action: "PRODUCT_UPDATED",
              entityType: "PRODUCT",
              entityId: id,
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
      },

      deleteProduct: (id) => {
        const state = get();
        const actor = state.currentUser || demoUsers[1];
        const now = new Date().toISOString();

        set({
          products: state.products.filter((p) => p.id !== id),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: actor.id,
              actorName: actor.name,
              action: "PRODUCT_DELETED",
              entityType: "PRODUCT",
              entityId: id,
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
      },

      addReview: ({ productId, orderId, rating, title, body }) => {
        const state = get();
        const customer = state.currentUser || demoUsers[0];
        const now = new Date().toISOString();

        const newReview: Review = {
          id: `rev_${Date.now()}`,
          productId,
          storeId: state.store.id,
          customerId: customer.id,
          customerName: customer.name,
          orderId,
          rating,
          title,
          body,
          language: state.locale,
          status: "PUBLISHED",
          createdAt: now,
        };

        // Recalculate average rating for product
        const productReviews = [...state.reviews.filter((r) => r.productId === productId), newReview];
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const avgRating = Number((totalRating / productReviews.length).toFixed(1));

        const updatedProducts = state.products.map((p) => {
          if (p.id === productId) {
            return {
              ...p,
              rating: {
                count: productReviews.length,
                average: avgRating,
              },
              updatedAt: now,
            };
          }
          return p;
        });

        set({
          reviews: [newReview, ...state.reviews],
          products: updatedProducts,
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: customer.id,
              actorName: customer.name,
              action: "REVIEW_PUBLISHED",
              entityType: "PRODUCT",
              entityId: productId,
              metadata: { rating, title },
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
        return true;
      },

      toggleUserStatus: (userId) => {
        const state = get();
        const actor = state.currentUser || demoUsers[2];
        const now = new Date().toISOString();

        set({
          users: state.users.map((u) => {
            if (u.id === userId) {
              const nextStatus = u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
              return { ...u, status: nextStatus };
            }
            return u;
          }),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: actor.id,
              actorName: actor.name,
              action: "USER_STATUS_TOGGLED",
              entityType: "USER",
              entityId: userId,
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
      },

      updateUserRole: (userId, role) => {
        const state = get();
        const actor = state.currentUser || demoUsers[2];
        const now = new Date().toISOString();

        set({
          users: state.users.map((u) => (u.id === userId ? { ...u, role } : u)),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: actor.id,
              actorName: actor.name,
              action: "USER_ROLE_UPDATED",
              entityType: "USER",
              entityId: userId,
              metadata: { newRole: role },
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
      },

      toggleProductStatus: (productId) => {
        const state = get();
        const actor = state.currentUser || demoUsers[2];
        const now = new Date().toISOString();

        set({
          products: state.products.map((p) => {
            if (p.id === productId) {
              const nextStatus = p.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE";
              return { ...p, status: nextStatus, updatedAt: now };
            }
            return p;
          }),
          auditLogs: [
            {
              id: `log_${Date.now()}`,
              actorId: actor.id,
              actorName: actor.name,
              action: "PRODUCT_VISIBILITY_TOGGLED",
              entityType: "PRODUCT",
              entityId: productId,
              createdAt: now,
            },
            ...state.auditLogs,
          ],
        });
      },
    }),
    {
      name: "marketplace_app_storage_v1",
      partialize: (state) => ({
        locale: state.locale,
        theme: state.theme,
        products: state.products,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        reviews: state.reviews,
        users: state.users,
        auditLogs: state.auditLogs,
      }),
    }
  )
);
