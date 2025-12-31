import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Product = {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  sizes?: string[]
  colors?: string[]
}

export type CartItem = {
  product: Product
  quantity: number
  size?: string
  color?: string
}

export type User = {
  name: string
  email: string
  avatar?: string
}

export type DeliveryAddress = {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  pinCode: string
  landmark?: string
}

export type Order = {
  id: string
  items: CartItem[]
  total: number
  deliveryAddress: DeliveryAddress
  paymentMethod: string
  orderDate: Date
  status: "confirmed" | "shipped" | "delivered"
  estimatedDelivery: Date
}

type StoreState = {
  cart: CartItem[]
  wishlist: Product[]
  user: User | null
  isLoggedIn: boolean
  isCartOpen: boolean
  isMenuOpen: boolean
  orders: Order[]

  // Cart actions
  addToCart: (product: Product, quantity: number, size?: string, color?: string) => void
  removeFromCart: (productId: string, size?: string, color?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number

  // Wishlist actions
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void

  // Auth actions
  login: (user: User) => void
  logout: () => void

  // Order actions
  addOrder: (order: Omit<Order, "id" | "orderDate" | "status" | "estimatedDelivery">) => void
  getOrderById: (id: string) => Order | undefined

  // UI actions
  toggleCart: () => void
  toggleMenu: () => void
  setCartOpen: (open: boolean) => void
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],
      user: null,
      isLoggedIn: false,
      isCartOpen: false,
      isMenuOpen: false,
      orders: [],

      // Cart actions
      addToCart: (product, quantity, size, color) =>
        set((state) => {
          const existingItemIndex = state.cart.findIndex(
            (item) => item.product.id === product.id && item.size === size && item.color === color,
          )

          if (existingItemIndex >= 0) {
            const updatedCart = [...state.cart]
            updatedCart[existingItemIndex] = {
              ...updatedCart[existingItemIndex],
              quantity: updatedCart[existingItemIndex].quantity + quantity,
            }
            return { cart: updatedCart }
          }

          return {
            cart: [...state.cart, { product, quantity, size, color }],
          }
        }),

      removeFromCart: (productId, size, color) =>
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.product.id === productId && item.size === size && item.color === color),
          ),
        })),

      updateQuantity: (productId, quantity, size, color) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.product.id === productId && item.size === size && item.color === color ? { ...item, quantity } : item,
          ),
        })),

      clearCart: () => set({ cart: [] }),

      getCartTotal: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.product.price * item.quantity, 0)
      },

      getCartItemsCount: () => {
        const { cart } = get()
        return cart.reduce((total, item) => total + item.quantity, 0)
      },

      // Wishlist actions
      addToWishlist: (product) =>
        set((state) => {
          if (state.wishlist.some((item) => item.id === product.id)) {
            return state
          }
          return { wishlist: [...state.wishlist, product] }
        }),

      removeFromWishlist: (productId) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== productId),
        })),

      // Auth actions
      login: (user) => set({ user, isLoggedIn: true }),
      logout: () => set({ user: null, isLoggedIn: false, cart: [], wishlist: [], orders: [] }),

      // Order actions
      addOrder: (orderData) =>
        set((state) => {
          const newOrder: Order = {
            ...orderData,
            id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            orderDate: new Date(),
            status: "confirmed",
            estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          }
          return {
            orders: [newOrder, ...state.orders],
            cart: [], // Clear cart after order
          }
        }),

      getOrderById: (id) => {
        const { orders } = get()
        return orders.find((order) => order.id === id)
      },

      // UI actions
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
      setCartOpen: (open) => set({ isCartOpen: open }),
    }),
    {
      name: "luxe-store",
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        orders: state.orders,
      }),
    },
  ),
)
