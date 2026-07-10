import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, HardHat } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 40));
    return unsub;
  }, [scrollY]);

  const navItems = [
    { label: "Accueil", href: "/" },
    { label: "Projets", href: "/projets" },
    { label: "Plans", href: "/plans" },
    { label: "Médiathèque", href: "/mediatheque" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md print:hidden transition-colors duration-300 ${scrolled ? 'bg-background/80 border-b border-border' : 'bg-transparent border-b-0'}`}
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <HardHat className="text-accent h-6 w-6" />
            </motion.div>
            <span className="group-hover:text-foreground transition-colors">
              Cissé Ibrahim <span className="text-primary">Matche</span>
            </span>
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex items-center gap-1"
        >
          {navItems.map((item, i) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <Link
                href={item.href}
                className="relative px-3 py-2 text-sm font-medium transition-colors group"
                data-testid={`nav-link-${item.label.toLowerCase()}`}
              >
                <span className={`relative z-10 transition-colors duration-200 ${
                  location === item.href ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
                }`}>
                  {item.label}
                </span>
                {location === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-x-2 bottom-0.5 h-0.5 bg-accent rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <motion.div
                  className="absolute inset-0 rounded-md bg-card/50"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.15 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile toggle */}
        <motion.button
          className="md:hidden p-2 text-foreground rounded-md hover:bg-card transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          whileTap={{ scale: 0.9 }}
          data-testid="button-mobile-menu"
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X className="w-5 h-5" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu className="w-5 h-5" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden overflow-hidden border-t border-border bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block text-sm font-medium p-3 rounded-lg transition-colors ${
                      location === item.href
                        ? "bg-primary/10 text-accent border border-primary/20"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
