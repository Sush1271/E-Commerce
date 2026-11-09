import { ArrowRight, ShieldCheck, RefreshCw, Globe, Sparkles, Check } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/storefront/ProductCard";

export function HomeView() {
  const {
    locale,
    products,
    categories,
    setActiveTab,
    setSelectedCategorySlug,
    reviews,
  } = useMarketplaceStore();

  const t = translations[locale];
  const activeProducts = products.filter((p) => p.status === "ACTIVE").slice(0, 4);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                <Sparkles className="size-3.5" />
                <span>{t.hero.eyebrow}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1] text-balance">
                {t.hero.title}
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl">
                {t.hero.description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => setActiveTab("shop")}
                  className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <span>{t.hero.shopNow}</span>
                  <ArrowRight className="size-4 rtl:rotate-180" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setActiveTab("categories")}
                >
                  {t.hero.browseCategories}
                </Button>
              </div>

              {/* Trust markers row */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time independent seller stock</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Check className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Atomic simulated checkout</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Asset */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border shadow-xl bg-muted/40">
                <img
                  src="/src/assets/images/hero_marketplace_craft_1794265187080.jpg"
                  alt="Minimalist artisanal interior living space with crafted stoneware ceramic vases"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white text-xs">
                    <p className="font-semibold uppercase tracking-wider text-amber-200">
                      The Studio Collective
                    </p>
                    <p className="text-sm font-medium mt-0.5 opacity-90">
                      Curated Mediterranean olive wood, stone-washed linen, and brass
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions Strip */}
      <section className="border-y border-border bg-secondary/30 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.hero.features.map((feature, idx) => (
              <div key={idx} className="flex flex-col space-y-1.5 p-2">
                <div className="flex items-center gap-2">
                  <div className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {idx + 1}
                  </div>
                  <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed ps-9">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Collection */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              {t.featured.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t.featured.description}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("shop")}
            className="flex items-center gap-1.5 self-start sm:self-auto text-primary font-semibold text-xs"
          >
            <span>{t.catalog.showingResults.replace("{count}", String(products.length))}</span>
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Category Discovery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.categories.title}
          </h2>
          <p className="text-sm text-muted-foreground">
            {t.categories.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const count = products.filter((p) => p.categoryId === cat.id).length;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategorySlug(cat.slug);
                  setActiveTab("shop");
                }}
                className="group p-6 rounded-xl border border-border bg-card hover:bg-secondary/40 transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="size-8 rounded-lg bg-secondary text-foreground flex items-center justify-center font-bold text-xs group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {cat.slug[0].toUpperCase()}
                    </span>
                    <span className="text-xs text-muted-foreground font-mono">
                      {count} items
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                    {localize(cat.name, locale)}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                    {localize(cat.description, locale)}
                  </p>
                </div>

                <div className="flex items-center text-xs font-semibold text-primary pt-2 border-t border-border/50 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                  <span>Explore category</span>
                  <ArrowRight className="size-3.5 ms-1 rtl:rotate-180" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Craftsmanship Story Journal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-secondary/40 via-card to-secondary/20 p-8 sm:p-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {t.craftStory.eyebrow}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground text-balance">
                {t.craftStory.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t.craftStory.description}
              </p>

              <blockquote className="border-s-2 border-primary ps-4 py-1 text-sm italic text-foreground font-medium">
                "{t.craftStory.quote}"
                <footer className="text-xs not-italic text-muted-foreground mt-1">
                  — {t.craftStory.founder}
                </footer>
              </blockquote>

              <div className="pt-2">
                <Button variant="outline" size="sm" onClick={() => setActiveTab("story")}>
                  Read Workshop Story
                </Button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border shadow-lg">
                <img
                  src="/src/assets/images/product_brass_bookmark_1794265187734.jpg"
                  alt="Crafting brass bookmark"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Verified Collector Feedback
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Reflections from customers who ordered through simulated checkout.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((r) => (
            <div
              key={r.id}
              className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{r.customerName}</span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-300/40 font-medium">
                  Verified
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">"{r.title}"</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Storefront Footer */}
      <footer className="border-t border-border pt-12 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-border">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs">
                  e
                </span>
                <span className="font-bold text-base text-foreground tracking-tight">
                  {t.brand}
                </span>
              </div>
              <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                {t.hero.description}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Explore
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab("shop")} className="hover:text-foreground">
                    {t.nav.products}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("categories")} className="hover:text-foreground">
                    {t.nav.categories}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("story")} className="hover:text-foreground">
                    {t.nav.story}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("account")} className="hover:text-foreground">
                    {t.nav.account}
                  </button>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-foreground text-xs uppercase tracking-wider">
                Seller Portals
              </h4>
              <ul className="space-y-1.5">
                <li>
                  <button onClick={() => setActiveTab("seller")} className="hover:text-foreground">
                    {t.nav.seller}
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab("admin")} className="hover:text-foreground">
                    {t.nav.admin}
                  </button>
                </li>
                <li className="text-[11px] text-muted-foreground/80">
                  Cedar & Craft Independent Collective
                </li>
              </ul>
            </div>
          </div>

          <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 e-commerce marketplace MVP. All rights reserved.</p>
            <p className="text-muted-foreground text-[11px]">
              Simulated sandbox checkout · Built with React 19, TypeScript, Zustand & Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
