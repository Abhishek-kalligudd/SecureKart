"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, CreditCard, Smartphone, Truck, CheckCircle, Package } from "lucide-react"
import Image from "next/image"
import type { DeliveryAddress } from "@/lib/store"

export default function CheckoutPage() {
  const { cart, getCartTotal, isLoggedIn, addOrder } = useStore()
  const router = useRouter()

  const [step, setStep] = useState<"address" | "payment" | "success">("address")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState<string>("")

  const [address, setAddress] = useState<DeliveryAddress>({
    fullName: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
    landmark: "",
  })

  const [paymentMethod, setPaymentMethod] = useState<string>("upi")
  const [errors, setErrors] = useState<Partial<DeliveryAddress>>({})

  const subtotal = getCartTotal()
  const shipping = 99
  const total = subtotal + shipping

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/login?redirect=/checkout")
      return
    }

    if (cart.length === 0 && step !== "success") {
      router.push("/")
      return
    }
  }, [isLoggedIn, cart.length, step, router])

  const validateAddress = (): boolean => {
    const newErrors: Partial<DeliveryAddress> = {}

    if (!address.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!address.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    else if (!/^\d{10}$/.test(address.phoneNumber.replace(/\s/g, "")))
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
    if (!address.addressLine1.trim()) newErrors.addressLine1 = "Address is required"
    if (!address.city.trim()) newErrors.city = "City is required"
    if (!address.state.trim()) newErrors.state = "State is required"
    if (!address.pinCode.trim()) newErrors.pinCode = "PIN code is required"
    else if (!/^\d{6}$/.test(address.pinCode)) newErrors.pinCode = "Please enter a valid 6-digit PIN code"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddressSubmit = () => {
    if (validateAddress()) {
      setStep("payment")
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create order
    const newOrderId = addOrder({
      items: cart,
      total,
      deliveryAddress: address,
      paymentMethod,
    })

    setOrderId(newOrderId)
    setStep("success")
    setIsProcessing(false)
  }

  const paymentMethods = [
    {
      id: "upi",
      name: "UPI",
      description: "Pay using Google Pay, PhonePe, Paytm",
      icon: <Smartphone className="w-5 h-5" />,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      description: "Pay when your order arrives",
      icon: <Truck className="w-5 h-5" />,
    },
    {
      id: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, RuPay",
      icon: <CreditCard className="w-5 h-5" />,
    },
  ]

  if (step === "success") {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
          <Card className="text-center">
            <CardContent className="pt-8 pb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>

              <h1 className="text-2xl font-semibold text-stone-900 mb-2">Payment Successful!</h1>
              <p className="text-stone-600 mb-6">Your order has been confirmed and will be delivered soon.</p>

              <div className="bg-stone-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-stone-500 mb-1">Order ID</p>
                <p className="font-mono text-stone-900">{orderId}</p>
              </div>

              <div className="space-y-3">
                <Button onClick={() => router.push("/orders")} className="w-full" size="lg">
                  <Package className="w-4 h-4 mr-2" />
                  View My Orders
                </Button>
                <Button onClick={() => router.push("/")} variant="outline" className="w-full" size="lg">
                  Continue Shopping
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (step === "payment") setStep("address")
              else router.back()
            }}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-semibold">{step === "address" ? "Delivery Address" : "Payment Method"}</h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {step === "address" && (
                <motion.div
                  key="address"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Delivery Address</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            value={address.fullName}
                            onChange={(e) => {
                              setAddress({ ...address, fullName: e.target.value })
                              if (errors.fullName) setErrors({ ...errors, fullName: undefined })
                            }}
                            className={errors.fullName ? "border-red-500" : ""}
                          />
                          {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                          <Label htmlFor="phoneNumber">Phone Number *</Label>
                          <Input
                            id="phoneNumber"
                            value={address.phoneNumber}
                            onChange={(e) => {
                              setAddress({ ...address, phoneNumber: e.target.value })
                              if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: undefined })
                            }}
                            className={errors.phoneNumber ? "border-red-500" : ""}
                          />
                          {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="addressLine1">Address Line 1 *</Label>
                        <Input
                          id="addressLine1"
                          placeholder="House/Flat/Office No., Building Name"
                          value={address.addressLine1}
                          onChange={(e) => {
                            setAddress({ ...address, addressLine1: e.target.value })
                            if (errors.addressLine1) setErrors({ ...errors, addressLine1: undefined })
                          }}
                          className={errors.addressLine1 ? "border-red-500" : ""}
                        />
                        {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                      </div>

                      <div>
                        <Label htmlFor="addressLine2">Address Line 2</Label>
                        <Input
                          id="addressLine2"
                          placeholder="Street, Area, Colony (Optional)"
                          value={address.addressLine2}
                          onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City *</Label>
                          <Input
                            id="city"
                            value={address.city}
                            onChange={(e) => {
                              setAddress({ ...address, city: e.target.value })
                              if (errors.city) setErrors({ ...errors, city: undefined })
                            }}
                            className={errors.city ? "border-red-500" : ""}
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>

                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Input
                            id="state"
                            value={address.state}
                            onChange={(e) => {
                              setAddress({ ...address, state: e.target.value })
                              if (errors.state) setErrors({ ...errors, state: undefined })
                            }}
                            className={errors.state ? "border-red-500" : ""}
                          />
                          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>

                        <div>
                          <Label htmlFor="pinCode">PIN Code *</Label>
                          <Input
                            id="pinCode"
                            value={address.pinCode}
                            onChange={(e) => {
                              setAddress({ ...address, pinCode: e.target.value })
                              if (errors.pinCode) setErrors({ ...errors, pinCode: undefined })
                            }}
                            className={errors.pinCode ? "border-red-500" : ""}
                          />
                          {errors.pinCode && <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="landmark">Landmark</Label>
                        <Input
                          id="landmark"
                          placeholder="Nearby landmark (Optional)"
                          value={address.landmark}
                          onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleAddressSubmit} className="w-full" size="lg">
                        Continue to Payment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Method</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                        {paymentMethods.map((method) => (
                          <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value={method.id} id={method.id} />
                            <div className="flex items-center space-x-3 flex-1">
                              {method.icon}
                              <div>
                                <Label htmlFor={method.id} className="font-medium cursor-pointer">
                                  {method.name}
                                </Label>
                                <p className="text-sm text-stone-500">{method.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </RadioGroup>

                      <Button onClick={handlePayment} disabled={isProcessing} className="w-full mt-6" size="lg">
                        {isProcessing ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                            />
                            Processing Payment...
                          </>
                        ) : (
                          `Pay ₹${total.toLocaleString()}`
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item, index) => (
                  <div key={`${item.product.id}-${index}`} className="flex gap-3">
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
                      <h4 className="font-medium text-sm line-clamp-2">{item.product.name}</h4>
                      <div className="text-xs text-stone-500 space-y-1">
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                        <p>Qty: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>₹{shipping.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
