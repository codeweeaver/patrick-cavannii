import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useCurrency } from '../../context/CurrencyContext';

const ProductListItem = ({ product, badge }) => {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const isWishlisted = isInWishlist(product.id);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="group relative flex min-h-44 flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Horizontal Image Section */}
      <div className="relative w-32 shrink-0 overflow-hidden bg-gray-100 sm:w-48 md:w-64">
        <img
          src={product.images?.[0]}
          alt={product.name}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {badge && (
          <span className="absolute top-2 left-2 rounded-full bg-black px-3 py-1 text-[10px] font-bold text-white uppercase">
            {badge}
          </span>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-1">
            <span className="text-primary text-xs font-bold tracking-wider uppercase">
              {product.brand}
            </span>
            <Link to={`/products/${product.slug || product.id}`}>
              <h3 className="hover:text-primary text-lg font-bold text-gray-900 transition-colors">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xl font-black text-gray-900">{formatPrice(product.price)}</div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </div>
            )}
            {product.inventory?.quantity > 0 && (
              <p
                className={`mt-1 text-xs font-medium whitespace-nowrap ${product.inventory.quantity < 20 ? 'text-red-500' : 'text-green-500'}`}
              >
                pieces left: {product.inventory.quantity}
              </p>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap-reverse items-center gap-3 sm:gap-4 md:flex-wrap">
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary/90 flex flex-1 basis-full items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold whitespace-nowrap text-white transition-all sm:basis-auto md:flex-none"
          >
            <FiShoppingBag /> Add to Cart
          </button>
          <button
            onClick={handleWishlistClick}
            className="ml-auto rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50 sm:ml-0"
          >
            <FiHeart
              className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </button>
          <Link
            to={`/products/${product.slug || product.id}`}
            className="rounded-xl border border-gray-200 p-2.5 transition-colors hover:bg-gray-50"
          >
            <FiEye className="text-gray-600" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductListItem;
