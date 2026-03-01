export interface Product {
  id: string
  name: string
  category: 'equipment' | 'supplements' | 'clothes'
  price: number
  originalPrice?: number
  image: string
  description: string
  rating: number
  reviews: number
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: string
  image: string
}

export interface Order {
  id: string
  date: string
  status: 'completed' | 'processing' | 'shipped'
  items: Array<{ product: string; quantity: number; price: number }>
  total: number
}

export interface Booking {
  id: string
  service: string
  date: string
  time: string
  status: 'completed' | 'upcoming' | 'cancelled'
}

// Products Data
export const products: Product[] = [
  {
    id: '1',
    name: 'Adjustable Dumbbell Set',
    category: 'equipment',
    price: 299.99,
    image: '/placeholder.svg',
    description: 'Professional adjustable dumbbells with range from 5-50 lbs',
    rating: 4.8,
    reviews: 156,
  },
  {
    id: '2',
    name: 'Olympic Weight Barbell',
    category: 'equipment',
    price: 199.99,
    image: '/placeholder.svg',
    description: '45 lb Olympic barbell with chrome finish',
    rating: 4.9,
    reviews: 89,
  },
  {
    id: '3',
    name: 'Yoga Mat Pro',
    category: 'equipment',
    price: 49.99,
    image: '/placeholder.svg',
    description: 'Non-slip yoga mat with carrying strap, 6mm thickness',
    rating: 4.6,
    reviews: 234,
  },
  {
    id: '4',
    name: 'Protein Powder - Chocolate',
    category: 'supplements',
    price: 39.99,
    originalPrice: 49.99,
    image: '/placeholder.svg',
    description: 'Whey protein isolate, 25g per serving',
    rating: 4.7,
    reviews: 412,
  },
  {
    id: '5',
    name: 'BCAA Energy Drink',
    category: 'supplements',
    price: 24.99,
    image: '/placeholder.svg',
    description: 'Branch chain amino acids with electrolytes',
    rating: 4.5,
    reviews: 178,
  },
  {
    id: '6',
    name: 'Creatine Monohydrate',
    category: 'supplements',
    price: 19.99,
    image: '/placeholder.svg',
    description: 'Pure creatine monohydrate powder, unflavored',
    rating: 4.8,
    reviews: 267,
  },
  {
    id: '7',
    name: 'Performance Athletic Shirt',
    category: 'clothes',
    price: 44.99,
    image: '/placeholder.svg',
    description: 'Moisture-wicking athletic shirt for gym workouts',
    rating: 4.6,
    reviews: 198,
  },
  {
    id: '8',
    name: 'Training Shorts',
    category: 'clothes',
    price: 54.99,
    image: '/placeholder.svg',
    description: 'Breathable training shorts with pockets',
    rating: 4.7,
    reviews: 145,
  },
  {
    id: '9',
    name: 'Sports Leggings',
    category: 'clothes',
    price: 74.99,
    image: '/placeholder.svg',
    description: 'High-waisted compression leggings',
    rating: 4.8,
    reviews: 321,
  },
  {
    id: '10',
    name: 'Resistance Bands Set',
    category: 'equipment',
    price: 29.99,
    image: '/placeholder.svg',
    description: 'Set of 5 resistance bands with different resistance levels',
    rating: 4.5,
    reviews: 189,
  },
  {
    id: '11',
    name: 'Foam Roller',
    category: 'equipment',
    price: 34.99,
    image: '/placeholder.svg',
    description: 'Self-myofascial release tool, 36 inches',
    rating: 4.6,
    reviews: 212,
  },
  {
    id: '12',
    name: 'Jump Rope',
    category: 'equipment',
    price: 19.99,
    image: '/placeholder.svg',
    description: 'Speed jump rope with adjustable length',
    rating: 4.4,
    reviews: 167,
  },
]

// Services Data
export const services: Service[] = [
  {
    id: 's1',
    name: 'Personal Training Session',
    description: 'One-on-one training with a certified fitness coach',
    price: 75,
    duration: '1 hour',
    image: '/placeholder.svg',
  },
  {
    id: 's2',
    name: 'Group Fitness Class',
    description: 'High-energy group classes including HIIT, Yoga, and Zumba',
    price: 25,
    duration: '45 minutes',
    image: '/placeholder.svg',
  },
  {
    id: 's3',
    name: 'Nutrition Consultation',
    description: 'Personalized nutrition plan with a registered dietitian',
    price: 100,
    duration: '1 hour',
    image: '/placeholder.svg',
  },
  {
    id: 's4',
    name: 'Body Composition Analysis',
    description: 'DEXA scan and detailed body composition report',
    price: 150,
    duration: '30 minutes',
    image: '/placeholder.svg',
  },
  {
    id: 's5',
    name: 'Gym Membership - Monthly',
    description: 'Full access to all gym facilities and equipment',
    price: 49.99,
    duration: '1 month',
    image: '/placeholder.svg',
  },
  {
    id: 's6',
    name: 'Gym Membership - Yearly',
    description: 'Full annual access with 2 free personal training sessions',
    price: 499.99,
    duration: '12 months',
    image: '/placeholder.svg',
  },
]

// Sample Orders
export const sampleOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'completed',
    items: [
      { product: 'Adjustable Dumbbell Set', quantity: 1, price: 299.99 },
      { product: 'Yoga Mat Pro', quantity: 2, price: 49.99 },
    ],
    total: 399.97,
  },
  {
    id: 'ORD-002',
    date: '2024-02-01',
    status: 'shipped',
    items: [{ product: 'Protein Powder - Chocolate', quantity: 3, price: 39.99 }],
    total: 119.97,
  },
  {
    id: 'ORD-003',
    date: '2024-02-08',
    status: 'processing',
    items: [
      { product: 'Performance Athletic Shirt', quantity: 2, price: 44.99 },
      { product: 'Training Shorts', quantity: 1, price: 54.99 },
    ],
    total: 144.97,
  },
]

// Sample Bookings
export const sampleBookings: Booking[] = [
  {
    id: 'BK-001',
    service: 'Personal Training Session',
    date: '2024-02-10',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: 'BK-002',
    service: 'Group Fitness Class',
    date: '2024-02-05',
    time: '6:00 PM',
    status: 'completed',
  },
  {
    id: 'BK-003',
    service: 'Nutrition Consultation',
    date: '2024-02-12',
    time: '2:30 PM',
    status: 'upcoming',
  },
]
