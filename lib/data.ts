import type { Product } from "./store"

export const products: Product[] = [
  {
    id: "1",
    name: "Italian Linen Blazer",
    price: 3499,
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
    category: "men",
    description:
      "Premium Italian linen blazer with a tailored fit. Perfect for summer events and casual business meetings.",
    rating: 4.8,
    reviews: 124,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Beige", "Navy", "Black"],
  },
  {
    id: "2",
    name: "Silk Midi Dress",
    price: 2899,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop",
    category: "women",
    description:
      "Elegant silk midi dress with a flattering silhouette. Features a subtle floral pattern and adjustable straps.",
    rating: 4.9,
    reviews: 89,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Ivory", "Rose", "Emerald"],
  },
  {
    id: "3",
    name: "Cashmere Sweater",
    price: 4299,
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&h=500&fit=crop",
    category: "men",
    description: "Ultra-soft cashmere sweater with ribbed cuffs and hem. Provides exceptional warmth without the bulk.",
    rating: 4.7,
    reviews: 156,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Camel", "Burgundy"],
  },
  {
    id: "4",
    name: "Leather Handbag",
    price: 5999,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=500&fit=crop",
    category: "accessories",
    description:
      "Handcrafted leather handbag with gold-tone hardware. Features multiple compartments and a detachable shoulder strap.",
    rating: 4.9,
    reviews: 203,
    colors: ["Tan", "Black", "Brown"],
  },
  {
    id: "5",
    name: "Cotton Oxford Shirt",
    price: 1899,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop",
    category: "men",
    description: "Classic Oxford shirt made from premium cotton. Features a button-down collar and a relaxed fit.",
    rating: 4.6,
    reviews: 178,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Blue", "Pink"],
  },
  {
    id: "6",
    name: "Pleated Maxi Skirt",
    price: 2499,
    image: "https://plus.unsplash.com/premium_photo-1671379102281-7225f3d3d97d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "women",
    description:
      "Elegant pleated maxi skirt with a comfortable elastic waistband. Perfect for both casual and formal occasions.",
    rating: 4.7,
    reviews: 92,
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Navy", "Cream"],
  },
  {
    id: "7",
    name: "Kids Denim Jacket",
    price: 1299,
    image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=500&fit=crop",
    category: "kids",
    description:
      "Durable denim jacket for kids with soft cotton lining. Features adjustable cuffs and multiple pockets.",
    rating: 4.8,
    reviews: 65,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    colors: ["Blue", "Light Wash"],
  },
  {
    id: "8",
    name: "Leather Wallet",
    price: 1499,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=500&fit=crop",
    category: "accessories",
    description: "Slim leather wallet with RFID protection. Features multiple card slots and a bill compartment.",
    rating: 4.9,
    reviews: 211,
    colors: ["Black", "Brown", "Tan"],
  },
  {
    id: "9",
    name: "Wool Blend Coat",
    price: 6999,
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=500&fit=crop",
    category: "women",
    description:
      "Luxurious wool blend coat with a tailored fit. Features a notched collar and a double-breasted front.",
    rating: 4.8,
    reviews: 87,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Camel", "Black", "Grey"],
  },
  {
    id: "10",
    name: "Kids Cotton T-Shirt",
    price: 699,
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=500&fit=crop",
    category: "kids",
    description:
      "Soft cotton t-shirt for kids with a playful graphic print. Features a comfortable crew neck and short sleeves.",
    rating: 4.7,
    reviews: 103,
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    colors: ["White", "Blue", "Yellow"],
  },
  {
    id: "11",
    name: "Silk Scarf",
    price: 1299,
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400&h=500&fit=crop",
    category: "accessories",
    description: "Luxurious silk scarf with a vibrant print. Perfect for adding a pop of color to any outfit.",
    rating: 4.8,
    reviews: 76,
    colors: ["Multicolor", "Blue", "Red"],
  },
  {
    id: "12",
    name: "Slim Fit Chinos",
    price: 1999,
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
    category: "men",
    description:
      "Versatile slim fit chinos made from stretch cotton. Features a comfortable waistband and a clean finish.",
    rating: 4.6,
    reviews: 142,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Khaki", "Navy", "Olive"],
  },
]

export const categories = [
  {
    name: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
  },
  {
    name: "Women",
    slug: "women",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop",
  },
  {
    name: "Kids",
    slug: "kids",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=400&h=600&fit=crop",
  },
  {
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop",
  },
]

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category === category.toLowerCase())
}

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getNewArrivals = (): Product[] => {
  // In a real app, you might filter by date or a "new" flag
  return products.slice(0, 6)
}

export const getBestSellers = (): Product[] => {
  // In a real app, you might sort by sales count
  return [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 4)
}
