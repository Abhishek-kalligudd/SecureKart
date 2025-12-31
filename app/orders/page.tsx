"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Package, MapPin, CreditCard, Calendar, ArrowLeft, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function OrdersPage() {
  const { orders, isLoggedIn } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/orders")
    }
  }, [isLoggedIn, router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-yellow-100 text-yellow-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date))
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Package className="w-16 h-16 text-stone-300 mx-auto mb-4" />
            <h2 className="text-xl font-medium text-stone-900 mb-2">No orders yet</h2>
            <p className="text-stone-600 mb-6">When you place your first order, it will appear here.</p>
            <Link href="/">
              <Button>
                <ShoppingBag className="w-4 h-4 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg">Order #{order.id.slice(-8).toUpperCase()}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-stone-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(order.orderDate)}
                          </div>
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            {order.items.length} {order.items.length === 1 ? "item" : "items"}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-2">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                        <p className="text-lg font-semibold">₹{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium mb-3">Items Ordered</h4>
                      <div className="space-y-3">
                        {order.items.map((item, itemIndex) => (
                          <div key={`${item.product.id}-${itemIndex}`} className="flex gap-3">
                            <div className="w-16 h-16 relative rounded-md overflow-hidden flex-shrink-0">
                              <Image
                                src={item.product.image || "/placeholder.svg"}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-sm line-clamp-2">{item.product.name}</h5>
                              <div className="text-xs text-stone-500 space-y-1 mt-1">
                                {item.size && <p>Size: {item.size}</p>}
                                {item.color && <p>Color: {item.color}</p>}
                                <p>Quantity: {item.quantity}</p>
                              </div>
                              <p className="font-semibold text-sm mt-1">
                                ₹{(item.product.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Delivery Address
                      </h4>
                      <div className="bg-stone-50 rounded-lg p-3 text-sm">
                        <p className="font-medium">{order.deliveryAddress.fullName}</p>
                        <p>{order.deliveryAddress.phoneNumber}</p>
                        <p className="mt-1">
                          {order.deliveryAddress.addressLine1}
                          {order.deliveryAddress.addressLine2 && `, ${order.deliveryAddress.addressLine2}`}
                        </p>
                        <p>
                          {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}
                        </p>
                        {order.deliveryAddress.landmark && <p>Landmark: {order.deliveryAddress.landmark}</p>}
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Payment Method
                      </h4>
                      <p className="text-sm bg-stone-50 rounded-lg p-3">
                        {order.paymentMethod === "upi" && "UPI Payment"}
                        {order.paymentMethod === "cod" && "Cash on Delivery"}
                        {order.paymentMethod === "card" && "Credit/Debit Card"}
                      </p>
                    </div>

                    {/* Estimated Delivery */}
                    {order.status !== "delivered" && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          <strong>Estimated Delivery:</strong> {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
