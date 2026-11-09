import { useEffect } from "react";
import { useMarketplaceStore } from "@/lib/store";
import { Header } from "@/components/storefront/Header";
import { HomeView } from "@/views/HomeView";
import { CatalogView } from "@/views/CatalogView";
import { CategoriesView } from "@/views/CategoriesView";
import { StoryView } from "@/views/StoryView";
import { AccountView } from "@/views/AccountView";
import { SellerDashboardView } from "@/views/SellerDashboardView";
import { AdminDashboardView } from "@/views/AdminDashboardView";
import { ProductDetailModal } from "@/components/storefront/ProductDetailModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { AuthModal } from "@/components/auth/AuthModal";

export default function App() {
  const { locale, theme, activeTab } = useMarketplaceStore();

  // Keep DOM root attributes in sync with language & theme
  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [locale]);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === "home" && <HomeView />}
        {activeTab === "shop" && <CatalogView />}
        {activeTab === "categories" && <CategoriesView />}
        {activeTab === "story" && <StoryView />}
        {activeTab === "account" && <AccountView />}
        {activeTab === "seller" && <SellerDashboardView />}
        {activeTab === "admin" && <AdminDashboardView />}
      </main>

      {/* Global Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <AuthModal />
    </div>
  );
}
