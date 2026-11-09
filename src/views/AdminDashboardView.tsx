import { useState } from "react";
import {
  ShieldCheck,
  Users,
  Store,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Eye,
  EyeOff,
  UserCheck,
} from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { formatMoney, localize, translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types";

export function AdminDashboardView() {
  const {
    locale,
    users,
    products,
    orders,
    auditLogs,
    toggleUserStatus,
    updateUserRole,
    toggleProductStatus,
  } = useMarketplaceStore();

  const t = translations[locale];
  const [activeTab, setActiveTab] = useState<"users" | "catalog" | "audits">("users");

  const totalGMVMinor = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + o.totals.totalMinor, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl border border-border bg-card shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold text-purple-700 dark:text-purple-400 uppercase tracking-wider">
            Superuser Governance
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.admin.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Full authority over user credentials, catalog moderation, and immutable audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800">
            <ShieldCheck className="size-3.5" />
            <span>Administrator Session</span>
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.admin.statsGMV}</span>
            <span className="text-emerald-600 font-bold">$</span>
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">
            {formatMoney(totalGMVMinor, "USD", locale)}
          </p>
          <p className="text-[11px] text-muted-foreground">Cumulative platform volume</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.admin.statsUsers}</span>
            <Users className="size-4 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{users.length}</p>
          <p className="text-[11px] text-muted-foreground">Admins, sellers, and buyers</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.admin.statsStores}</span>
            <Store className="size-4 text-amber-600" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">1</p>
          <p className="text-[11px] text-muted-foreground">Cedar & Craft Verified</p>
        </div>

        <div className="p-5 rounded-xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">{t.admin.statsAudits}</span>
            <FileText className="size-4 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-foreground tabular-nums">{auditLogs.length}</p>
          <p className="text-[11px] text-muted-foreground">Audited system events</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-border text-sm font-medium">
        <button
          onClick={() => setActiveTab("users")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "users"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.admin.usersTab} ({users.length})
        </button>

        <button
          onClick={() => setActiveTab("catalog")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "catalog"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.admin.catalogTab} ({products.length})
        </button>

        <button
          onClick={() => setActiveTab("audits")}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === "audits"
              ? "border-b-2 border-primary text-primary font-semibold"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {t.admin.auditsTab} ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: Users Management */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">User</th>
                  <th className="py-3 px-4 text-start">Role</th>
                  <th className="py-3 px-4 text-start">Status</th>
                  <th className="py-3 px-4 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-secondary flex items-center justify-center font-bold text-foreground">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{u.name}</p>
                          <p className="text-muted-foreground text-[11px]">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as Role)}
                        className="h-7 px-2 text-xs bg-background border border-input rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer font-medium"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="SELLER">SELLER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-md ${
                          u.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <Button
                        variant={u.status === "ACTIVE" ? "outline" : "default"}
                        size="sm"
                        onClick={() => toggleUserStatus(u.id)}
                        className="text-[11px] h-7 px-2"
                      >
                        {u.status === "ACTIVE" ? "Suspend Account" : "Activate Account"}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Catalog Moderation */}
      {activeTab === "catalog" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">Product</th>
                  <th className="py-3 px-4 text-start">Store</th>
                  <th className="py-3 px-4 text-start">Price</th>
                  <th className="py-3 px-4 text-start">Stock</th>
                  <th className="py-3 px-4 text-start">Visibility</th>
                  <th className="py-3 px-4 text-end">Moderate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]?.url}
                          alt={localize(p.title, locale)}
                          className="size-8 rounded-md object-cover border border-border shrink-0"
                        />
                        <span className="font-semibold text-foreground truncate max-w-[200px]">
                          {localize(p.title, locale)}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground">
                      {localize(p.storeSnapshot.name, locale)}
                    </td>

                    <td className="py-3 px-4 font-bold text-foreground tabular-nums">
                      {formatMoney(p.priceMinor, p.currency, locale)}
                    </td>

                    <td className="py-3 px-4 font-mono">{p.stockOnHand}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleProductStatus(p.id)}
                        className="text-[11px] h-7 px-2 gap-1"
                      >
                        {p.status === "ACTIVE" ? (
                          <>
                            <EyeOff className="size-3" />
                            <span>Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye className="size-3" />
                            <span>Publish</span>
                          </>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Security & Audit Logs */}
      {activeTab === "audits" && (
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead className="bg-secondary/40 border-b border-border text-muted-foreground font-semibold">
                <tr>
                  <th className="py-3 px-4 text-start">Timestamp</th>
                  <th className="py-3 px-4 text-start">Action</th>
                  <th className="py-3 px-4 text-start">Entity</th>
                  <th className="py-3 px-4 text-start">Actor</th>
                  <th className="py-3 px-4 text-start">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-2.5 px-4 text-muted-foreground whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-foreground">
                      {log.action}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground">
                      {log.entityType} ({log.entityId.slice(0, 8)})
                    </td>
                    <td className="py-2.5 px-4 text-foreground">
                      {log.actorName}
                    </td>
                    <td className="py-2.5 px-4 text-muted-foreground truncate max-w-[240px]">
                      {log.metadata ? JSON.stringify(log.metadata) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
