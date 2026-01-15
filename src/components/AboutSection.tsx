'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Sun, Droplets, Heart } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Hand-Picked',
    description: 'Every olive is carefully selected at peak ripeness for optimal flavor.',
  },
  {
    icon: Sun,
    title: 'Sun-Ripened',
    description: 'Grown under the warm Mediterranean sun in our family groves.',
  },
  {
    icon: Droplets,
    title: 'Cold-Pressed',
    description: 'Extracted within hours of harvest to preserve freshness.',
  },
  {
    icon: Heart,
    title: 'Family Tradition',
    description: 'Three generations of olive oil craftsmanship since 1952.',
  },
];

export default function AboutSection() {
  return (
    <section className="py-24 bg-olive-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1518977676601-b6f4b0aae3d7?w=800&q=80"
                alt="Olive grove"
                fill
                className="object-cover"
              />
            </div>
            {/* Decorative Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-xl"
            >
              <div className="text-center">
                <span className="block text-5xl font-serif font-bold text-gold-500">
                  70+
                </span>
                <span className="text-olive-600 font-medium">Years of Excellence</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">
              Our Story
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-olive-800 leading-tight">
              Rooted in Tradition,
              <br />
              Crafted with Love
            </h2>
            <p className="mt-6 text-lg text-olive-600 leading-relaxed">
              For over seven decades, the Olivia Grove family has been cultivating
              olives in the sun-drenched hills of the Mediterranean. What began as
              a small family operation has blossomed into a celebrated producer of
              premium olive oils.
            </p>
            <p className="mt-4 text-lg text-olive-600 leading-relaxed">
              We believe in honoring the land and the ancient traditions passed down
              through generations. Every bottle captures the essence of our groves:
              pure, natural, and exceptionally delicious.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 mt-10">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="p-3 bg-gold-100 rounded-xl">
                    <feature.icon className="w-6 h-6 text-gold-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-olive-800">{feature.title}</h3>
                    <p className="text-sm text-olive-600 mt-1">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
