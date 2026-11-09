import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const {
    locale,
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    setIsCheckoutOpen,
    setActiveTab,
  } = useMarketplaceStore();

  if (!isCartOpen) return null;

  const t = translations[locale];
  const subtotalMinor = cart.reduce((acc, item) => acc + item.priceMinor * item.quantity, 0);
  const freeShippingThresholdMinor = 5000; // $50
  const remainingForFreeShippingMinor = Math.max(0, freeShippingThresholdMinor - subtotalMinor);
  const isFreeShipping = remainingForFreeShippingMinor === 0;

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 end-0 flex max-w-full ps-10">
        <div className="w-screen max-w-md bg-card border-s border-border shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="size-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">{t.cart.title}</h2>
              <span className="text-xs text-muted-foreground font-semibold">
                ({cart.reduce((a, b) => a + b.quantity, 0)})
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          {cart.length > 0 && (
            <div className="px-6 py-3 bg-secondary/40 border-b border-border/70 text-xs">
              <div className="flex items-center justify-between mb-1.5 font-medium">
                {isFreeShipping ? (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                    {t.cart.freeShippingEarned}
                  </span>
                ) : (
                  <span className="text-muted-foreground">
                    {t.cart.freeShippingNotice.replace(
                      "{amount}",
                      formatMoney(remainingForFreeShippingMinor, "USD", locale)
                    )}
                  </span>
                )}
                <span className="font-mono text-muted-foreground">
                  {Math.min(100, Math.round((subtotalMinor / freeShippingThresholdMinor) * 100))}%
                </span>
              </div>
              <div className="w-full bg-border rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (subtotalMinor / freeShippingThresholdMinor) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Body: Items or Empty */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="size-16 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground">
                  <ShoppingBag className="size-8 stroke-1" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">{t.cart.emptyTitle}</h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-[240px]">
                    {t.cart.emptyDesc}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsCartOpen(false);
                    setActiveTab("shop");
                  }}
                >
                  {t.cart.startShopping}
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {cart.map((item) => (
                  <div key={item.productId} className="py-4 flex gap-4">
                    {/* Item Thumbnail */}
                    <div className="size-16 rounded-lg bg-muted/40 border border-border overflow-hidden shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={localize(item.title, locale)}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {localize(item.title, locale)}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-muted-foreground hover:text-destructive transition-colors p-0.5 cursor-pointer"
                            title={t.cart.remove}
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {localize(item.storeName, locale)}
                        </p>
                      </div>

                      {/* Quantity & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center rounded-md border border-border bg-background">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity - 1)
                            }
                            className="px-2 py-0.5 text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-medium text-foreground min-w-[1.75rem] text-center tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.productId, item.quantity + 1)
                            }
                            className="px-2 py-0.5 text-xs font-semibold hover:bg-muted text-foreground transition-colors cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="text-sm font-bold text-foreground tabular-nums">
                          {formatMoney(item.priceMinor * item.quantity, item.currency, locale)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="px-6 py-4 border-t border-border bg-card space-y-4">
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t.cart.subtotal}</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {formatMoney(subtotalMinor, "USD", locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t.cart.shipping}</span>
                  <span className="text-foreground font-semibold">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 dark:text-emerald-400">
                        {t.cart.freeShipping}
                      </span>
                    ) : (
                      formatMoney(700, "USD", locale)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                  <span>{t.cart.total}</span>
                  <span className="tabular-nums">
                    {formatMoney(
                      subtotalMinor + (isFreeShipping ? 0 : 700),
                      "USD",
                      locale
                    )}
                  </span>
                </div>
              </div>

              {/* Simulated Notice */}
              <div className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 border border-border/50 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-4 text-primary shrink-0" />
                <span>{t.cart.simulatedNotice}</span>
              </div>

              <Button
                onClick={handleProceedToCheckout}
                size="lg"
                className="w-full flex items-center justify-center gap-2 text-sm"
              >
                <span>{t.cart.proceedCheckout}</span>
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
