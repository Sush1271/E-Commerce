import { useState } from "react";
import {
  DollarSign,
  Package,
  TrendingUp,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Truck,
  Clock,
  X,
} from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { OrderStatus, Product } from "@/types";

export function SellerDashboardView() {
  const {
    locale,
    products,
    categories,
    orders,
    store,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
  } = useMarketplaceStore();

  const t = translations[locale];
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "analytics">("products");

  // Modal state for Add/Edit product
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form states
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [descEn, setDescEn] = useState("");
  const [descAr, setDescAr] = useState("");
  const [sku, setSku] = useState("");
  const [priceDollars, setPriceDollars] = useState("");
  const [stockOnHand, setStockOnHand] = useState("10");
  const [lowStockThreshold, setLowStockThreshold] = useState("5");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [imageUrl, setImageUrl] = useState("/src/assets/images/product_olive_wood_board_1794265186415.jpg");

  // Calculate seller metrics
  const sellerProducts = products;
  const sellerOrders = orders.filter((o) => o.storeId === store.id);

  const totalRevenueMinor = sellerOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totals.totalMinor, 0);

  const unitsSold = sellerOrders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.items.reduce((acc, i) => acc + i.quantity, 0), 0);

  const lowStockCount = sellerProducts.filter(
    (p) => p.stockOnHand <= p.lowStockThreshold
  ).length;

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setTitleEn("");
    setTitleAr("");
    setDescEn("");
    setDescAr("");
    setSku(`CC-ITEM-${Math.floor(100 + Math.random() * 900)}`);
    setPriceDollars("35.00");
    setStockOnHand("12");
    setLowStockThreshold("4");
    setCategoryId(categories[0]?.id || "");
    setImageUrl("/src/assets/images/product_olive_wood_board_1794265186415.jpg");
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setTitleEn(p.title.en);
    setTitleAr(p.title.ar);
    setDescEn(p.description.en);
    setDescAr(p.description.ar);
    setSku(p.sku);
    setPriceDollars((p.priceMinor / 100).toFixed(2));
    setStockOnHand(String(p.stockOnHand));
    setLowStockThreshold(String(p.lowStockThreshold));
    setCategoryId(p.categoryId);
    setImageUrl(p.images[0]?.url || "");
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const priceMinor = Math.round(parseFloat(priceDollars) * 100);

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: { en: titleEn, ar: titleAr || titleEn },
        description: { en: descEn, ar: descAr || descEn },
        sku,
        priceMinor,
        stockOnHand: parseInt(stockOnHand) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 3,
        categoryId,
        images: [{ url: imageUrl, alt: { en: titleEn, ar: titleAr || titleEn } }],
      });
    } else {
      addProduct({
        slug: titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || `product-${Date.now()}`,
        sku,
        title: { en: titleEn, ar: titleAr || titleEn },
        description: { en: descEn, ar: descAr || descEn },
        categoryId,
        priceMinor,
        compareAtPriceMinor: null,
        currency: "USD",
        stockOnHand: parseInt(stockOnHand) || 0,
        lowStockThreshold: parseInt(lowStockThreshold) || 3,
        images: [{ url: imageUrl, alt: { en: titleEn, ar: titleAr || titleEn } }],
        status: "ACTIVE",
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Seller Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-card shadow-sm">
        <div>
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">
            Seller Business Portal
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {localize(store.name, locale)}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {localize(store.description, locale)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleOpenAddModal} size="sm" className="gap-1.5 text-xs">
            <Plus className="size-4" />
            <span>{t.seller.addProduct}</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.seller.totalRevenue}</span>
            <DollarSign className="size-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatMoney(totalRevenueMinor, "USD", locale)}
          </p>
          <p className="text-[11px] text-muted-foreground">30-day cumulative virtual total</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.seller.totalOrders}</span>
            <Package className="size-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {sellerOrders.length}
          </p>
          <p className="text-[11px] text-muted-foreground">Incoming customer orders</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.seller.unitsSold}</span>
            <TrendingUp className="size-4 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {unitsSold}
          </p>
          <p className="text-[11px] text-muted-foreground">Handcrafted pieces shipped</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.seller.lowStockAlerts}</span>
            <AlertTriangle className="size-4 text-amber-600 dark:text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {lowStockCount}
          </p>
          <p className="text-[11px] text-muted-foreground">Items requiring workshop restock</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border text-sm font-medium">
        <button
          onClick={() => setActiveTab("products")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "products"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.seller.products} ({sellerProducts.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "orders"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.seller.orders} ({sellerOrders.length})
        </button>

        <button
          onClick={() => setActiveTab("analytics")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "analytics"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.seller.analytics}
        </button>
      </div>

      {/* Tab 1: Products Table */}
      {activeTab === "products" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">Item</th>
                  <th className="py-3 px-4 text-start">SKU</th>
                  <th className="py-3 px-4 text-start">Price</th>
                  <th className="py-3 px-4 text-start">Stock On Hand</th>
                  <th className="py-3 px-4 text-start">Status</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sellerProducts.map((p) => {
                  const isLow = p.stockOnHand <= p.lowStockThreshold;
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]?.url}
                            alt={localize(p.title, locale)}
                            className="size-10 rounded-md object-cover border border-border shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-foreground truncate">
                              {localize(p.title, locale)}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              {categories.find((c) => c.id === p.categoryId)?.name.en}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-muted-foreground">
                        {p.sku}
                      </td>

                      <td className="py-3 px-4 font-bold text-foreground tabular-nums">
                        {formatMoney(p.priceMinor, p.currency, locale)}
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold tabular-nums px-2 py-0.5 rounded-md ${
                            p.stockOnHand === 0
                              ? "bg-destructive/10 text-destructive"
                              : isLow
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                              : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                          }`}
                        >
                          {p.stockOnHand} units
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                            p.status === "ACTIVE"
                              ? "bg-secondary text-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-end">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="size-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Orders Fulfilment */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {sellerOrders.length === 0 ? (
            <p className="text-center py-12 text-xs text-muted-foreground">
              No orders received yet.
            </p>
          ) : (
            sellerOrders.map((o) => (
              <div
                key={o.id}
                className="p-5 rounded-xl border border-border bg-card space-y-4 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border text-xs">
                  <div>
                    <span className="font-mono font-bold text-foreground text-sm me-2">
                      {o.orderNumber}
                    </span>
                    <span className="text-muted-foreground">
                      Customer: <strong className="text-foreground">{o.customerSnapshot.displayName}</strong> ({o.customerSnapshot.email})
                    </span>
                  </div>

                  {/* Order Status Workflow Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium">Update Status:</span>
                    <select
                      value={o.status}
                      onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                      className="h-8 px-2.5 text-xs bg-background border border-input rounded-md font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="PLACED">Placed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Items in order */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {o.items.map((line) => (
                    <div
                      key={line.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30"
                    >
                      <span className="font-medium text-foreground">
                        {localize(line.title, locale)} (x{line.quantity})
                      </span>
                      <span className="font-bold text-foreground tabular-nums">
                        {formatMoney(line.lineTotalMinor, o.currency, locale)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground flex flex-col sm:flex-row justify-between pt-1">
                  <span>
                    Shipping Destination: {o.shippingAddressSnapshot.line1}, {o.shippingAddressSnapshot.city}, {o.shippingAddressSnapshot.countryCode}
                  </span>
                  <span className="font-bold text-foreground">
                    Total: {formatMoney(o.totals.totalMinor, o.currency, locale)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 3: Analytics */}
      {activeTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground">Top Performing Products</h3>
            <div className="space-y-3">
              {sellerProducts
                .sort((a, b) => b.soldCount - a.soldCount)
                .slice(0, 4)
                .map((p) => (
                  <div key={p.id} className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">{localize(p.title, locale)}</span>
                      <span className="text-muted-foreground font-mono">{p.soldCount} sold</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, (p.soldCount / 80) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-sm text-foreground">Fulfilment Distribution</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
                <span className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="size-3.5 text-emerald-600" /> Delivered
                </span>
                <span className="font-bold font-mono">
                  {sellerOrders.filter((o) => o.status === "DELIVERED").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="size-3.5 text-blue-600" /> Shipped
                </span>
                <span className="font-bold font-mono">
                  {sellerOrders.filter((o) => o.status === "SHIPPED").length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-secondary/40">
                <span className="flex items-center gap-1.5 font-medium">
                  <Clock className="size-3.5 text-amber-600" /> In Processing
                </span>
                <span className="font-bold font-mono">
                  {sellerOrders.filter((o) => o.status === "PROCESSING" || o.status === "PLACED").length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto my-auto space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground">
                {editingProduct ? t.seller.editProduct : t.seller.addProduct}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.productTitleEn}
                  </label>
                  <input
                    type="text"
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    required
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.productTitleAr}
                  </label>
                  <input
                    type="text"
                    value={titleAr}
                    onChange={(e) => setTitleAr(e.target.value)}
                    placeholder="العنوان بالعربية"
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.productDescEn}
                  </label>
                  <textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    rows={2}
                    required
                    className="w-full p-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">SKU</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    required
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.category}
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.priceDollars}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={priceDollars}
                    onChange={(e) => setPriceDollars(e.target.value)}
                    required
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.stockQty}
                  </label>
                  <input
                    type="number"
                    value={stockOnHand}
                    onChange={(e) => setStockOnHand(e.target.value)}
                    required
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">
                    {t.seller.lowStockThreshold}
                  </label>
                  <input
                    type="number"
                    value={lowStockThreshold}
                    onChange={(e) => setLowStockThreshold(e.target.value)}
                    required
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-muted-foreground block mb-1">Preset Image</label>
                  <select
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full h-8 px-2.5 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  >
                    <option value="/src/assets/images/product_olive_wood_board_1794265186415.jpg">Olive Wood Board</option>
                    <option value="/src/assets/images/product_woven_market_tote_1794265186661.jpg">Woven Market Tote</option>
                    <option value="/src/assets/images/product_washed_linen_runner_1794265188571.jpg">Washed Linen Runner</option>
                    <option value="/src/assets/images/product_brass_bookmark_1794265187734.jpg">Brass Bookmark</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  {t.common.cancel}
                </Button>
                <Button type="submit">
                  {t.seller.saveProduct}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
