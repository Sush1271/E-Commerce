import { useState } from "react";
import { CheckCircle2, ArrowRight, ShieldCheck, MapPin, CreditCard, ShoppingBag, X } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { ShippingAddress } from "@/types";

export function CheckoutModal() {
  const {
    locale,
    cart,
    isCheckoutOpen,
    setIsCheckoutOpen,
    placeVirtualOrder,
    currentUser,
    completedOrder,
    setCompletedOrder,
    setActiveTab,
  } = useMarketplaceStore();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: currentUser?.name || "Demo Customer",
    phone: "+1 (555) 382-9901",
    line1: "742 Evergreen Terrace",
    line2: "Apt 4B",
    city: "Portland",
    region: "Oregon",
    postalCode: "97201",
    countryCode: "US",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCheckoutOpen && !completedOrder) return null;

  const t = translations[locale];
  const subtotalMinor = cart.reduce((acc, item) => acc + item.priceMinor * item.quantity, 0);
  const isFreeShipping = subtotalMinor >= 5000;
  const shippingMinor = isFreeShipping ? 0 : 700;
  const totalMinor = subtotalMinor + shippingMinor;

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    setTimeout(() => {
      const res = placeVirtualOrder({
        shippingAddress: address,
      });

      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || "Could not complete virtual order. Please try again.");
      }
    }, 600);
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-auto">
        <button
          onClick={handleClose}
          className="absolute top-4 end-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="size-5" />
        </button>

        {completedOrder ? (
          /* Success Screen */
          <div className="py-6 text-center space-y-6">
            <div className="size-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="size-10" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t.checkout.orderSuccessTitle}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.checkout.orderSuccessSubtitle}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="p-5 rounded-xl border border-border bg-secondary/30 text-start space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <span className="text-muted-foreground">{t.checkout.orderNumber}</span>
                <span className="font-mono font-bold text-foreground text-sm">
                  {completedOrder.orderNumber}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t.checkout.trackingRef}</span>
                <span className="font-mono text-foreground font-semibold">
                  {completedOrder.payment.reference}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Seller / Store</span>
                <span className="font-medium text-foreground">
                  {localize(completedOrder.storeSnapshot.name, locale)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Items ({completedOrder.items.length})</span>
                <span className="font-medium text-foreground">
                  {completedOrder.items.map((i) => `${localize(i.title, locale)} (x${i.quantity})`).join(", ")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery Address</span>
                <span className="font-medium text-foreground text-end">
                  {completedOrder.shippingAddressSnapshot.line1}, {completedOrder.shippingAddressSnapshot.city}
                </span>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border font-bold text-foreground text-sm">
                <span>Total Paid (Virtual)</span>
                <span className="tabular-nums">
                  {formatMoney(completedOrder.totals.totalMinor, completedOrder.currency, locale)}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  handleClose();
                  setActiveTab("shop");
                }}
              >
                {t.checkout.continueShopping}
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  handleClose();
                  setActiveTab("account");
                }}
              >
                {t.checkout.viewInAccount}
              </Button>
            </div>
          </div>
        ) : (
          /* Active Checkout Form */
          <form onSubmit={handleConfirmOrder} className="space-y-6">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Simulated Checkout Flow
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t.checkout.title}
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">{t.checkout.subtitle}</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs">
                {errorMsg}
              </div>
            )}

            {/* Step 1: Delivery Address */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <MapPin className="size-4 text-primary" />
                <span>{t.checkout.stepAddress}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t.checkout.fullName}
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    required
                    className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t.checkout.phone}
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    required
                    className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t.checkout.addressLine1}
                  </label>
                  <input
                    type="text"
                    value={address.line1}
                    onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                    required
                    className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t.checkout.city}
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                    className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground block mb-1">
                    {t.checkout.postalCode}
                  </label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    required
                    className="w-full text-xs h-9 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Virtual Payment */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <CreditCard className="size-4 text-primary" />
                <span>{t.checkout.stepPayment}</span>
              </div>

              <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-foreground flex items-center gap-2">
                    <ShieldCheck className="size-4 text-primary" />
                    {t.checkout.virtualPaymentTitle}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                    No Card Needed
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {t.checkout.virtualPaymentDesc}
                </p>
              </div>
            </div>

            {/* Step 3: Order Review */}
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <ShoppingBag className="size-4 text-primary" />
                <span>{t.checkout.stepReview}</span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span className="text-foreground font-semibold tabular-nums">
                    {formatMoney(subtotalMinor, "USD", locale)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="text-foreground font-semibold">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 dark:text-emerald-400">Free</span>
                    ) : (
                      formatMoney(700, "USD", locale)
                    )}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Amount</span>
                  <span className="tabular-nums">
                    {formatMoney(totalMinor, "USD", locale)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || cart.length === 0}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold"
              >
                <span>
                  {isSubmitting
                    ? t.checkout.processingOrder
                    : `${t.checkout.confirmOrder} · ${formatMoney(totalMinor, "USD", locale)}`}
                </span>
                {!isSubmitting && <ArrowRight className="size-4 rtl:rotate-180" />}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
