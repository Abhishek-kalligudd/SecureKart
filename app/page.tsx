"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ProductCard } from "@/components/ui/product-card"
import { categories } from "@/lib/data"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

export default function Home() {
  const [products, setProducts] = useState<any[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(console.error)
  }, [])

  const newArrivals = products.slice(0, 15)
  const bestSellers = products.slice(0, 15)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 3)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 3) % 3)
  }

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1564406860401-1a35364fb9b9",
      title: "Summer Collection",
      subtitle: "Discover the latest trends for the season",
      cta: "Shop Now",
      link: "/category/new-arrivals",
    },
    {
      image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891",
      title: "Premium Essentials",
      subtitle: "Timeless pieces for your wardrobe",
      cta: "Explore",
      link: "/category/essentials",
    },
    {
      image: "https://plus.unsplash.com/premium_photo-1673502752899-04caa9541a5c",
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
            <Image src={slide.image} alt={slide.title} fill className="object-cover" priority />
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
            <h1 className="text-5xl md:text-7xl font-serif mb-6">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl mb-8">{heroSlides[currentSlide].subtitle}</p>
            <Link href={heroSlides[currentSlide].link}>
              <Button size="lg" className="bg-white text-stone-900 rounded-full">
                {heroSlides[currentSlide].cta}
              </Button>
            </Link>
          </motion.div>
        </div>

        <button onClick={prevSlide} className="absolute left-4 top-1/2 text-white">
          <ChevronLeft size={32} />
        </button>

        <button onClick={nextSlide} className="absolute right-4 top-1/2 text-white">
          <ChevronRight size={32} />
        </button>
      </section>

      {/* New Arrivals */}
      <section className="py-20 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif mb-12">New Arrivals</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.image || "/placeholder.svg",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-serif mb-12">Best Sellers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.image || "/placeholder.svg",
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-stone-900 text-white text-center">
        <h2 className="text-4xl font-serif mb-4">Join the Inner Circle</h2>
        <p className="mb-8">Get VIP Access & 10% Off</p>
        <div className="max-w-md mx-auto flex gap-4">
          <Input placeholder="Email" className="rounded-full" />
          <Button className="rounded-full">Subscribe</Button>
        </div>
      </section>
    </div>
  )
}
