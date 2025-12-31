"use client"

import { Search, Heart, ShoppingBag, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartDrawer } from "./cart-drawer"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Men", href: "/category/men" },
  { name: "Women", href: "/category/women" },
  { name: "Kids", href: "/category/kids" },
  { name: "Accessories", href: "/category/accessories" },
  { name: "Sale", href: "/category/sale", highlight: true },
  { name: "My Orders", href: "/orders", requiresAuth: true },
]

export function Header() {
  const { getCartItemsCount, isLoggedIn, user, setCartOpen } = useStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  const cartItemsCount = getCartItemsCount()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <motion.h1
                className="text-2xl font-serif font-bold text-stone-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                TEJA
              </motion.h1>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => {
                if (link.requiresAuth && !isLoggedIn) return null
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative text-stone-700 hover:text-stone-900 transition-colors font-medium ${
                      link.highlight ? "text-amber-600" : ""
                    } ${pathname === link.href ? "text-stone-900" : ""}`}
                  >
                    {link.name}
                    {pathname === link.href && (
                      <motion.div
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-stone-900"
                        layoutId="underline"
                      />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                <Input
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full border-stone-300 focus:border-amber-500 w-64"
                />
              </div>

              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="text-stone-700 hover:text-stone-900 relative">
                  <Heart className="w-5 h-5" />
                </Button>
              </Link>

              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-stone-700 hover:text-stone-900 relative"
                    onClick={() => setCartOpen(true)}
                  >
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

              <Link href={isLoggedIn ? "/profile" : "login"}>
                <Button variant="ghost" size="icon" className="text-stone-700 hover:text-stone-900">
                  {isLoggedIn && user?.avatar ? (
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </Button>
              </Link>

              {/* Mobile menu button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center mb-8">
                      <h2 className="text-2xl font-serif font-bold">TEJA</h2>
                    </div>
                    <nav className="flex flex-col space-y-4">
                      {navLinks.map((link) => (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`text-lg font-medium ${
                            link.highlight ? "text-amber-600" : "text-stone-900"
                          } ${pathname === link.href ? "font-semibold" : ""}`}
                        >
                          {link.name}
                        </Link>
                      ))}
                    </nav>
                    {isLoggedIn && (
                      <Link href="/orders" className="text-lg font-medium text-stone-900">
                        My Orders
                      </Link>
                    )}
                    <div className="mt-auto pt-8 border-t border-stone-200">
                      <Link href={isLoggedIn ? "/profile" : "login"}>
                        <Button variant="outline" className="w-full justify-start">
                          <User className="w-4 h-4 mr-2" />
                          {isLoggedIn ? "My Profile" : "Sign In / Register"}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
