"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BrainCircuit, Rocket, Trophy } from "lucide-react";

export default function LandingPageContent() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      {/* Hero Section */}
      <section className="container flex flex-col items-center justify-center gap-8 px-4 text-center md:gap-12 md:px-6">
        <motion.div
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-5xl font-extrabold tracking-tight text-foreground drop-shadow-md sm:text-6xl md:text-7xl lg:text-8xl"
            variants={itemVariants}
          >
            Master Math, Fast & Fun!
          </motion.h1>
          <motion.p
            className="mt-4 text-xl text-muted-foreground md:text-2xl"
            variants={itemVariants}
          >
            Sharpen your mental math skills with engaging, fast-paced quizzes.
            Track your progress and become a math whiz!
          </motion.p>
          <motion.div className="mt-8" variants={itemVariants}>
            <Link href="/quiz" prefetch={false}>
              <Button
                variant="default"
                className="group h-14  bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 active:scale-95"
              >
                Start Your Math Journey
                <Rocket className="ml-3 h-6 w-6 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="container mt-20 px-4 py-12 md:px-6">
        <motion.h2
          className="mb-12 text-center text-4xl font-extrabold text-foreground"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
        >
          Why TJMathHub?
        </motion.h2>
        <div className="grid gap-8 md:grid-cols-3">
          <motion.div
            className="rounded-2xl bg-card p-6 text-center shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <BrainCircuit className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Boost Your Brain
            </h3>
            <p className="text-muted-foreground">
              Engage in daily challenges to improve your mental agility and
              problem-solving speed.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl bg-card p-6 text-center shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Rocket className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Fast & Fun Gameplay
            </h3>
            <p className="text-muted-foreground">
              Enjoy a dynamic quiz experience with instant feedback and exciting
              animations.
            </p>
          </motion.div>
          <motion.div
            className="rounded-2xl bg-card p-6 text-center shadow-lg"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Trophy className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-semibold text-foreground">
              Track Your Progress
            </h3>
            <p className="text-muted-foreground">
              View your game history and see how you improve over time across
              different difficulties.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
