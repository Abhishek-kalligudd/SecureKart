"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface CartItem {
  product: {
    id: string;
    name: string;
    price: number;
    is_digital?: boolean;
  };
  quantity: number;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [country, setCountry] = useState("IN");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 1. Get IDs from URL (e.g., ?ids=uuid1,uuid2)
    const idsParam = searchParams.get("ids");
    const selectedIds = idsParam ? idsParam.split(",") : [];

    fetch("/api/cart")
      .then((res) => res.json())
      .then((data: CartItem[]) => {
        if (selectedIds.length > 0) {
          // ✅ STRICT FILTER: Only keep items where product.id matches one of the selected UUIDs
          const filteredCart = data.filter((item) => 
            selectedIds.includes(item.product.id)
          );
          setCart(filteredCart);
        } else {
          // If no "ids" param exists in URL at all, assume full cart
          setCart(data);
        }
      })
      .catch(console.error);
  }, [searchParams]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 99 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user?.id ?? null,
        total_amount: total,
        item_count: cart.length,
        has_digital_product: cart.some((item) => item.product.is_digital),
        payment_method: paymentMethod,
        country: country,
        ip_address: "8.8.8.8",
        device_fingerprint: navigator.userAgent,
        is_new_user: !user,
      }),
    });

    const result = await response.json();

    if (result.decision === "BLOCKED") {
      alert(`Order not placed: ${result.ai_reason}`);
      setLoading(false);
      router.push("/");
      return;
    }

    alert("Checkout event logged");
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-serif mb-6">Checkout</h1>

      {/* Order Summary */}
      <div className="border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

        {cart.length === 0 ? (
          <p className="text-stone-500">No items selected for checkout.</p>
        ) : (
          cart.map((item, index) => (
            <div
              key={`${item.product.id}-${index}`}
              className="flex justify-between text-sm mb-2"
            >
              <div className="flex gap-2">
                  <span className="text-stone-500">{item.quantity}x</span>
                  <span>{item.product.name}</span>
              </div>
              <span>₹{(item.product.price * item.quantity).toLocaleString()}</span>
            </div>
          ))
        )}

        <div className="border-t pt-4 mt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{shipping}</span>
          </div>
          <div className="flex justify-between font-semibold mt-2 text-base">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="country">Country</Label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="IN">India</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="RU">Russia</option>
          </select>
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
        disabled={loading || cart.length === 0}
      >
        {loading ? "Processing..." : `Place Order (₹${total.toLocaleString()})`}
      </Button>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}