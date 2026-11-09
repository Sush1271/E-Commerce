import { Star, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/types";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    locale,
    addToCart,
    isWishlisted,
    toggleWishlist,
    setSelectedProductSlug,
  } = useMarketplaceStore();

  const t = translations[locale];
  const title = localize(product.title, locale);
  const storeName = localize(product.storeSnapshot.name, locale);
  const isSaved = isWishlisted(product.id);
  const isLowStock = product.stockOnHand > 0 && product.stockOnHand <= product.lowStockThreshold;
  const isOutOfStock = product.stockOnHand <= 0;

  const handleCardClick = () => {
    setSelectedProductSlug(product.slug);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer select-none"
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className={`absolute top-3 end-3 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
          isSaved
            ? "bg-primary text-primary-foreground shadow-sm"
            : "bg-background/80 text-muted-foreground hover:text-foreground hover:bg-background"
        }`}
        aria-label={t.product.saveWishlist}
      >
        <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
      </button>

      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/30">
        <img
          src={product.images[0]?.url}
          alt={title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            // Stylized CSS fallback
            (e.target as HTMLElement).style.display = "none";
          }}
        />
        {/* Fallback pattern if image is hidden */}
        <div className="absolute inset-0 -z-10 flex items-center justify-center bg-secondary/50 text-muted-foreground p-4 text-center">
          <span className="text-xs font-medium">{title}</span>
        </div>

        {/* Stock status indicator */}
        {isOutOfStock ? (
          <div className="absolute bottom-2.5 start-2.5 bg-background/90 backdrop-blur-sm text-destructive text-[11px] font-semibold px-2 py-0.5 rounded-md border border-destructive/20">
            {t.product.outOfStock}
          </div>
        ) : isLowStock ? (
          <div className="absolute bottom-2.5 start-2.5 bg-background/90 backdrop-blur-sm text-amber-700 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-md border border-amber-300/40">
            {t.product.lowStock.replace("{count}", String(product.stockOnHand))}
          </div>
        ) : null}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Top row: store & rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span className="font-medium tracking-wide uppercase">{storeName}</span>
            {product.rating.count > 0 && (
              <span className="flex items-center gap-1 font-medium text-amber-700 dark:text-amber-400">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>{product.rating.average.toFixed(1)}</span>
                <span className="text-muted-foreground text-[10px]">({product.rating.count})</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {title}
          </h3>

          {/* Short description */}
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {localize(product.description, locale)}
          </p>
        </div>

        {/* Bottom row: Price & Quick Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-foreground tabular-nums">
              {formatMoney(product.priceMinor, product.currency, locale)}
            </span>
            {product.compareAtPriceMinor && (
              <span className="text-xs text-muted-foreground line-through tabular-nums">
                {formatMoney(product.compareAtPriceMinor, product.currency, locale)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingBag className="size-3.5" />
            <span>{t.product.addToCart}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
