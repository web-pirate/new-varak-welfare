"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  FolderKanban,
  Heart,
  Share2,
  Banknote,
  Inbox,
  Users,
  Building2,
  Shield,
  Settings,
  Menu,
  X,
  TrendingUp,
  Star,
  History,
  Trophy,
  Megaphone,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const fundraiserNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/fundraiser", icon: LayoutDashboard },
  { label: "My Campaigns", href: "/dashboard/fundraiser/campaigns", icon: FolderKanban },
  { label: "Donations", href: "/dashboard/fundraiser/donations", icon: Heart },
  { label: "Promote", href: "/dashboard/fundraiser/promote", icon: Share2 },
  { label: "Withdraw", href: "/dashboard/fundraiser/withdraw", icon: Banknote },
  { label: "Inbox", href: "/dashboard/fundraiser/inbox", icon: Inbox },
];

const donorNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/donor", icon: LayoutDashboard },
  { label: "My Donations", href: "/dashboard/donor/past-donations", icon: History },
  { label: "Subscriptions", href: "/dashboard/donor/subscriptions", icon: Star },
  { label: "Leaderboard", href: "/dashboard/donor/leaderboard", icon: Trophy },
];

const adminNav: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Campaigns", href: "/dashboard/admin/campaigns", icon: FolderKanban },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "NGOs", href: "/dashboard/admin/ngos", icon: Building2 },
  { label: "Verification", href: "/dashboard/admin/verification", icon: Shield },
  { label: "Withdrawals", href: "/dashboard/admin/withdrawals", icon: Banknote },
  { label: "Marketing", href: "/dashboard/admin/marketing", icon: Megaphone },
  { label: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];

export function DashboardSidebar({
  role,
  userName,
  avatarUrl,
}: {
  role: string;
  userName: string;
  avatarUrl: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  let navItems: NavItem[];
  let dashTitle: string;

  if (["ADMIN", "SUPER_ADMIN"].includes(role)) {
    navItems = adminNav;
    dashTitle = "Admin Dashboard";
  } else if (role === "FUNDRAISER" || role === "NGO_ADMIN") {
    navItems = fundraiserNav;
    dashTitle = "Fundraiser Dashboard";
  } else {
    navItems = donorNav;
    dashTitle = "Donor Dashboard";
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Varak" width={44} height={44} className="w-11 h-11" />
          <span className="font-heading text-xl text-varak-primary">Varak</span>
        </Link>
        <p className="text-xs text-muted-foreground mt-2">{dashTitle}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-none text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-varak-primary text-white"
                : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3">
          <UserButton
            afterSignOutUrl="/"
            appearance={{ elements: { avatarBox: "w-8 h-8" } }}
          />
          <div className="text-sm">
            <div className="font-medium truncate max-w-[140px]">{userName}</div>
            <div className="text-xs text-muted-foreground capitalize">
              {role.toLowerCase().replace("_", " ")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-border/50 px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-none bg-varak-primary flex items-center justify-center">
            <span className="text-white font-heading text-sm">V</span>
          </div>
          <span className="font-heading text-lg text-varak-primary">Varak</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-none hover:bg-muted"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 z-50 h-full w-64 bg-white transform transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebar}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed top-0 left-0 h-full w-64 bg-white border-r border-border/50">
        {sidebar}
      </div>
    </>
  );
}
