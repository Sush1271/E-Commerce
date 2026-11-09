import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, RotateCcw, PackageOpen } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { localize, translations } from "@/lib/i18n";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import type { CatalogSort } from "@/types";

export function CatalogView() {
  const {
    locale,
    products,
    categories,
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    setSelectedCategorySlug,
  } = useMarketplaceStore();

  const t = translations[locale];

  // Local filter states
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<CatalogSort>("newest");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Must be active unless viewed in admin
      if (product.status !== "ACTIVE") return false;

      // Category filter
      if (selectedCategorySlug) {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        if (cat && product.categoryId !== cat.id) return false;
      }

      // Search query filter (matches english or arabic title, sku, or description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleEn = product.title.en.toLowerCase();
        const titleAr = product.title.ar.toLowerCase();
        const descEn = product.description.en.toLowerCase();
        const sku = product.sku.toLowerCase();

        if (
          !titleEn.includes(q) &&
          !titleAr.includes(q) &&
          !descEn.includes(q) &&
          !sku.includes(q)
        ) {
          return false;
        }
      }

      // In stock filter
      if (inStockOnly && product.stockOnHand <= 0) {
        return false;
      }

      // Price filter (price is in minor units cents)
      if (minPrice) {
        const minVal = parseFloat(minPrice) * 100;
        if (!isNaN(minVal) && product.priceMinor < minVal) return false;
      }
      if (maxPrice) {
        const maxVal = parseFloat(maxPrice) * 100;
        if (!isNaN(maxVal) && product.priceMinor > maxVal) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "price_asc") return a.priceMinor - b.priceMinor;
      if (sortBy === "price_desc") return b.priceMinor - a.priceMinor;
      if (sortBy === "rating") return b.rating.average - a.rating.average;
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedCategorySlug, searchQuery, inStockOnly, minPrice, maxPrice, sortBy, categories]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategorySlug(null);
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setSortBy("newest");
  };

  const hasActiveFilters =
    searchQuery || selectedCategorySlug || minPrice || maxPrice || inStockOnly || sortBy !== "newest";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Description Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {t.catalog.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.catalog.description}</p>
      </div>

      {/* Filter & Control Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute start-3 top-2.5 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.catalog.searchPlaceholder}
              className="w-full h-10 ps-9 pe-4 text-xs sm:text-sm bg-card rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
          </div>

          {/* Controls: Filter Toggle & Sort */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className="flex items-center gap-1.5 text-xs"
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Filter Options</span>
            </Button>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as CatalogSort)}
              className="h-9 px-3 text-xs bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer shadow-sm"
            >
              <option value="newest">{t.catalog.sortNewest}</option>
              <option value="price_asc">{t.catalog.sortPriceLow}</option>
              <option value="price_desc">{t.catalog.sortPriceHigh}</option>
              <option value="rating">{t.catalog.sortRating}</option>
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                title={t.catalog.clearFilters}
              >
                <RotateCcw className="size-3" />
                <span className="hidden sm:inline">{t.catalog.clearFilters}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <button
            onClick={() => setSelectedCategorySlug(null)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
              selectedCategorySlug === null
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
            }`}
          >
            {t.categories.all}
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                selectedCategorySlug === cat.slug
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary/60 text-secondary-foreground hover:bg-secondary"
              }`}
            >
              {localize(cat.name, locale)}
            </button>
          ))}
        </div>

        {/* Expandable Advanced Filter Panel */}
        {isFilterPanelOpen && (
          <div className="p-4 rounded-xl border border-border bg-card/60 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs animate-in fade-in-50 duration-200">
            <div>
              <label className="text-muted-foreground font-medium block mb-1">
                {t.catalog.minPrice}
              </label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-muted-foreground font-medium block mb-1">
                {t.catalog.maxPrice}
              </label>
              <input
                type="number"
                placeholder="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full h-8 px-2.5 rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <input
                type="checkbox"
                id="inStockCheck"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="size-4 accent-primary rounded cursor-pointer"
              />
              <label htmlFor="inStockCheck" className="text-foreground font-medium cursor-pointer">
                {t.catalog.inStockOnly}
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t.catalog.showingResults.replace("{count}", String(filteredProducts.length))}</span>
      </div>

      {/* Products Grid or Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center rounded-2xl border border-border bg-card/40 space-y-4">
          <div className="size-16 rounded-full bg-secondary text-muted-foreground mx-auto flex items-center justify-center">
            <PackageOpen className="size-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              {t.catalog.noResultsTitle}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
              {t.catalog.noResultsDesc}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={handleClearFilters}>
            {t.catalog.clearFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
