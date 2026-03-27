# Step 2: Database Schema (Prisma)

You will use Prisma ORM with SQLite for local development. Here is the comprehensive schema for GiftGenie AI, supporting users, products, AI sessions, customized carts, orders, and saved recipients.

## 1. Define the Schema
Copy the following into `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id            String      @id @default(cuid())
  name          String?
  email         String      @unique
  password      String?
  image         String?
  createdAt     DateTime    @default(now())
  
  carts         CartItem[]
  orders        Order[]
  people        Person[]    // saved recipients
  wishlists     Wishlist[]
  aiSessions    AISession[]
}

model Person {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  name          String
  relationship  String   // e.g., girlfriend, mom, friend
  interests     String   // comma-separated
  personality   String?  // introvert, creative, etc.
  createdAt     DateTime @default(now())
}

model Product {
  id            String      @id @default(cuid())
  name          String
  description   String
  price         Float
  image         String
  category      String
  tags          String      // emotion-mapped tags
  rating        Float       @default(4.5)
  inStock       Boolean     @default(true)
  
  cartItems     CartItem[]
  orderItems    OrderItem[]
  wishlists     Wishlist[]
}

model AISession {
  id            String   @id @default(cuid())
  userId        String
  user          User     @relation(fields: [userId], references: [id])
  prompt        String
  occasion      String
  budget        Float
  relationship  String
  emotions      String
  suggestions   String   // JSON array of product IDs or descriptions
  message       String?  // AI-generated personal message
  comboBundles  String?  // JSON combo suggestions
  deliveryTip   String?  // AI delivery timing advice
  createdAt     DateTime @default(now())
}

model CartItem {
  id         String   @id @default(cuid())
  userId     String
  user       User     @relation(fields: [userId], references: [id])
  productId  String
  product    Product  @relation(fields: [productId], references: [id])
  quantity   Int      @default(1)
  isCombo    Boolean  @default(false)
  comboName  String?
}

model Order {
  id            String      @id @default(cuid())
  userId        String
  user          User        @relation(fields: [userId], references: [id])
  items         OrderItem[]
  total         Float
  status        String      @default("placed") // placed, shipped, delivered
  stripeId      String?
  recipientName String?
  message       String?
  createdAt     DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
  quantity  Int
  price     Float
}

model Wishlist {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  productId String
  product   Product @relation(fields: [productId], references: [id])
}
```

## 2. Generate and Push the Schema
After saving the schema, run the following commands to create your database and generate the Prisma client:

```bash
npx prisma generate
npx prisma db push
```

## 3. Create a Database Seed (Optional but Recommended)
Create a `prisma/seed.js` script to populate your database with dummy products to ensure the AI has something to recommend against.
