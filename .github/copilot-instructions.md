# Power Play React - AI Coding Instructions

## Project Overview

**Power Play** is a React e-commerce platform for gaming consoles and accessories, built with Vite and React 19. It's a client-side SPA with localStorage-based persistence (no backend API), featuring user authentication, shopping cart, favorites, and admin capabilities.

**Stack**: React 19 + Vite + React Router 7 + Bootstrap 5 + React Bootstrap

---

## Architecture & Data Flow

### Component Hierarchy

```
App (root state manager)
├── Header (display & navigation)
│   ├── TopBar (stores, auth links)
│   ├── Logo
│   ├── SearchBar (emit onSearch)
│   └── UserActions (cart, favorites, profile)
├── Navbar (category filter)
├── Cart (modal, side panel)
├── Main Content (ProductGrid, CartPage, AdminPage, etc.)
└── Footer
```

### State Management Pattern

- **App.jsx** is the single source of truth for:
  - `allProducts`: loaded from `products.js` or localStorage
  - `cart`, `favorites`: keyed by user ID in localStorage (`cart_${user.id}`)
  - `isCartOpen`, `currentPage`, `selectedCategory`, `selectedProduct`
  - UI modals: `showAuthModal`, `searchTerm`

- **AuthContext** manages:
  - User authentication (login/signup/logout)
  - User registry and orders via localStorage
  - Default admin: `admin@powerplay.com` / `admin123`

- **Component Props**: Heavy use of callback lifting (e.g., `onAddToCart`, `onUpdateQuantity`, `onSearch`). Prefer function props over context for local UI state.

### Data Persistence

All data lives in localStorage, keyed by:
- `products`: global product catalog
- `users`: user accounts (with plaintext passwords in dev)
- `currentUser`: active session
- `orders`: all orders
- `cart_${userId}` / `cart_guest`: shopping carts per user
- `favorites_${userId}` / `favorites_guest`: favorites per user

---

## Key Patterns & Conventions

### Component Styling

- **CSS Scope**: Each component or page has a paired CSS file (e.g., `ProductDetail.jsx` → `ProductDetail.css`)
- **Bootstrap + Custom**: Use `react-bootstrap` for layout grid, then override in component CSS for custom styling
- **Naming**: CSS classes use kebab-case (e.g., `.product-card`, `.cart-modal`, `.btn-add-cart`)
- **Example** (`ProductCard.jsx`):
  ```jsx
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price)
  }
  ```
  Always format prices in CLP using this pattern (Chilean e-commerce focus).

### Event Handling

- **Event Propagation**: Use `e.stopPropagation()` when action button clicks shouldn't trigger parent handlers (e.g., "Add to Cart" inside a clickable product card)
- **Callback Chains**: Page handlers pass through multiple component layers via named props: `onAddToCart` → `onUpdateQuantity` → `onRemoveItem`

### Image Handling

- Image paths reference `/imagenes/` folder (note: Spanish spelling)
- **Product Gallery Pattern**: Automatically generates 4-image galleries using naming convention:
  - Name images: `{productId}_1.png`, `{productId}_2.png`, `{productId}_3.png`, `{productId}_4.png`
  - Example: `xbox-series-x_1.png`, `xbox-series-x_2.png`, etc.
  - `ProductDetailPage.jsx` auto-detects these and builds the gallery—no code changes needed
  - Fallback: If no gallery found, repeats main image 4 times
- Fallback to placeholder on 404:
  ```jsx
  onError={(e) => {
    e.target.src = 'https://via.placeholder.com/200x200?text=Sin+imagen'
  }}
  ```
- See `IMAGE_GALLERY_GUIDE.md` for detailed image naming conventions

### Spanish Language

- UI text is **100% Spanish**: "Agregar al Carrito", "Carrito de compras", "Total carrito"
- Maintain this throughout (e.g., error messages, modal titles, button labels)
- Use `es-CL` locale for number formatting

---

## Development Workflows

### Build & Run

```powershell
npm install        # Install dependencies
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # Production build to /dist
npm run preview    # Preview production build locally
npm run lint       # ESLint check
```

### Hot Module Reload (HMR)

Vite enables fast refresh—changes to JSX/CSS appear instantly. No full page reloads needed.

### Deployment

Project uses **Vercel** (config in `vercel.json`). Builds automatically from `main` branch.

---

## Common Tasks

### Adding a New Product

1. Edit `src/data/products.js` (export default is required)
2. Include required fields: `id`, `name`, `price`, `image`, `category`, `sku`
3. Price in CLP as integer (no decimals)
4. Image path: `/imagenes/filename.ext`

### Adding a New Page

1. Create page file in `src/pages/` (e.g., `MyPage.jsx`)
2. Add corresponding CSS in `src/styles/`
3. Add route handler in `App.jsx` under the main rendering logic
4. Add navigation link in `Header.jsx` or `Navbar.jsx` (`onMyPageClick` callback)

### Modifying Cart Logic

- Cart add/update/remove logic is in `App.jsx` (`handleAddToCart`, `handleUpdateQuantity`, `handleRemoveFromCart`)
- Cart display is split: `Cart.jsx` (modal) and `CartPage.jsx` (full page)
- Always sync localStorage in `useEffect` after state changes

### Editing User Roles

- Admin check: `user.role === 'admin'` (see `AuthContext.jsx`)
- Admin users bypass purchase flows and can modify product inventory (future feature)

---

## Linting & Code Style

- **ESLint Config**: `eslint.config.js` (JavaScript config, not legacy JSON)
- Run `npm run lint` before commits
- React Hook Rules enforced: dependencies, cleanup functions
- No TypeScript (template-react, not template-react-ts)

---

## File Organization

```
src/
  components/        # Reusable UI components (Header, Cart, Products, etc.)
  context/           # React Context (AuthContext)
  data/              # Static data (products.js)
  pages/             # Page-level components (AdminPage, CartPage, etc.)
  styles/            # CSS files paired to components
  App.jsx            # Main app state & routing
  main.jsx           # Entry point (Vite bootstrap)
```

---

## Known Limitations & Future Considerations

- No backend API—all data stored client-side in localStorage
- Passwords stored plaintext (dev only; production must use secure auth)
- No real payment processing (checkout collects data only)
- Image hosting via public folder or external CDN (verify paths match)
- Admin panel exists but admin product management not fully implemented

---

## Debug Tips

- **localStorage**: Open DevTools → Application → Local Storage to inspect cart, users, orders
- **HMR Issues**: Clear browser cache or restart dev server (`npm run dev`)
- **Category Filters**: Check `ProductGrid.jsx` for category filtering logic (depends on `selectedCategory` prop)
- **Auth Flow**: Trace login → `AuthContext.login()` → `setCurrentUser()` → context listeners update `user`

