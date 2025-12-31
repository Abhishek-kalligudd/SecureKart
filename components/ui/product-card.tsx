"use client"

import type React from "react"
import { Heart, ShoppingBag, Star, Check } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { type Product, useStore } from "@/lib/store"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ProductCardProps {
  product: Product
  featured?: boolean
}

export function ProductCard({ product, featured = false }: ProductCardProps) {
  const { addToCart, addToWishlist, wishlist, isLoggedIn } = useStore()
  const [isHovered, setIsHovered] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)
  const router = useRouter()

  const isInWishlist = wishlist.some((item) => item.id === product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    setIsAddingToCart(true)

    // Simulate adding to cart delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    addToCart(product, 1)
    setIsAddingToCart(false)
    setShowAddedFeedback(true)

    // Hide feedback after 2 seconds
    setTimeout(() => setShowAddedFeedback(false), 2000)
  }

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()

    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    addToWishlist(product)
  }

  const handleClick = () => {
    router.push(`/product/${product.id}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer relative",
        featured ? "p-0" : "",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="aspect-[4/5] relative overflow-hidden">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Wishlist Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: isHovered || isInWishlist ? 1 : 0,
            scale: isHovered || isInWishlist ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
          className="absolute top-4 right-4"
        >
          <Button
            size="icon"
            variant="ghost"
            className={cn(
              "bg-white/80 hover:bg-white text-stone-700 rounded-full backdrop-blur-sm",
              isInWishlist ? "text-red-500" : "",
            )}
            onClick={handleAddToWishlist}
          >
            <Heart className={cn("w-4 h-4", isInWishlist ? "fill-red-500" : "")} />
          </Button>
        </motion.div>

        {/* Added to Cart Feedback */}
        <AnimatePresence>
          {showAddedFeedback && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-green-500/90 flex items-center justify-center"
            >
              <div className="text-white text-center">
                <Check className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Added to Cart!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6">
        <h3 className="font-medium text-stone-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-stone-600">({product.reviews}+)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold text-stone-900">₹{product.price.toLocaleString()}</span>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="sm"
              disabled={isAddingToCart}
              className="bg-stone-900 hover:bg-stone-800 text-white rounded-full px-6 disabled:opacity-50"
              onClick={handleAddToCart}
            >
              {isAddingToCart ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
