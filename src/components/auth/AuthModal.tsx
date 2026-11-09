import { useState } from "react";
import { User, Store, ShieldCheck, Check, ArrowRight, X } from "lucide-react";
import { useMarketplaceStore } from "@/lib/store";
import { translations } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import type { Role } from "@/types";

export function AuthModal() {
  const {
    locale,
    isAuthModalOpen,
    setIsAuthModalOpen,
    currentUser,
    switchPersona,
    setCurrentUser,
    users,
  } = useMarketplaceStore();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");

  if (!isAuthModalOpen) return null;

  const t = translations[locale];

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signin") {
      const found = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
      if (found) {
        setCurrentUser(found);
      } else {
        // Fallback create or set
        const newUser = {
          id: `usr_${Date.now()}`,
          name: email.split("@")[0] || "User",
          email: email.trim(),
          role: "CUSTOMER" as Role,
          status: "ACTIVE" as const,
          createdAt: new Date().toISOString(),
        };
        setCurrentUser(newUser);
      }
    } else {
      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim() || "New Member",
        email: email.trim() || `user_${Date.now()}@example.com`,
        role,
        status: "ACTIVE" as const,
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(newUser);
    }

    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsAuthModalOpen(false)}
      />

      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl z-10 space-y-6 my-auto">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === "signin" ? "Sign In / Switch Persona" : "Create Marketplace Account"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Production MVP with 3 authenticated personas.
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Quick Demo Persona One-Click Switcher */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
            Instant Demo Logins
          </label>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => {
                switchPersona("CUSTOMER");
                setIsAuthModalOpen(false);
              }}
              className="p-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary flex items-center justify-between text-start transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <User className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Customer (Demo Customer)</p>
                  <p className="text-muted-foreground text-[11px]">customer@example.com</p>
                </div>
              </div>
              {currentUser?.role === "CUSTOMER" && <Check className="size-4 text-primary" />}
            </button>

            <button
              onClick={() => {
                switchPersona("SELLER");
                setIsAuthModalOpen(false);
              }}
              className="p-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary flex items-center justify-between text-start transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Store className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Seller (Cedar & Craft)</p>
                  <p className="text-muted-foreground text-[11px]">seller@example.com</p>
                </div>
              </div>
              {currentUser?.role === "SELLER" && <Check className="size-4 text-primary" />}
            </button>

            <button
              onClick={() => {
                switchPersona("ADMIN");
                setIsAuthModalOpen(false);
              }}
              className="p-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary flex items-center justify-between text-start transition-colors cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="size-7 rounded-md bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="size-4" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Administrator (Platform)</p>
                  <p className="text-muted-foreground text-[11px]">admin@example.com</p>
                </div>
              </div>
              {currentUser?.role === "ADMIN" && <Check className="size-4 text-primary" />}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-border w-full" />
          <span className="bg-card px-2 text-[11px] text-muted-foreground uppercase">
            Or custom account
          </span>
        </div>

        {/* Custom Sign In / Sign Up Form */}
        <form onSubmit={handleCustomSubmit} className="space-y-3 text-xs">
          {mode === "signup" && (
            <div>
              <label className="text-muted-foreground block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          <div>
            <label className="text-muted-foreground block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              required
              className="w-full h-8 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-muted-foreground block mb-1">Desired Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="w-full h-8 px-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                <option value="CUSTOMER">Customer (Browse & Buy)</option>
                <option value="SELLER">Seller (Store & Products)</option>
                <option value="ADMIN">Administrator (Governance)</option>
              </select>
            </div>
          )}

          <Button type="submit" size="sm" className="w-full text-xs font-semibold">
            {mode === "signin" ? "Sign In" : "Register"}
          </Button>

          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="text-[11px] text-primary hover:underline cursor-pointer"
            >
              {mode === "signin"
                ? "Need an account? Register here"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
