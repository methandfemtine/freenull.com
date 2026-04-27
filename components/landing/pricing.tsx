'use client';

import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

export function Pricing() {
  return (
    <section id="pricing" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r
            from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Simple Pricing
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Starter */}
          <Card className="flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Starter</h3>
            <p className="text-white/60 mb-6 flex-grow">Perfect for trying it out</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$5</span>
              <span className="text-white/60">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="text-white/80">✓ Auto updates</li>
              <li className="text-white/80">✓ Latest version</li>
              <li className="text-white/80">✓ Discord support</li>
            </ul>
            <Button variant="primary" className="w-full" onClick={() => window.location.href = 'https://discord.gg/your-discord'}>
              Get Started
            </Button>
          </Card>

          {/* Pro (Highlighted) */}
          <Card className="md:scale-105 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                POPULAR
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
            <p className="text-white/60 mb-6 flex-grow">Most popular choice</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$10</span>
              <span className="text-white/60">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="text-white/80">✓ Everything in Starter</li>
              <li className="text-white/80">✓ Priority support</li>
              <li className="text-white/80">✓ Beta features</li>
              <li className="text-white/80">✓ Version history</li>
            </ul>
            <Button variant="primary" className="w-full" onClick={() => window.location.href = 'https://discord.gg/your-discord'}>
              Start Free Trial
            </Button>
          </Card>

          {/* Elite */}
          <Card className="flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Elite</h3>
            <p className="text-white/60 mb-6 flex-grow">For power users</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$20</span>
              <span className="text-white/60">/month</span>
            </div>
            <ul className="space-y-3 mb-8 flex-grow">
              <li className="text-white/80">✓ Everything in Pro</li>
              <li className="text-white/80">✓ Private Discord channel</li>
              <li className="text-white/80">✓ Custom configs</li>
              <li className="text-white/80">✓ Lifetime updates</li>
            </ul>
            <Button variant="primary" className="w-full" onClick={() => window.location.href = 'https://discord.gg/your-discord'}>
              Upgrade Now
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
}
