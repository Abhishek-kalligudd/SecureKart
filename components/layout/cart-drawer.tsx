"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useEffect, useState } from "react"

export interface CartItemType {
  product: {
    id: string
    name: string
    price: number
    image?: string
    is_digital?: boolean
  }
  quantity: number
  size?: string | null
  color?: string | null
}

function CartItem({ item }: { item: CartItemType }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-4 border-b border-stone-200"
    >
      <div className="w-20 h-24 relative rounded-md overflow-hidden flex-shrink-0">
        <Image
          src={item.product.image || "/placeholder.svg"}
          alt={item.product.name}
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>

      <div className="flex-1">
        <h4 className="font-medium text-stone-900 line-clamp-2">
          {item.product.name}
        </h4>

        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-stone-500">
            Quantity: {item.quantity}
          </span>
          <p className="font-semibold">
            ₹{(item.product.price * item.quantity).toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export function CartDrawer() {
  const [cart, setCart] = useState<CartItemType[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => setCart(data))
      .catch(console.error)
  }, [])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <SheetHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-xl font-semibold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({cart.length})
          </SheetTitle>

          {/* ✅ ONLY CLOSE BUTTON */}
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-6">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
            <h3 className="text-xl font-medium text-stone-900 mb-2">
              Cart is empty
            </h3>
            <p className="text-stone-500 mb-6">
              No products available right now.
            </p>

            <Link href="/">
              <Button>Go Back</Button>
            </Link>
          </motion.div>
        ) : (
          <div className="py-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <CartItem
                  key={`${item.product.id}-${index}`}
                  item={item}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-stone-200 p-6"
        >
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Shipping</span>
              <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button className="w-full" size="lg" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
