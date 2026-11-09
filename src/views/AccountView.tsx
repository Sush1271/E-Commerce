import { useState } from "react";
import { Package, Heart, User, CheckCircle2, Clock, Truck, AlertCircle, ShoppingBag, X } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { OrderStatus } from "@/types";

export function AccountView() {
  const {
    locale,
    currentUser,
    orders,
    cancelOrder,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setActiveTab,
    setSelectedProductSlug,
  } = useMarketplaceStore();

  const [activeSubTab, setActiveSubTab] = useState<"orders" | "wishlist" | "profile">("orders");
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const t = translations[locale];
  const userOrders = orders.filter((o) => o.customerId === currentUser?.id);
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCancelOrder = (orderId: string) => {
    setCancellingId(orderId);
    setTimeout(() => {
      cancelOrder(orderId, "Customer requested order cancellation");
      setCancellingId(null);
    }, 400);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
            <CheckCircle2 className="size-3" />
            <span>Delivered</span>
          </span>
        );
      case "SHIPPED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300">
            <Truck className="size-3" />
            <span>Shipped</span>
          </span>
        );
      case "PROCESSING":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
            <Clock className="size-3" />
            <span>Processing</span>
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-destructive/10 text-destructive border border-destructive/20">
            <AlertCircle className="size-3" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">
            <Clock className="size-3" />
            <span>Placed</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Overview Header */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="size-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl border border-primary/20">
            {currentUser?.name[0] || "U"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {t.account.welcomeBack.replace("{name}", currentUser?.name || "Customer")}
            </h1>
            <p className="text-xs text-muted-foreground">{currentUser?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Role:</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground uppercase">
            {currentUser?.role || "CUSTOMER"}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border text-sm font-medium">
        <button
          onClick={() => setActiveSubTab("orders")}
          className={`flex items-center gap-2 pb-3 transition-colors cursor-pointer ${
            activeSubTab === "orders"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Package className="size-4" />
          <span>{t.account.myOrders}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary font-mono">
            {userOrders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("wishlist")}
          className={`flex items-center gap-2 pb-3 transition-colors cursor-pointer ${
            activeSubTab === "wishlist"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Heart className="size-4" />
          <span>{t.account.myWishlist}</span>
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary font-mono">
            {wishlistedProducts.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab("profile")}
          className={`flex items-center gap-2 pb-3 transition-colors cursor-pointer ${
            activeSubTab === "profile"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="size-4" />
          <span>{t.account.profileSettings}</span>
        </button>
      </div>

      {/* Tab: Orders */}
      {activeSubTab === "orders" && (
        <div className="space-y-6">
          {userOrders.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-border bg-card/40 space-y-3">
              <Package className="size-12 text-muted-foreground mx-auto stroke-1" />
              <h3 className="text-base font-bold text-foreground">{t.account.noOrders}</h3>
              <Button size="sm" onClick={() => setActiveTab("shop")}>
                Explore Shop
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {userOrders.map((order) => {
                const canCancel = order.status === "PLACED";
                return (
                  <div
                    key={order.id}
                    className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-5"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-foreground text-sm">
                            {order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {t.account.orderPlaced}:{" "}
                          <span className="text-foreground">
                            {new Date(order.createdAt).toLocaleDateString(
                              locale === "ar" ? "ar-SA" : "en-US",
                              { year: "numeric", month: "short", day: "numeric" }
                            )}
                          </span>{" "}
                          · Ref: <span className="font-mono">{order.payment.reference}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {formatMoney(order.totals.totalMinor, order.currency, locale)}
                        </span>
                        {canCancel && (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancellingId === order.id}
                            onClick={() => handleCancelOrder(order.id)}
                            className="text-xs"
                          >
                            {cancellingId === order.id ? "Cancelling..." : t.account.cancelOrder}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Progress Tracking Timeline */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"].map((st, idx) => {
                          const isCompleted = order.statusHistory.some((h) => h.status === st);
                          const isCurrent = order.status === st;

                          return (
                            <div key={st} className="space-y-1.5">
                              <div
                                className={`h-1.5 rounded-full transition-colors ${
                                  order.status === "CANCELLED"
                                    ? "bg-muted"
                                    : isCompleted
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                              <span
                                className={`text-[11px] block truncate font-medium ${
                                  isCurrent
                                    ? "text-primary font-bold"
                                    : isCompleted
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {idx === 0
                                  ? "1. Placed"
                                  : idx === 1
                                  ? "2. Processing"
                                  : idx === 2
                                  ? "3. Shipped"
                                  : "4. Delivered"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Itemized Lines */}
                    <div className="space-y-3 pt-2">
                      {order.items.map((line) => (
                        <div
                          key={line.id}
                          className="flex items-center justify-between gap-4 p-2.5 rounded-lg bg-secondary/30 text-xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {line.imageUrl && (
                              <img
                                src={line.imageUrl}
                                alt={localize(line.title, locale)}
                                className="size-10 rounded-md object-cover border border-border shrink-0"
                              />
                            )}
                            <div className="truncate">
                              <p className="font-semibold text-foreground truncate">
                                {localize(line.title, locale)}
                              </p>
                              <p className="text-muted-foreground text-[11px]">
                                Qty: {line.quantity} · SKU: {line.sku}
                              </p>
                            </div>
                          </div>

                          <div className="text-end shrink-0">
                            <span className="font-bold text-foreground tabular-nums">
                              {formatMoney(line.lineTotalMinor, order.currency, locale)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Destination */}
                    <div className="text-xs text-muted-foreground pt-1 flex items-center justify-between">
                      <span>
                        Ships to:{" "}
                        <span className="text-foreground font-medium">
                          {order.shippingAddressSnapshot.fullName} ({order.shippingAddressSnapshot.line1}, {order.shippingAddressSnapshot.city})
                        </span>
                      </span>
                      <span className="text-[11px]">
                        Seller: {localize(order.storeSnapshot.name, locale)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab: Wishlist */}
      {activeSubTab === "wishlist" && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-border bg-card/40 space-y-3">
              <Heart className="size-12 text-muted-foreground mx-auto stroke-1" />
              <h3 className="text-base font-bold text-foreground">{t.account.noWishlist}</h3>
              <Button size="sm" onClick={() => setActiveTab("shop")}>
                Explore Shop
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col justify-between space-y-4 shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted/40 relative">
                      <img
                        src={p.images[0]?.url}
                        alt={localize(p.title, locale)}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="absolute top-2 end-2 p-1.5 rounded-full bg-background/80 hover:bg-background text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                        title="Remove"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    <div>
                      <h4
                        onClick={() => setSelectedProductSlug(p.slug)}
                        className="font-bold text-sm text-foreground hover:text-primary transition-colors cursor-pointer truncate"
                      >
                        {localize(p.title, locale)}
                      </h4>
                      <p className="text-xs font-bold text-foreground tabular-nums mt-0.5">
                        {formatMoney(p.priceMinor, p.currency, locale)}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => {
                      addToCart(p, 1);
                      toggleWishlist(p.id);
                    }}
                    className="w-full text-xs flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="size-3.5" />
                    <span>{t.account.moveToCart}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Profile & Settings */}
      {activeSubTab === "profile" && (
        <div className="max-w-2xl p-6 rounded-2xl border border-border bg-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-foreground">
              Profile & Shipping Defaults
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              These details prefill checkout and are stored securely on this device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1">Full Name</label>
              <input
                type="text"
                defaultValue={currentUser?.name || "Demo Customer"}
                disabled
                className="w-full h-8 px-3 rounded-md border border-input bg-muted/50 text-foreground"
              />
            </div>

            <div>
              <label className="text-muted-foreground block mb-1">Email Address</label>
              <input
                type="email"
                defaultValue={currentUser?.email || "customer@example.com"}
                disabled
                className="w-full h-8 px-3 rounded-md border border-input bg-muted/50 text-foreground"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-muted-foreground block mb-1">Saved Street Address</label>
              <input
                type="text"
                defaultValue="742 Evergreen Terrace, Portland, OR 97201"
                disabled
                className="w-full h-8 px-3 rounded-md border border-input bg-muted/50 text-foreground"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
