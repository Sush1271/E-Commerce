import { ArrowRight, Leaf, Hammer, ShieldCheck } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function StoryView() {
  const { locale, setActiveTab } = useMarketplaceStore();
  const t = translations[locale];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Intro Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
          {t.craftStory.eyebrow}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance">
          {t.craftStory.title}
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed">
          {t.craftStory.description}
        </p>
      </div>

      {/* Hero Workshop Image */}
      <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-border shadow-xl">
        <img
          src="/src/assets/images/hero_marketplace_craft_1794265187080.jpg"
          alt="Artisan studio"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
        />
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Leaf className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Sustainably Harvested Timber</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Our olive wood is harvested only from ancient orchards undergoing seasonal pruning. No living groves are ever clear-cut for lumber.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <Hammer className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Hand-Cut & Hand-Finished</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Each brass bookmark and linen runner undergoes manual precision cutting and hand-buffing. Individual organic variations celebrate authentic craft.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-border bg-card space-y-3">
          <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-base font-bold text-foreground">Plastic-Free Delivery</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All orders ship in water-activated kraft paper tape, recycled corrugated mailers, and unbleached cotton pouches designed for reuse.
          </p>
        </div>
      </div>

      {/* Quote Banner */}
      <div className="p-8 sm:p-10 rounded-2xl bg-secondary/50 border border-border text-center max-w-2xl mx-auto space-y-4">
        <p className="text-lg sm:text-xl font-medium text-foreground italic">
          "{t.craftStory.quote}"
        </p>
        <p className="text-xs text-muted-foreground font-semibold">
          — {t.craftStory.founder}
        </p>
        <div className="pt-2">
          <Button onClick={() => setActiveTab("shop")} className="gap-2">
            <span>Explore The Collection</span>
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>
    </div>
  );
}
