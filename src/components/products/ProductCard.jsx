import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCurrency } from '../../context/CurrencyContext';
import { useWishlist } from '../../hooks/useWishlist';

// --- Sub-components for better readability ---
const Rating = ({ rating, reviews }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`h-3.5 w-3.5 ${
          i < Math.floor(rating || 0)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))}
    <span className="text-xs text-gray-400">({reviews || 0})</span>
  </div>
);

const ProductCard = ({ product, badge, delay = 0, onAddToCart }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();

  const isWishlisted = isInWishlist(product.id);
  const productPath = `/products/${product.slug || product.id}`;

  // FIXED: Explicit handler functions to ensure clean execution
  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
    >
      {/* 1. Image & Overlays */}
      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="pointer-events-none absolute top-2 right-2 left-2 flex items-start justify-between">
          <span className="bg-accent rounded-sm px-2 py-1 text-xs text-white">{product.brand}</span>
          {badge && (
            <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white uppercase">
              {badge}
            </span>
          )}
        </div>

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 flex items-center justify-center space-x-4 bg-black/40 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Link
            to={productPath}
            className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 transition-colors hover:text-white"
          >
            <FiEye className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={handleWishlist}
            className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 transition-colors hover:text-white"
          >
            <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Category Label */}
        <div className="absolute bottom-2 left-2">
          <span className="rounded-sm border border-gray-100 bg-white/90 px-2 py-1 text-xs backdrop-blur-md">
            {product.category}
          </span>
        </div>
      </div>

      {/* 2. Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link to={productPath} className="mb-1 block">
              <h3 className="hover:text-primary truncate text-sm font-semibold text-gray-800 transition-colors">
                {product.name}
              </h3>
            </Link>
            <Rating rating={product.rating} reviews={product.reviews} />
          </div>

          <div className="shrink-0 text-right">
            <p className="text-md font-bold text-gray-900">{formatPrice(product.price)}</p>
            {product.oldPrice && (
              <p className="text-accent/80 text-xs line-through">{formatPrice(product.oldPrice)}</p>
            )}
          </div>
        </div>

        {/* 3. Inventory & Action */}
        <div className="mt-auto pt-3">
          {product.inventory?.quantity > 0 && (
            <p
              className={`mb-2 text-xs font-medium ${product.inventory.quantity < 20 ? 'text-red-500' : 'text-green-500'}`}
            >
              Pieces left: {product.inventory.quantity}
            </p>
          )}

          <button
            type="button"
            onClick={onAddToCart}
            className="bg-primary/90 hover:bg-primary w-full rounded-lg p-2 text-sm font-medium text-white transition-all active:scale-[0.98]"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
