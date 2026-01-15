# Olivia Grove - Premium Olive Oil E-Commerce Platform

A beautiful, modern e-commerce website for premium olive oils built with Next.js 14, Tailwind CSS, and Supabase.

![Olivia Grove](https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=80)

## Features

- **Beautiful Responsive Design** - Stunning UI that works on all devices
- **Product Catalog** - Browse and search products with filtering and sorting
- **Shopping Cart** - Add items, update quantities, persistent cart storage
- **User Authentication** - Sign up, sign in, password reset with Supabase Auth
- **Admin Dashboard** - Full CMS for managing products, orders, and customers
- **Checkout Flow** - Multi-step checkout with shipping and payment forms
- **Smooth Animations** - Framer Motion animations throughout

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

---

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A [Supabase](https://supabase.com/) account (free tier works great)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/olivia-grove.git
cd olivia-grove
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com/)
2. Go to **Project Settings > API** and copy your:
   - Project URL
   - Anon/Public Key

3. Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Set up the database schema:
   - Go to **SQL Editor** in your Supabase dashboard
   - Copy the contents of `supabase/schema.sql`
   - Run the SQL to create tables, policies, and sample data

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## User Guides

### For End Users (Customers)

#### Browsing Products
1. Visit the **Shop** page to browse all products
2. Use the search bar to find specific items
3. Filter by category (Extra Virgin, Infused, Organic, Gift Sets)
4. Sort by price, rating, or name

#### Shopping Cart
1. Click **Add to Cart** on any product
2. Click the cart icon in the navbar to view your cart
3. Adjust quantities or remove items as needed
4. Free shipping on orders over $50!

#### Checkout
1. Click **Proceed to Checkout** from the cart
2. Fill in your shipping information
3. Enter payment details (demo mode - no real charges)
4. Receive order confirmation

#### Account
1. Click **Sign In** in the navbar
2. Create an account or log in to an existing one
3. Your cart persists across sessions when logged in

---

### For Store Administrators

#### Accessing the Admin Dashboard
1. Log in with an admin account
2. Click your profile icon > **Admin Dashboard**
3. Or navigate directly to `/admin`

#### Managing Products

**View Products:**
- Go to **Admin > Products** to see all products
- Search by name or category
- View stock status, pricing, and ratings

**Add New Product:**
1. Click **Add Product** button
2. Fill in product details:
   - Name and description
   - Price and size
   - Category selection
   - Image URL (use Unsplash for free images)
   - Stock and featured status
3. Click **Add Product** to save

**Edit Product:**
1. Click the edit icon on any product
2. Modify the details
3. Click **Save Changes**

**Delete Product:**
1. Click the delete icon on any product
2. Confirm the deletion

#### Managing Orders

**View Orders:**
- Go to **Admin > Orders** to see all orders
- Filter by status (Pending, Processing, Shipped, Completed)
- Search by order ID or customer name

**Order Statuses:**
- **Pending** - Order received, awaiting processing
- **Processing** - Order being prepared
- **Shipped** - Order dispatched to customer
- **Completed** - Order delivered successfully

#### Viewing Customers
- Go to **Admin > Customers** to see all registered users
- View order history and total spend per customer
- Search by name or email

#### Store Settings
- Go to **Admin > Settings** to configure:
  - Store information (name, email, phone, address)
  - Notification preferences
  - Shipping settings (free shipping threshold)
  - Tax rate configuration

---

### For System Administrators

#### Database Management

**Supabase Dashboard:**
1. Access your project at [app.supabase.com](https://app.supabase.com)
2. Use the **Table Editor** to view/edit data directly
3. Use **SQL Editor** for complex queries

**Key Tables:**
- `profiles` - User profiles linked to auth.users
- `products` - Product catalog
- `orders` - Customer orders
- `order_items` - Individual items in orders

#### Setting Up Admin Users

1. Have the user create an account normally
2. In Supabase SQL Editor, run:

```sql
UPDATE public.profiles
SET is_admin = true
WHERE email = 'admin@example.com';
```

#### Row Level Security (RLS)

The database uses RLS policies to ensure:
- Anyone can view products (public)
- Only admins can create/edit/delete products
- Users can only view their own orders
- Admins can view all orders

#### Authentication Settings

In Supabase Dashboard > Authentication > Settings:
- Configure email templates
- Set up OAuth providers (Google, GitHub, etc.)
- Adjust password requirements
- Enable/disable email confirmations

#### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API key for client-side |

#### Deployment

**Vercel (Recommended):**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

**Other Platforms:**
The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- Self-hosted with Node.js

---

## Project Structure

```
olivia-grove/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (auth)/            # Auth pages (login, register)
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── shop/              # Shop and product pages
│   │   ├── about/             # About page
│   │   ├── contact/           # Contact page
│   │   ├── checkout/          # Checkout page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Homepage
│   ├── components/            # Reusable components
│   ├── context/               # React contexts (Auth, Cart, Products)
│   ├── data/                  # Static data and types
│   ├── lib/                   # Utility functions
│   │   └── supabase/          # Supabase client configuration
│   └── types/                 # TypeScript types
├── supabase/
│   └── schema.sql             # Database schema
├── public/                    # Static assets
└── package.json
```

---

## Customization

### Changing Colors

Edit `tailwind.config.js` to modify the color palette:

```js
colors: {
  olive: { /* your olive shades */ },
  gold: { /* your gold shades */ },
}
```

### Adding Products

Products can be added via:
1. Admin Dashboard UI
2. Directly in Supabase Table Editor
3. SQL insert statements

### Custom Domain

Configure your custom domain in your hosting provider (Vercel, Netlify, etc.)

---

## Troubleshooting

### "Invalid API Key" Error
- Check that `.env.local` has correct Supabase credentials
- Restart the dev server after changing env variables

### Products Not Loading
- Verify the database schema was created correctly
- Check RLS policies allow public read access to products

### Auth Not Working
- Ensure email confirmation is configured in Supabase
- Check that the site URL is set correctly in Supabase Auth settings

### Styles Not Applying
- Run `npm install` to ensure Tailwind is installed
- Check that `tailwind.config.js` includes all content paths

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Credits

- Images from [Unsplash](https://unsplash.com/) (free to use)
- Icons from [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), and [Supabase](https://supabase.com/)
