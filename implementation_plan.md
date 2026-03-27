# Make GiftGenie AI Fully Functional

After reviewing every file, here are the **8 concrete fixes** needed. No UI or styling changes — only wiring logic.

---

## Fix 1: Regenerate Prisma Client + Push Schema

You added `cartItems` and `product` relations to the schema but never ran `prisma generate` or `db push`. Nothing DB-related will work until this is done.

#### Command
```bash
npx prisma generate && npx prisma db push
```

---

## Fix 2: Fix & Run the Seed Script

[prisma/seed.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/prisma/seed.js) uses ESM `import` syntax but the project doesn't have `"type": "module"` in [package.json](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/package.json). Also needs a seed script entry.

#### [MODIFY] [package.json](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/package.json)
- Add `"prisma": { "seed": "node --experimental-vm-modules prisma/seed.js" }` 
- Add `"type": "module"` to [package.json](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/package.json)

#### Command
```bash
npx prisma db seed
```

---

## Fix 3: Cart Page — Fetch Real Items from DB

[src/app/cart/page.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/cart/page.js) still uses hardcoded mock data (`useState([{ id: "1", name: "Ethereal Silk Scarf"...}])`). It needs to fetch from `/api/cart` on mount.

#### [MODIFY] [page.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/cart/page.js)
- Replace hardcoded `useState` with empty `[]`
- Add `useEffect` to fetch `GET /api/cart`, map cart items to display format (`item.product.name`, `item.product.price`, etc.)
- Wire the `+`/`-` quantity buttons to `PATCH /api/cart`
- Wire [removeItem](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/cart/page.js#51-54) to `DELETE /api/cart`

---

## Fix 4: Add DELETE endpoint to Cart API

The cart API route only has [GET](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/api/cart/route.js#8-20) and [POST](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/api/stripe/checkout/route.js#9-47). Need `DELETE` to remove items from cart.

#### [MODIFY] [route.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/api/cart/route.js)
- Add `DELETE` handler that removes a cart item by ID

---

## Fix 5: Genie Flow — Allow Guests (or Redirect to Login)

The `/api/ai/suggest` route now returns 401 for unauthenticated users, but the Discover page doesn't handle this — it just silently redirects to `/results` with no data.

#### [MODIFY] [page.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/discover/page.js)
- If API returns 401, show an alert and redirect to `/login` instead of `/results`

---

## Fix 6: Landing Page "Add to Cart" Buttons

The trending gifts on the homepage have "Add to cart" buttons that do nothing (plain `<button>` tags with no `onClick`).

#### [MODIFY] [page.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/page.js)
- Convert to client component (or extract a small client component)
- Wire buttons to call `POST /api/cart` with the corresponding seeded product ID

---

## Fix 7: Header Cart Badge — Show Real Count

The header cart icon always shows "2" (hardcoded). It should show the actual cart count.

#### [MODIFY] [Header.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/components/Header.js)
- Fetch cart count from API or pass via context
- Display the real number (or hide badge if 0)

---

## Fix 8: Checkout Success Page

The Stripe checkout `success_url` points to `/checkout/success` but that page doesn't exist.

#### [NEW] [page.js](file:///c:/Users/3380s/OneDrive/Desktop/Giftgenie%20ai/src/app/checkout/success/page.js)
- Create a simple success confirmation page with a link back to dashboard

---

## Verification Plan

### Automated
```bash
npx prisma db seed          # Verify products seeded
curl http://localhost:3000/api/products  # Should return 15 products
```

### Manual (Browser)
1. Sign up → Login → verify dashboard loads
2. Go to Discover → fill form → click "Find the Perfect Gift" → verify results page shows AI suggestions
3. Click "Add to Cart" on a result → go to `/cart` → verify item appears
4. Click "Proceed to Checkout" → verify Stripe redirect (or graceful error if keys are test placeholders)
5. Home page → click "Add to cart" on trending → verify cart updates
