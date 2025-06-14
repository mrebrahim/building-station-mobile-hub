
import { Product, Category } from './woocommerce';

export const mockCategories: Category[] = [
  {
    id: 68,
    name: "خزائن الحمام",
    slug: "bathroom-cabinet",
    description: "خزائن حمام عالية الجودة",
    image: {
      id: 1,
      src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400",
      alt: "خزائن الحمام"
    },
    count: 15
  },
  {
    id: 78,
    name: "المرايا",
    slug: "mirror",
    description: "مرايا حديثة وأنيقة",
    image: {
      id: 2,
      src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
      alt: "المرايا"
    },
    count: 8
  },
  {
    id: 79,
    name: "وحدات التخزين",
    slug: "storage-unit",
    description: "وحدات تخزين متنوعة",
    image: {
      id: 3,
      src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
      alt: "وحدات التخزين"
    },
    count: 12
  },
  {
    id: 80,
    name: "المغاسل",
    slug: "sinks",
    description: "مغاسل سيراميك وحجرية",
    image: {
      id: 4,
      src: "https://images.unsplash.com/photo-1584622781560-3c002c43b995?w=400",
      alt: "المغاسل"
    },
    count: 20
  },
  {
    id: 81,
    name: "الحنفيات",
    slug: "faucets",
    description: "حنفيات عصرية ومتطورة",
    image: {
      id: 5,
      src: "https://images.unsplash.com/photo-1625835428199-1ccca1d0bef1?w=400",
      alt: "الحنفيات"
    },
    count: 25
  },
  {
    id: 82,
    name: "الإضاءة",
    slug: "lighting",
    description: "أضواء حمام متنوعة",
    image: {
      id: 6,
      src: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=400",
      alt: "الإضاءة"
    },
    count: 18
  }
];

export const mockProducts: Product[] = [
  {
    id: 695,
    name: "مرآة دائرية حديثة",
    slug: "modern-circular-mirror",
    price: "185000",
    regular_price: "185000",
    sale_price: "",
    description: "<p>مرآة دائرية بإطار أسود، تصميم بسيط وحديث، مناسبة لأي ديكور حمام.</p>",
    short_description: "مرآة دائرية أنيقة بإطار أسود",
    sku: "ITK-1015",
    images: [
      {
        id: 694,
        src: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
        alt: "مرآة دائرية حديثة"
      }
    ],
    categories: [
      {
        id: 78,
        name: "المرايا",
        slug: "mirror"
      }
    ],
    stock_status: "instock",
    manage_stock: true,
    stock_quantity: 100,
    featured: true
  },
  {
    id: 693,
    name: "وحدة تخزين تحت المغسلة",
    slug: "under-sink-storage",
    price: "425000",
    regular_price: "425000",
    sale_price: "",
    description: "<p>وحدة خشبية أنيقة توضع تحت المغسلة، عملية وأنيقة، توفر مساحة تخزين إضافية.</p>",
    short_description: "وحدة تخزين خشبية عملية",
    sku: "ITK-1014",
    images: [
      {
        id: 692,
        src: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600",
        alt: "وحدة تخزين تحت المغسلة"
      }
    ],
    categories: [
      {
        id: 79,
        name: "وحدات التخزين",
        slug: "storage-unit"
      }
    ],
    stock_status: "instock",
    manage_stock: true,
    stock_quantity: 100,
    featured: true
  },
  {
    id: 691,
    name: "خزانة حمام رمادية",
    slug: "gray-bathroom-cabinet",
    price: "990000",
    regular_price: "990000",
    sale_price: "",
    description: "<p>خزانة رمادية أنيقة مع سحّابات ناعمة، مقاومة للرطوبة، مثالية للاستعمال اليومي.</p>",
    short_description: "خزانة رمادية مقاومة للرطوبة",
    sku: "ITK-1012",
    images: [
      {
        id: 690,
        src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600",
        alt: "خزانة حمام رمادية"
      }
    ],
    categories: [
      {
        id: 68,
        name: "خزائن الحمام",
        slug: "bathroom-cabinet"
      }
    ],
    stock_status: "instock",
    manage_stock: true,
    stock_quantity: 100,
    featured: true
  },
  {
    id: 685,
    name: "مغسلة سيراميك بيضاء",
    slug: "white-ceramic-sink",
    price: "320000",
    regular_price: "320000",
    sale_price: "",
    description: "<p>مغسلة سيراميك ناعمة بخطوط أنيقة، مقاومة للبقع وسهلة التنظيف.</p>",
    short_description: "مغسلة سيراميك عالية الجودة",
    sku: "ITK-1011",
    images: [
      {
        id: 684,
        src: "https://images.unsplash.com/photo-1584622781560-3c002c43b995?w=600",
        alt: "مغسلة سيراميك بيضاء"
      }
    ],
    categories: [
      {
        id: 80,
        name: "المغاسل",
        slug: "sinks"
      }
    ],
    stock_status: "instock",
    manage_stock: true,
    stock_quantity: 100,
    featured: true
  }
];
