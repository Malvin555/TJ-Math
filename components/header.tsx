"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CalculatorIcon, HistoryIcon, MenuIcon } from "lucide-react"; // Import MenuIcon
import { useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 15, delay: 0.2 }}
      className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm"
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-primary"
          prefetch={false}
        >
          <CalculatorIcon className="h-6 w-6" />
          <span className="text-xl font-extrabold">TJMathHub</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4 md:gap-6">
          <Link href="/quiz" prefetch={false}>
            <Button variant="default">Start Quiz</Button>
          </Link>
          <Link href="/history" prefetch={false}>
            <Button
              variant="ghost"
              className="text-primary hover:bg-accent hover:text-accent-foreground"
            >
              <HistoryIcon className="mr-2 h-4 w-4" /> History
            </Button>
          </Link>
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" onClick={toggleMenu}>
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <nav className="flex flex-col items-start gap-4 p-4">
            <Link href="/quiz" prefetch={false}>
              <Button variant="default">Start Quiz</Button>
            </Link>
            <Link href="/history" prefetch={false}>
              <Button
                variant="ghost"
                className="text-primary hover:bg-accent hover:text-accent-foreground"
              >
                <HistoryIcon className="mr-2 h-4 w-4" /> History
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </motion.header>
  );
}
