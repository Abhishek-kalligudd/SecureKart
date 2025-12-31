"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"

interface CartItem {
  product: {
    id: string
    name: string
    price: number
    is_digital?: boolean
  }
  quantity: number
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [paymentMethod, setPaymentMethod] = useState("COD")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch("/api/cart")
      .then((res) => res.json())
      .then(setCart)
  }, [])

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const shipping = subtotal > 0 ? 99 : 0
  const total = subtotal + shipping

  const handlePlaceOrder = async () => {
    setLoading(true)

    // ✅ get logged-in user from frontend session
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const user_id = user?.id ?? null

    await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id,
        total_amount: total,
        item_count: cart.length,
        has_digital_product: cart.some(
          (item) => item.product.is_digital
        ),
        payment_method: paymentMethod,
        country: "IN",
        ip_address: "127.0.0.1",
        device_fingerprint: navigator.userAgent,
        is_new_user: !user,
      }),
    })

    alert("Checkout event logged")
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cart.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between text-sm mb-2"
          >
            <span>{item.product.name}</span>
            <span>₹{item.product.price}</span>
          </div>
        ))}

        <div className="border-t pt-4 mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="COD" id="cod" />
            <Label htmlFor="cod">Cash on Delivery</Label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <RadioGroupItem value="UPI" id="upi" />
            <Label htmlFor="upi">UPI</Label>
          </div>
          <div className="flex items-center space-x-2 mt-2">
            <RadioGroupItem value="CARD" id="card" />
            <Label htmlFor="card">Card</Label>
          </div>
        </RadioGroup>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>
    </div>
  )
}
