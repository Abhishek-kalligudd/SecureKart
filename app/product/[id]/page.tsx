"use client"

import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import { getProductById, getBestSellers } from "@/lib/data"
import { useStore } from "@/lib/store"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Star, Heart, Minus, Plus } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { ProductCard } from "@/components/ui/product-card"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart, addToWishlist, wishlist, isLoggedIn } = useStore()

  const id = params.id as string
  const product = getProductById(id)
  const relatedProducts = getBestSellers().slice(0, 4)

  const [selectedSize, setSelectedSize] = useState<string | undefined>(product?.sizes?.[0])
  const [selectedColor, setSelectedColor] = useState<string | undefined>(product?.colors?.[0])
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const isInWishlist = wishlist.some((item) => item.id === product?.id)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-medium mb-4">Product not found</h1>
        <p className="text-stone-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push("/")}>Return to Home</Button>
      </div>
    )
  }

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (product) {
      setIsAddingToCart(true)
      await new Promise((resolve) => setTimeout(resolve, 500))
      addToCart(product, quantity, selectedSize, selectedColor)
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (product) {
      addToWishlist(product)
    }
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  // Generate multiple product images for the gallery
  const productImages = [
    product.image,
    "/placeholder.svg?height=500&width=400",
    "/placeholder.svg?height=500&width=400",
    "/placeholder.svg?height=500&width=400",
  ]

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-xl mb-4 bg-white">
              <motion.div
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full"
              >
                <Image
                  src={productImages[activeImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </motion.div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`aspect-square relative rounded-md overflow-hidden cursor-pointer bg-white ${
                    activeImage === index ? "ring-2 ring-amber-500" : ""
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${product.name} view ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-2xl p-8">
            <h1 className="text-3xl font-serif mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-stone-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-stone-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="text-3xl font-semibold mb-6 text-stone-900">₹{product.price.toLocaleString()}</div>

            <p className="text-stone-600 mb-8 leading-relaxed">{product.description}</p>

            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Color</h3>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 transition-all ${
                        selectedColor === color
                          ? "border-amber-500 scale-110"
                          : "border-stone-300 hover:border-stone-400"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </div>
                {selectedColor && <p className="text-sm text-stone-600 mt-2">Selected: {selectedColor}</p>}
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <h3 className="font-medium mb-3">Size</h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <div key={size} className="flex items-center">
                      <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                      <Label
                        htmlFor={`size-${size}`}
                        className="flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 text-sm font-medium cursor-pointer transition-all peer-checked:bg-stone-900 peer-checked:text-white peer-checked:border-stone-900 hover:border-stone-400"
                      >
                        {size}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {selectedSize && <p className="text-sm text-stone-600 mt-2">Selected: {selectedSize}</p>}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center border border-stone-200 rounded-lg w-fit">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={incrementQuantity}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 text-lg"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : null}
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToWishlist}
                  className={`h-12 w-12 ${isInWishlist ? "text-red-500 border-red-500" : ""}`}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? "fill-red-500" : ""}`} />
                </Button>
              </motion.div>
            </div>

            {/* Product Features */}
            <div className="border-t border-stone-200 pt-6">
              <h3 className="font-medium mb-3">Product Features</h3>
              <ul className="space-y-2 text-sm text-stone-600">
                <li>• Premium quality materials</li>
                <li>• Comfortable fit</li>
                <li>• Easy care instructions</li>
                <li>• 30-day return policy</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-serif mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
