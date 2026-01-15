'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Home Chef',
    content:
      'The Extra Virgin olive oil from Olivia Grove has transformed my cooking. The flavor is incomparable - fruity, fresh, and absolutely delicious. I use it in everything!',
    rating: 5,
  },
  {
    name: 'Marco Rossi',
    role: 'Restaurant Owner',
    content:
      'As a professional chef, I demand the highest quality ingredients. Olivia Grove consistently delivers exceptional olive oil that my customers rave about.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    role: 'Food Blogger',
    content:
      'I have tried countless olive oils, and Olivia Grove stands out. The organic selection is my favorite - you can truly taste the difference of quality.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-olive-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-gold-400 font-medium uppercase tracking-wider text-sm">
            Testimonials
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-serif font-bold text-white">
            What Our Customers Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative bg-olive-700/50 backdrop-blur-sm rounded-2xl p-8 border border-olive-600/30"
            >
              {/* Quote Icon */}
              <Quote className="absolute top-6 right-6 w-10 h-10 text-gold-400/30" />

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-gold-400 fill-gold-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-olive-100 leading-relaxed mb-6">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold-500/20 rounded-full flex items-center justify-center">
                  <span className="text-gold-400 font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-olive-300 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
