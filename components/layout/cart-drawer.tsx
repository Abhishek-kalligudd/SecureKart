"use client"

import { useStore, type CartItem as CartItemType } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"

function CartItem({ item }: { item: CartItemType }) {
  const { updateQuantity, removeFromCart } = useStore()

  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1, item.size, item.color)
  }

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1, item.size, item.color)
    }
  }

  const handleRemove = () => {
    removeFromCart(item.product.id, item.size, item.color)
  }

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
        <div className="flex justify-between">
          <h4 className="font-medium text-stone-900 line-clamp-2">{item.product.name}</h4>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" onClick={handleRemove} className="h-8 w-8">
              <Trash2 className="h-4 w-4 text-stone-500" />
            </Button>
          </motion.div>
        </div>

        <div className="space-y-1 mt-1">
          {item.size && <p className="text-sm text-stone-500">Size: {item.size}</p>}
          {item.color && <p className="text-sm text-stone-500">Color: {item.color}</p>}
        </div>

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center border border-stone-200 rounded-full">
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </motion.div>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <motion.div whileTap={{ scale: 0.9 }}>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleIncrement}>
                <Plus className="h-3 w-3" />
              </Button>
            </motion.div>
          </div>

          <p className="font-semibold">₹{(item.product.price * item.quantity).toLocaleString()}</p>
        </div>
      </div>
    </motion.div>
  )
}

export function CartDrawer() {
  const { cart, getCartTotal } = useStore()
  const router = useRouter()

  const subtotal = getCartTotal()
  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping

  const handleCheckout = () => {
    router.push("/checkout")
  }

  return (
    <div className="flex flex-col h-full">
      <SheetHeader className="px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <SheetTitle className="text-xl font-semibold flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({cart.length})
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-6">
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center py-12"
          >
            <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
            <h3 className="text-xl font-medium text-stone-900 mb-2">Your cart is empty</h3>
            <p className="text-stone-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <SheetClose asChild>
              <Link href="/">
                <Button>Start Shopping</Button>
              </Link>
            </SheetClose>
          </motion.div>
        ) : (
          <div className="py-4">
            <AnimatePresence>
              {cart.map((item, index) => (
                <CartItem key={`${item.product.id}-${item.size}-${item.color}-${index}`} item={item} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

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
              <span>{shipping === 0 ? "Free" : `₹${shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-2">
            <SheetClose asChild>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </motion.div>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/cart">
                <Button variant="outline" className="w-full" size="lg">
                  View Full Cart
                </Button>
              </Link>
            </SheetClose>
          </div>
        </motion.div>
      )}
    </div>
  )
}
