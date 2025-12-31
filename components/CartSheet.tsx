"use client"

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, AnimatePresence } from "framer-motion"
import { useStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingBag } from "lucide-react"
import { CartDrawer } from "./layout/cart-drawer"

export function CartSheet() {
  const { getCartItemsCount } = useStore()
  const cartItemsCount = getCartItemsCount()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-stone-700 hover:text-stone-900 relative">
          <ShoppingBag className="w-5 h-5" />
          <AnimatePresence>
            {cartItemsCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-2 -right-2"
              >
                <Badge className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center p-0">
                  {cartItemsCount > 99 ? "99+" : cartItemsCount}
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0">
        <CartDrawer />
      </SheetContent>
    </Sheet>
  )
}
