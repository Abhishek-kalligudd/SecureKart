// D:\new_downloads\E-commerce-site-frontend-jsx-main\E-commerce-site-frontend-jsx-main\app\api\cart\route.ts
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Treat every product as quantity = 1
  const cartItems = data.map((product) => ({
    product,
    quantity: 1,
    size: null,
    color: null,
  }))

  return NextResponse.json(cartItems)
}
