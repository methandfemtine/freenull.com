'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20 pointer-events-none" />

      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `linear-gradient(0deg, transparent 24%, rgba(120, 58, 237, .1) 25%, rgba(120, 58, 237, .1) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .1) 75%, rgba(120, 58, 237, .1) 76%, transparent 77%, transparent),
              linear-gradient(90deg, transparent 24%, rgba(120, 58, 237, .1) 25%, rgba(120, 58, 237, .1) 26%, transparent 27%, transparent 74%, rgba(120, 58, 237, .1) 75%, rgba(120, 58, 237, .1) 76%, transparent 77%, transparent)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-4xl mx-auto"
      >
        <motion.h1
          className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400
            bg-clip-text text-transparent leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Unlock Your Power
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 mb-8 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Experience the ultimate mod enhancement. Premium features, seamless updates, and instant access.
        </motion.p>

        <motion.div
          className="flex gap-4 justify-center flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Button variant="primary" onClick={() => window.location.href = 'https://discord.gg/your-discord'}>
            Join on Discord
          </Button>
          <Button variant="secondary" onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}>
            View Pricing
          </Button>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="absolute -top-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{ x: [0, 20, -20, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"
          animate={{ x: [0, -20, 20, 0], y: [0, -30, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, delay: 0.5 }}
        />
      </motion.div>
    </section>
  );
}
