'use client';

import { motion } from 'framer-motion';
import { Card } from '../ui/card';

const features = [
  {
    title: 'Auto Updates',
    description: 'Never worry about outdated versions. Get the latest features instantly.',
    icon: '⚡',
  },
  {
    title: 'Secure Access',
    description: 'Licensed authentication ensures only paying users get access.',
    icon: '🔐',
  },
  {
    title: 'Premium Support',
    description: 'Direct Discord support from our dedicated team.',
    icon: '💬',
  },
  {
    title: 'Version History',
    description: 'Download any previous version you need.',
    icon: '📦',
  },
  {
    title: 'Easy Installation',
    description: 'One-click install and automatic setup.',
    icon: '✨',
  },
  {
    title: 'Community Driven',
    description: 'Voted features and active development.',
    icon: '👥',
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r
            from-purple-400 to-blue-400 bg-clip-text text-transparent"
        >
          Why Choose Us?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <Card key={i} delay={i * 0.1}>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-white/60">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
