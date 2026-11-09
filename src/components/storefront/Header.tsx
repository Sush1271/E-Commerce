import { useState } from "react";
import {
  Search,
  ShoppingBag,
  Heart,
  Globe,
  Sun,
  Moon,
  UserCheck,
  Store,
  ShieldCheck,
  User as UserIcon,
  X,
} from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export function Header() {
  const {
    locale,
    setLocale,
    theme,
    toggleTheme,
    activeTab,
    setActiveTab,
    cart,
    wishlist,
    setIsCartOpen,
    searchQuery,
    setSearchQuery,
    currentUser,
    switchPersona,
    setIsAuthModalOpen,
  } = useMarketplaceStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  const t = translations[locale];
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-colors">
      {/* Top simulated notice bar */}
      <div className="bg-secondary/70 border-b border-border px-4 py-1 text-center text-xs text-secondary-foreground flex items-center justify-center gap-2">
        <span className="font-semibold">{t.brand} MVP</span>
        <span aria-hidden="true">·</span>
        <span className="truncate max-w-[600px]">{t.announcement}</span>
      </div>

      {/* Main 3-Zone Top Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground hover:text-primary transition-colors cursor-pointer whitespace-nowrap"
          >
            <span className="size-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-black text-base shadow-sm">
              e
            </span>
            <span>{t.brand}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className={`transition-colors hover:text-foreground cursor-pointer pb-0.5 ${
              activeTab === "home" ? "text-primary font-semibold border-b-2 border-primary" : ""
            }`}
          >
            {t.nav.home}
          </button>
          <button
            onClick={() => setActiveTab("shop")}
            className={`transition-colors hover:text-foreground cursor-pointer pb-0.5 ${
              activeTab === "shop" ? "text-primary font-semibold border-b-2 border-primary" : ""
            }`}
          >
            {t.nav.products}
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`transition-colors hover:text-foreground cursor-pointer pb-0.5 ${
              activeTab === "categories" ? "text-primary font-semibold border-b-2 border-primary" : ""
            }`}
          >
            {t.nav.categories}
          </button>
          <button
            onClick={() => setActiveTab("story")}
            className={`transition-colors hover:text-foreground cursor-pointer pb-0.5 ${
              activeTab === "story" ? "text-primary font-semibold border-b-2 border-primary" : ""
            }`}
          >
            {t.nav.story}
          </button>

          {/* Role specific quick dashboard links */}
          {currentUser?.role === "SELLER" && (
            <button
              onClick={() => setActiveTab("seller")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
                activeTab === "seller" ? "text-primary font-semibold border-b-2 border-primary" : "text-amber-800 dark:text-amber-400"
              }`}
            >
              <Store className="size-3.5" />
              <span>{t.nav.seller}</span>
            </button>
          )}

          {currentUser?.role === "ADMIN" && (
            <button
              onClick={() => setActiveTab("admin")}
              className={`flex items-center gap-1.5 transition-colors cursor-pointer pb-0.5 ${
                activeTab === "admin" ? "text-primary font-semibold border-b-2 border-primary" : "text-purple-800 dark:text-purple-400"
              }`}
            >
              <ShieldCheck className="size-3.5" />
              <span>{t.nav.admin}</span>
            </button>
          )}

          {currentUser?.role === "CUSTOMER" && (
            <button
              onClick={() => setActiveTab("account")}
              className={`transition-colors hover:text-foreground cursor-pointer pb-0.5 ${
                activeTab === "account" ? "text-primary font-semibold border-b-2 border-primary" : ""
              }`}
            >
              {t.nav.account}
            </button>
          )}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Search Trigger */}
          {isSearchOpen ? (
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.catalog.searchPlaceholder}
                autoFocus
                className="w-48 sm:w-64 h-9 px-3 pe-8 text-sm bg-muted/70 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute end-2 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => {
                setIsSearchOpen(true);
                if (activeTab !== "shop") setActiveTab("shop");
              }}
              title="Search"
            >
              <Search className="size-4" />
            </Button>
          )}

          {/* Language Switcher EN / AR */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="flex items-center gap-1.5 text-xs font-semibold px-2"
            title="Toggle Language"
          >
            <Globe className="size-3.5" />
            <span>{locale === "en" ? "العربية" : "EN"}</span>
          </Button>

          {/* Theme Toggle Light / Dark */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>

          {/* Wishlist indicator */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setActiveTab("account")}
            className="relative"
            title={t.nav.wishlist}
          >
            <Heart className="size-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -end-1 size-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </Button>

          {/* Shopping Cart Indicator */}
          <Button
            variant="default"
            size="sm"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 px-3 relative"
          >
            <ShoppingBag className="size-4" />
            <span className="font-semibold tabular-nums">{cartCount}</span>
          </Button>

          {/* Persona Switcher Menu / Account */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors cursor-pointer"
              title="Switch demo persona"
            >
              {currentUser?.role === "ADMIN" ? (
                <ShieldCheck className="size-3.5 text-purple-600 dark:text-purple-400" />
              ) : currentUser?.role === "SELLER" ? (
                <Store className="size-3.5 text-amber-600 dark:text-amber-400" />
              ) : (
                <UserIcon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              )}
              <span className="font-medium hidden sm:inline">
                {currentUser?.role === "ADMIN"
                  ? t.common.roleAdmin
                  : currentUser?.role === "SELLER"
                  ? t.common.roleSeller
                  : t.common.roleCustomer}
              </span>
            </button>

            {/* Persona Dropdown */}
            {isPersonaMenuOpen && (
              <div
                className="absolute end-0 mt-2 w-56 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs"
                onClick={() => setIsPersonaMenuOpen(false)}
              >
                <div className="px-2.5 py-1.5 border-b border-border mb-1">
                  <p className="font-semibold text-foreground truncate">{currentUser?.name}</p>
                  <p className="text-muted-foreground truncate">{currentUser?.email}</p>
                </div>

                <div className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1">
                  {t.nav.role}
                </div>

                <button
                  onClick={() => switchPersona("CUSTOMER")}
                  className={`w-full text-start px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-muted transition-colors ${
                    currentUser?.role === "CUSTOMER" ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="size-3.5 text-emerald-600" />
                    <span>{t.common.roleCustomer} (Demo)</span>
                  </div>
                  {currentUser?.role === "CUSTOMER" && <UserCheck className="size-3.5 text-primary" />}
                </button>

                <button
                  onClick={() => switchPersona("SELLER")}
                  className={`w-full text-start px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-muted transition-colors ${
                    currentUser?.role === "SELLER" ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Store className="size-3.5 text-amber-600" />
                    <span>{t.common.roleSeller} (Cedar & Craft)</span>
                  </div>
                  {currentUser?.role === "SELLER" && <UserCheck className="size-3.5 text-primary" />}
                </button>

                <button
                  onClick={() => switchPersona("ADMIN")}
                  className={`w-full text-start px-2 py-1.5 rounded-md flex items-center justify-between hover:bg-muted transition-colors ${
                    currentUser?.role === "ADMIN" ? "bg-secondary font-semibold text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="size-3.5 text-purple-600" />
                    <span>{t.common.roleAdmin} (Platform)</span>
                  </div>
                  {currentUser?.role === "ADMIN" && <UserCheck className="size-3.5 text-primary" />}
                </button>

                <div className="border-t border-border mt-1 pt-1">
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="w-full text-start px-2 py-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t.nav.signIn} / Switch User
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
