'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Leaf, Sun, Droplets, Heart, Award, Users, Globe, TreeDeciduous } from 'lucide-react';

const timeline = [
  {
    year: '1952',
    title: 'The Beginning',
    description: 'Giovanni Olivetti plants his first olive grove in the rolling hills of Tuscany.',
  },
  {
    year: '1970',
    title: 'Family Expansion',
    description: 'Second generation joins the business, introducing organic farming practices.',
  },
  {
    year: '1995',
    title: 'International Recognition',
    description: 'First gold medal at the International Olive Oil Competition in Spain.',
  },
  {
    year: '2010',
    title: 'Modern Era',
    description: 'State-of-the-art cold press facility opens, preserving tradition with innovation.',
  },
  {
    year: '2020',
    title: 'Global Reach',
    description: 'Olivia Grove olive oils now shipped to over 40 countries worldwide.',
  },
];

const values = [
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'We practice regenerative agriculture, protecting our land for future generations.',
  },
  {
    icon: Heart,
    title: 'Quality First',
    description: 'Every bottle meets our rigorous standards for taste, purity, and freshness.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Supporting local farmers and artisans throughout our supply chain.',
  },
  {
    icon: Globe,
    title: 'Transparency',
    description: 'Full traceability from grove to bottle, so you know exactly what you are getting.',
  },
];

const stats = [
  { value: '70+', label: 'Years of Expertise' },
  { value: '500K', label: 'Bottles Produced Yearly' },
  { value: '40+', label: 'Countries Served' },
  { value: '100%', label: 'Customer Satisfaction' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-olive-50 pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1518977676601-b6f4b0aae3d7?w=1920&q=80')`,
          }}
        >
          <div className="absolute inset-0 bg-olive-900/60" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-olive-100 max-w-3xl mx-auto">
            Three generations of passion, tradition, and the pursuit of olive oil
            perfection.
          </p>
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">
                Our Mission
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-olive-800 leading-tight">
                Bringing the True Taste of the Mediterranean to Your Table
              </h2>
              <p className="mt-6 text-lg text-olive-600 leading-relaxed">
                At Olivia Grove, we believe that exceptional olive oil is more than
                just an ingredient &mdash; it is a celebration of nature, craftsmanship,
                and centuries of tradition. Our mission is to share the authentic
                flavors of our Mediterranean groves with families around the world.
              </p>
              <p className="mt-4 text-lg text-olive-600 leading-relaxed">
                From carefully selecting each olive variety to our meticulous
                cold-press process, every step is guided by our commitment to
                quality and sustainability. We honor the legacy of our founders
                while embracing innovation that enhances, never compromises, our
                oils.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"
                  alt="Olive harvesting"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-gold-500 text-white p-6 rounded-2xl shadow-xl">
                <TreeDeciduous className="w-10 h-10 mb-2" />
                <p className="font-serif font-bold text-2xl">Since 1952</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-olive-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <span className="block text-4xl md:text-5xl font-serif font-bold text-gold-400">
                  {stat.value}
                </span>
                <span className="mt-2 text-olive-200">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">
              Our Journey
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-olive-800">
              Milestones Through the Years
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-olive-200 -translate-x-1/2" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 pl-12 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                    <span className="text-gold-500 font-serif font-bold text-2xl">
                      {item.year}
                    </span>
                    <h3 className="mt-2 text-xl font-serif font-semibold text-olive-800">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-olive-600">{item.description}</p>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-gold-500 rounded-full -translate-x-1/2 border-4 border-olive-50" />

                  {/* Empty space for alternating layout */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold-600 font-medium uppercase tracking-wider text-sm">
              What We Stand For
            </span>
            <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-olive-800">
              Our Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-8 bg-olive-50 rounded-2xl"
              >
                <div className="inline-flex p-4 bg-gold-100 rounded-2xl mb-4">
                  <value.icon className="w-8 h-8 text-gold-600" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-olive-800 mb-2">
                  {value.title}
                </h3>
                <p className="text-olive-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
