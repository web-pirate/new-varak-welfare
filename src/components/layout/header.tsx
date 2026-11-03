"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  id: string;
  name: string;
  url: string;
  children?: NavItem[];
};

export function Header({ menuItems }: { menuItems: NavItem[] }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-white/80 backdrop-blur-xl shadow-[0_1px_0_rgba(0,0,0,0.04),0_4px_20px_rgba(194,85,58,0.04)]"
            : "bg-transparent"
        )}
      >
        {/* Rainbow ribbon bar */}
        <div
          className={cn(
            "ribbon-bar transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo with ribbon accent */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image src="/logo.png" alt="Varak" width={56} height={56} priority className="w-12 h-12 md:w-14 md:h-14" />
              <div className="hidden sm:block">
                <span className="font-heading text-2xl text-foreground tracking-tight block leading-tight">
                  Varak
                </span>
                <span className="text-[11px] font-medium text-muted-foreground tracking-[0.08em] uppercase leading-none">
                  Cancer Welfare
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-0.5">
              {menuItems.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <Link
                    key={item.id}
                    href={item.url}
                    className={cn(
                      "relative px-4 py-2 text-[13px] font-medium rounded-none transition-all duration-300",
                      isActive
                        ? "text-varak-primary"
                        : "text-foreground/60 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-varak-primary/[0.06] rounded-none"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <SignedOut>
                <Link href="/sign-in" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-foreground/60 hover:bg-varak-primary/[0.06] hover:text-varak-primary rounded-none"
                  >
                    Sign In
                  </Button>
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/dashboard/fundraiser" className="hidden sm:block">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] font-medium text-foreground/60 hover:bg-varak-primary/[0.06] hover:text-varak-primary rounded-none"
                  >
                    Dashboard
                  </Button>
                </Link>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 ring-2 ring-white shadow-sm",
                    },
                  }}
                />
              </SignedIn>
              <Link href="/start-fundraiser" className="hidden sm:block">
                <Button
                  size="sm"
                  className="bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none px-5 text-[13px] font-medium shadow-[0_2px_8px_rgba(194,85,58,0.2)] hover:shadow-[0_4px_16px_rgba(194,85,58,0.3)] transition-all duration-300 hover:-translate-y-px"
                >
                  Start a Fundraiser
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </Link>

              {/* Mobile toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden relative w-10 h-10 rounded-none hover:bg-muted/80 flex items-center justify-center transition-colors"
                aria-label="Toggle menu"
              >
                <AnimatePresence mode="wait">
                  {mobileOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="open"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-white/95 backdrop-blur-xl lg:hidden overflow-y-auto"
            >
              {/* Ribbon accent at top */}
              <div className="ribbon-bar" />

              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <span className="font-heading text-lg text-varak-primary">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-9 h-9 rounded-none bg-muted/80 flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="p-5 space-y-1">
                {menuItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.url}
                      className={cn(
                        "flex items-center justify-between px-4 py-3.5 rounded-none text-[15px] font-medium transition-all",
                        pathname === item.url
                          ? "bg-varak-primary/[0.06] text-varak-primary"
                          : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
                      )}
                    >
                      {item.name}
                      <ChevronRight className="h-4 w-4 opacity-30" />
                    </Link>
                  </motion.div>
                ))}

                <div className="border-t border-border/50 pt-5 mt-5 space-y-3">
                  <SignedOut>
                    <Link href="/sign-in" className="block">
                      <Button variant="outline" className="w-full rounded-none h-11 text-sm ring-1 ring-foreground/10">
                        Sign In
                      </Button>
                    </Link>
                  </SignedOut>
                  <Link href="/start-fundraiser" className="block">
                    <Button className="w-full bg-varak-primary hover:bg-varak-primary-dark text-white rounded-none h-11 text-sm shadow-lg shadow-varak-primary/20">
                      Start a Fundraiser
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
