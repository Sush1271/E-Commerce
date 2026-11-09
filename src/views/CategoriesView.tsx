import { ArrowRight } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { localize, translations } from "@/lib/i18n";

export function CategoriesView() {
  const {
    locale,
    categories,
    products,
    setActiveTab,
    setSelectedCategorySlug,
  } = useMarketplaceStore();

  const t = translations[locale];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          {t.categories.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
          {t.categories.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => {
          const categoryProducts = products.filter((p) => p.categoryId === cat.id);
          const firstImage = categoryProducts[0]?.images[0]?.url;

          return (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setActiveTab("shop");
              }}
              className="group relative rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col sm:flex-row"
            >
              {firstImage && (
                <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto overflow-hidden bg-muted/40 shrink-0">
                  <img
                    src={firstImage}
                    alt={localize(cat.name, locale)}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-6 sm:w-1/2 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span className="font-mono">{categoryProducts.length} items</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {localize(cat.name, locale)}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {localize(cat.description, locale)}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-primary pt-2 border-t border-border group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>Browse catalog</span>
                  <ArrowRight className="size-3.5 ms-1 rtl:rotate-180" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
