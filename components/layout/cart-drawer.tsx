"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"

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

interface CartItemProps {
  item: CartItemType
  isSelected: boolean
  onToggle: (checked: boolean) => void
}

function CartItem({ item, isSelected, onToggle }: CartItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-4 border-b border-stone-200 items-start"
    >
      <div className="flex items-center h-24">
        <Checkbox 
          checked={isSelected}
          onCheckedChange={(checked) => onToggle(checked as boolean)}
        />
      </div>

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
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])
  const router = useRouter()

  // Generate a unique key for the UI loop
  const getItemKey = (item: CartItemType, index: number) => `${item.product.id}-${index}`

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then((data) => {
        setCart(data)
        // Default: Select all items
        setSelectedKeys(data.map((item: CartItemType, index: number) => getItemKey(item, index)))
      })
      .catch(console.error)
  }, [])

  const toggleItem = (key: string, isSelected: boolean) => {
    setSelectedKeys((prev) =>
      isSelected ? [...prev, key] : prev.filter((k) => k !== key)
    )
  }

  const subtotal = cart.reduce((sum, item, index) => {
    const key = getItemKey(item, index)
    if (selectedKeys.includes(key)) {
      return sum + item.product.price * item.quantity
    }
    return sum
  }, 0)

  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping

  const handleCheckout = () => {
    if (selectedKeys.length > 0) {
      // ✅ FIX: Extract the real UUIDs from the keys (removing the -index suffix)
      // e.g., "550e8400-e29b...-0" becomes "550e8400-e29b..."
      const rawIds = selectedKeys.map(key => {
        const parts = key.split('-');
        // Remove the last part (index) and rejoin the rest (UUID)
        parts.pop(); 
        return parts.join('-');
      });

      // Join with commas and send to checkout
      const uniqueIds = Array.from(new Set(rawIds)).join(",");
      router.push(`/checkout?ids=${uniqueIds}`);
    }
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
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <ShoppingBag className="h-16 w-16 text-stone-300 mb-4" />
            <h3 className="text-xl font-medium text-stone-900 mb-2">Cart is empty</h3>
            <Link href="/"><Button>Go Back</Button></Link>
          </div>
        ) : (
          <div className="py-4">
            <AnimatePresence>
              {cart.map((item, index) => {
                const key = getItemKey(item, index)
                return (
                  <CartItem
                    key={key}
                    item={item}
                    isSelected={selectedKeys.includes(key)}
                    onToggle={(checked) => toggleItem(key, checked)}
                  />
                )
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {cart.length > 0 && (
        <div className="border-t border-stone-200 p-6">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-semibold pt-2 border-t border-stone-200">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>
          <Button 
            className="w-full" 
            size="lg" 
            onClick={handleCheckout}
            disabled={selectedKeys.length === 0}
          >
            Proceed to Checkout ({selectedKeys.length})
          </Button>
        </div>
      )}
    </div>
  )
}

export function CartSheet() {
  const { getCartItemsCount } = useStore()
  const cartItemsCount = getCartItemsCount()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-stone-700 hover:text-stone-900 relative">
          <ShoppingBag className="w-5 h-5" />
          {cartItemsCount > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
              {cartItemsCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <CartDrawer />
      </SheetContent>
    </Sheet>
  )
}