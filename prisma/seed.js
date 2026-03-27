import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.aISession.deleteMany();
  await prisma.person.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Create sample products
  const products = [
    {
      name: "Ethereal Silk Scarf",
      description: "A luxurious silk scarf that drapes like a whisper. Perfect for adding elegance to any outfit.",
      price: 1299,
      image: "/images/scarf.jpg",
      category: "Fashion",
      tags: "elegant, luxury, timeless",
      rating: 4.8,
      inStock: true
    },
    {
      name: "Personalized Engraved Watch",
      description: "A classic timepiece with custom engraving. Timeless style meets personal touch.",
      price: 4999,
      image: "/images/watch.jpg",
      category: "Accessories",
      tags: "timeless, personal, classic",
      rating: 4.9,
      inStock: true
    },
    {
      name: "Artisan Coffee Set",
      description: "Handcrafted ceramic mugs with premium single-origin coffee beans. Perfect for cozy mornings.",
      price: 899,
      image: "/images/coffee.jpg",
      category: "Home",
      tags: "cozy, artisan, comfort",
      rating: 4.7,
      inStock: true
    },
    {
      name: "Custom Star Map",
      description: "A beautiful map of the stars on a special date. Captures a moment in the cosmos forever.",
      price: 1599,
      image: "/images/starmap.jpg",
      category: "Art",
      tags: "romantic, unique, memorable",
      rating: 4.9,
      inStock: true
    },
    {
      name: "Scented Candle Collection",
      description: "A set of three hand-poured soy candles with carefully curated scents for every mood.",
      price: 699,
      image: "/images/candles.jpg",
      category: "Home",
      tags: "relaxing, cozy, aromatic",
      rating: 4.6,
      inStock: true
    },
    {
      name: "Leather Journal Set",
      description: "Premium leather-bound journal with matching pen. Perfect for thoughts, dreams, and creative ideas.",
      price: 1199,
      image: "/images/journal.jpg",
      category: "Stationery",
      tags: "creative, thoughtful, personal",
      rating: 4.7,
      inStock: true
    },
    {
      name: "Personalized Photo Frame",
      description: "Custom engraved wooden frame to showcase cherished memories. Timeless and heartfelt.",
      price: 799,
      image: "/images/frame.jpg",
      category: "Home",
      tags: "personal, sentimental, timeless",
      rating: 4.8,
      inStock: true
    },
    {
      name: "Gourmet Chocolate Assortment",
      description: "Handcrafted chocolates with exotic flavors. A sweet indulgence for any occasion.",
      price: 599,
      image: "/images/chocolates.jpg",
      category: "Food",
      tags: "indulgent, sweet, gourmet",
      rating: 4.9,
      inStock: true
    },
    {
      name: "Aromatherapy Diffuser",
      description: "Ultrasonic diffuser with essential oils. Creates a calming atmosphere for relaxation.",
      price: 1499,
      image: "/images/diffuser.jpg",
      category: "Wellness",
      tags: "relaxing, calming, wellness",
      rating: 4.6,
      inStock: true
    },
    {
      name: "Custom Portrait Illustration",
      description: "Hand-drawn portrait capturing personality and style. A unique piece of art.",
      price: 2499,
      image: "/images/portrait.jpg",
      category: "Art",
      tags: "unique, personal, artistic",
      rating: 4.9,
      inStock: true
    },
    {
      name: "Smart Fitness Tracker",
      description: "Advanced fitness band with health monitoring. Perfect for the health-conscious.",
      price: 2999,
      image: "/images/fitness.jpg",
      category: "Tech",
      tags: "tech, fitness, health",
      rating: 4.5,
      inStock: true
    },
    {
      name: "Personalized Recipe Book",
      description: "Custom cookbook with family recipes and personal notes. A treasure of flavors.",
      price: 1799,
      image: "/images/recipe.jpg",
      category: "Food",
      tags: "personal, culinary, family",
      rating: 4.7,
      inStock: true
    },
    {
      name: "Bamboo Plant Set",
      description: "Easy-to-care-for bamboo plants in stylish pots. Brings nature indoors.",
      price: 899,
      image: "/images/bamboo.jpg",
      category: "Home",
      tags: "nature, calming, decor",
      rating: 4.4,
      inStock: true
    },
    {
      name: "Custom Song Lyrics Art",
      description: "Printed lyrics from a favorite song with custom design. Music meets art.",
      price: 1299,
      image: "/images/lyrics.jpg",
      category: "Art",
      tags: "musical, personal, artistic",
      rating: 4.8,
      inStock: true
    },
    {
      name: "Gaming Mouse Pad",
      description: "Premium gaming mouse pad with custom design. Enhances any gaming setup.",
      price: 399,
      image: "/images/mousepad.jpg",
      category: "Tech",
      tags: "gaming, tech, custom",
      rating: 4.3,
      inStock: true
    }
  ];

  for (const productData of products) {
    await prisma.product.create({
      data: productData
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });