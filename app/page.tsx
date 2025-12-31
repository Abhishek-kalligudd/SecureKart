"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ProductCard } from "@/components/ui/product-card"
import { categories, getBestSellers, getNewArrivals } from "@/lib/data"
import { motion } from "framer-motion"
import { useState } from "react"

export default function Home() {
  const newArrivals = getNewArrivals()
  const bestSellers = getBestSellers()
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3)
  }

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1564406860401-1a35364fb9b9?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Summer Collection",
      subtitle: "Discover the latest trends for the season",
      cta: "Shop Now",
      link: "/category/new-arrivals",
    },
    {
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Premium Essentials",
      subtitle: "Timeless pieces for your wardrobe",
      cta: "Explore",
      link: "/category/essentials",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1673502752899-04caa9541a5c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Sale Up to 50% Off",
      subtitle: "Limited time offer on selected items",
      cta: "Shop Sale",
      link: "/category/sale",
    },
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {heroSlides.map((slide, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: currentSlide === index ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image src={slide.image || "/placeholder.svg"} alt={slide.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-black/30" />
          </motion.div>
        ))}

        <div className="absolute z-10 text-center text-white max-w-4xl mx-auto px-4">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 leading-tight">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 opacity-90">{heroSlides[currentSlide].subtitle}</p>
            <Link href={heroSlides[currentSlide].link}>
              <Button
                size="lg"
                className="bg-white text-stone-900 hover:bg-stone-100 px-8 py-3 rounded-full font-medium"
              >
                {heroSlides[currentSlide].cta}
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full ${currentSlide === index ? "bg-white" : "bg-white/50"}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        <button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-10"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </section>

      {/* Category Showcase */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif text-center mb-16 text-stone-900">Shop by Category</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl cursor-pointer"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="aspect-[4/5] relative">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h3 className="text-3xl font-serif text-white font-light">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif text-stone-900">New Arrivals</h2>
            <Link href="/category/new-arrivals">
              <Button variant="outline" className="rounded-full">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.slice(0, 6).map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-4xl font-serif text-stone-900">Best Sellers</h2>
            <Link href="/category/best-sellers">
              <Button variant="outline" className="rounded-full">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-stone-900 to-stone-800">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-serif text-white mb-4">Join the Inner Circle</h2>
            <p className="text-stone-300 mb-8 text-lg">Get VIP Access & 10% Off Your First Order</p>
            <div className="max-w-md mx-auto flex gap-4">
              <Input
                placeholder="Enter your email"
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-stone-400 rounded-full"
              />
              <Button className="bg-amber-500 hover:bg-amber-600 text-white px-8 rounded-full">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
