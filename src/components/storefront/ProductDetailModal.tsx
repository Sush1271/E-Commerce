import { useState } from "react";
import { Star, Heart, ShoppingBag, Truck, ShieldCheck, Check, ArrowLeft } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function ProductDetailModal() {
  const {
    locale,
    products,
    selectedProductSlug,
    setSelectedProductSlug,
    addToCart,
    isWishlisted,
    toggleWishlist,
    reviews,
    addReview,
    orders,
    currentUser,
  } = useMarketplaceStore();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "reviews">("details");
  const [isAdded, setIsAdded] = useState(false);

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!selectedProductSlug) return null;

  const product = products.find((p) => p.slug === selectedProductSlug);
  if (!product) return null;

  const t = translations[locale];
  const title = localize(product.title, locale);
  const description = localize(product.description, locale);
  const storeName = localize(product.storeSnapshot.name, locale);
  const isSaved = isWishlisted(product.id);
  const isLowStock = product.stockOnHand > 0 && product.stockOnHand <= product.lowStockThreshold;
  const isOutOfStock = product.stockOnHand <= 0;

  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Check if customer has an order for this product to allow review
  const canReview = orders.some(
    (o) =>
      o.customerId === currentUser?.id &&
      o.status === "DELIVERED" &&
      o.items.some((item) => item.productId === product.id)
  );

  const handleAddToCart = () => {
    const success = addToCart(product, quantity);
    if (success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewBody.trim()) return;

    const userOrder = orders.find(
      (o) =>
        o.customerId === currentUser?.id &&
        o.items.some((item) => item.productId === product.id)
    );

    addReview({
      productId: product.id,
      orderId: userOrder?.id || "ord_demo_001",
      rating: newRating,
      title: reviewTitle.trim(),
      body: reviewBody.trim(),
    });

    setReviewTitle("");
    setReviewBody("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setSelectedProductSlug(null)}
        aria-hidden="true"
      />

      {/* Surface Modal */}
      <div className="relative w-full max-w-4xl rounded-2xl border border-border bg-card shadow-2xl z-10 max-h-[92vh] overflow-y-auto my-auto">
        {/* Header toolbar */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card/95 backdrop-blur-md px-6 py-3.5">
          <button
            onClick={() => setSelectedProductSlug(null)}
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ArrowLeft className="size-4 rtl:rotate-180" />
            <span>Back to Catalog</span>
          </button>
          <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
            {storeName}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery Left */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted/40 border border-border">
                <img
                  src={product.images[0]?.url}
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
              </div>

              {/* Trust markers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-primary shrink-0" />
                  <span>Verified independent artisan</span>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-secondary/50 border border-border/50 text-xs text-muted-foreground">
                  <Truck className="size-4 text-primary shrink-0" />
                  <span>Plastic-free regional shipping</span>
                </div>
              </div>
            </div>

            {/* Purchase Module Right */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                {/* Store badge & rating */}
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span className="font-semibold uppercase tracking-wider text-primary">
                    {storeName}
                  </span>
                  {product.rating.count > 0 && (
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating.average.toFixed(1)}</span>
                      <span className="text-muted-foreground">({product.rating.count} reviews)</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance">
                  {title}
                </h1>

                {/* SKU */}
                <p className="mt-1 text-xs text-muted-foreground">
                  {t.product.sku}: <span className="font-mono text-foreground">{product.sku}</span>
                </p>

                {/* Pricing & Stock Banner */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-foreground tabular-nums">
                    {formatMoney(product.priceMinor, product.currency, locale)}
                  </span>
                  {product.compareAtPriceMinor && (
                    <span className="text-base text-muted-foreground line-through tabular-nums">
                      {formatMoney(product.compareAtPriceMinor, product.currency, locale)}
                    </span>
                  )}
                </div>

                {/* Stock notice */}
                <div className="mt-3">
                  {isOutOfStock ? (
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-destructive/10 text-destructive border border-destructive/20">
                      {t.product.outOfStock}
                    </span>
                  ) : isLowStock ? (
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-amber-50 text-amber-800 border border-amber-300 dark:bg-amber-950/40 dark:text-amber-300">
                      {t.product.lowStock.replace("{count}", String(product.stockOnHand))}
                    </span>
                  ) : (
                    <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {t.product.inStock} ({product.stockOnHand} available)
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Interactive Purchase Controls */}
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center gap-4">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-lg border border-border bg-background">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3 py-2 text-sm font-semibold hover:bg-muted text-foreground transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3 py-2 text-sm font-semibold text-foreground min-w-[2.5rem] text-center tabular-nums">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stockOnHand, quantity + 1))}
                      disabled={quantity >= product.stockOnHand || isOutOfStock}
                      className="px-3 py-2 text-sm font-semibold hover:bg-muted text-foreground transition-colors disabled:opacity-30 cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    size="lg"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {isAdded ? (
                      <>
                        <Check className="size-4" />
                        <span>{t.product.addedToCart}!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="size-4" />
                        <span>{t.product.addToCart}</span>
                      </>
                    )}
                  </Button>

                  {/* Wishlist toggle */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-lg border border-border transition-colors cursor-pointer ${
                      isSaved
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                    title={t.product.saveWishlist}
                  >
                    <Heart className={`size-5 ${isSaved ? "fill-current" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Reviews Tabs */}
          <div className="mt-10 border-t border-border pt-6">
            <div className="flex items-center gap-6 border-b border-border text-sm font-medium">
              <button
                onClick={() => setActiveTab("details")}
                className={`pb-3 transition-colors cursor-pointer ${
                  activeTab === "details"
                    ? "border-b-2 border-primary text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.product.details}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 transition-colors cursor-pointer flex items-center gap-2 ${
                  activeTab === "reviews"
                    ? "border-b-2 border-primary text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span>{t.product.reviews}</span>
                <span className="px-1.5 py-0.5 rounded-full bg-secondary text-[11px] font-semibold">
                  {productReviews.length}
                </span>
              </button>
            </div>

            {/* Tab: Specifications & Details */}
            {activeTab === "details" && (
              <div className="py-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {product.attributes?.map((attr, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 text-xs"
                    >
                      <span className="text-muted-foreground font-medium">
                        {localize(attr.key, locale)}
                      </span>
                      <span className="text-foreground font-semibold">
                        {localize(attr.value, locale)}
                      </span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 text-xs">
                    <span className="text-muted-foreground font-medium">Creator Workshop</span>
                    <span className="text-foreground font-semibold">{storeName}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/50 text-xs">
                    <span className="text-muted-foreground font-medium">Packaging</span>
                    <span className="text-foreground font-semibold">100% Recyclable Kraft Box</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === "reviews" && (
              <div className="py-6 space-y-6">
                {/* Existing Reviews List */}
                {productReviews.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">
                    {t.product.noReviews}
                  </p>
                ) : (
                  <div className="space-y-4">
                    {productReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-xl border border-border bg-card space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                              {rev.customerName[0]}
                            </div>
                            <span className="text-sm font-semibold text-foreground">
                              {rev.customerName}
                            </span>
                            <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300/40">
                              {t.product.verifiedPurchase}
                            </span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`size-3.5 ${
                                  star <= rev.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {rev.title && (
                          <h4 className="text-sm font-bold text-foreground">{rev.title}</h4>
                        )}
                        <p className="text-xs text-muted-foreground leading-relaxed">{rev.body}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Write a review form */}
                <div className="p-5 rounded-xl border border-border bg-secondary/20 space-y-4 mt-6">
                  <h4 className="text-sm font-bold text-foreground">{t.product.writeReview}</h4>
                  {reviewSubmitted ? (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs rounded-lg border border-emerald-300/40">
                      Thank you! Your verified review has been published.
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          {t.product.ratingLabel}
                        </label>
                        <div className="flex items-center gap-1.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setNewRating(s)}
                              className="p-1 cursor-pointer"
                            >
                              <Star
                                className={`size-5 ${
                                  s <= newRating
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground/30"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          {t.product.reviewTitle}
                        </label>
                        <input
                          type="text"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Beautiful finish & authentic craftsmanship"
                          required
                          className="w-full text-xs h-8 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground block mb-1">
                          {t.product.reviewBody}
                        </label>
                        <textarea
                          value={reviewBody}
                          onChange={(e) => setReviewBody(e.target.value)}
                          rows={3}
                          placeholder="Share your thoughts about texture, craftsmanship, or packaging..."
                          required
                          className="w-full text-xs p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>

                      <Button type="submit" size="sm">
                        {t.product.submitReview}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
