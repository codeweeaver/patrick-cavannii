import { motion } from 'framer-motion';
import { FiEye, FiHeart, FiStar } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useCurrency } from '../../context/CurrencyContext';

const ProductCard = ({ product, badge, delay = 0 }) => {
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition-all hover:shadow-xl"
    >
      {/* Image Container */}

      <div className="relative h-60 overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* badge */}
        {badge && (
          <span className="absolute top-2 right-2 rounded-full bg-black px-3 py-1 text-xs font-semibold text-white uppercase">
            {badge}
          </span>
        )}

        {/* brands */}
        <span className="bg-accent absolute top-2 left-2 rounded-sm px-2 py-1 text-xs text-white">
          {product.brand}
        </span>

        {/* cateogries */}
        <div className="absolute bottom-2 left-2 flex gap-2 text-xs">
          <span className="rounded-sm border border-gray-50 bg-white px-2 py-1 backdrop:backdrop-blur-md">
            {product.category}
          </span>
          <span className="rounded-sm border border-gray-50 bg-white px-2 py-1 backdrop:backdrop-blur-md">
            {product.collection}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="group-hover:bg-opacity-10 absolute inset-0 flex items-center justify-center space-x-4 bg-black/60 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Link
            to={`/products/${product.slug || product.id}`}
            className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 transition-colors hover:text-white"
          >
            <FiEye className="h-5 w-5" />
          </Link>
          <button
            className="hover:bg-accent flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-800 transition-colors hover:text-white"
            onClick={handleWishlistClick}
          >
            <FiHeart className={`h-5 w-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          {/* name and rating column */}
          <div>
            <Link to={`/products/${product.slug || product.id}`} className="mb-1 block">
              <h3 className="hover:text-primary text-sm font-semibold text-gray-800 transition-colors">
                {product.name}
              </h3>
            </Link>

            {/* rating and items left */}
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`h-3.5 w-3.5 ${
                      i < Math.floor(product.rating || 0)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs text-gray-400">({product.reviews || 0})</span>
              </div>
            </div>
          </div>
          {/* prices column */}
          <div className="flex flex-col self-start text-right">
            <span className="text-md font-bold whitespace-nowrap text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-accent/80 text-xs line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.inventory.quantity > 0 && (
              <p
                className={`text-xs font-medium whitespace-nowrap ${product.inventory.quantity < 20 ? 'text-red-500' : 'text-green-500'}`}
              >
                pieces left: {product.inventory.quantity}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          className="bg-primary/90 hover:bg-primary mt-2 w-full cursor-pointer self-end rounded-lg p-2 text-white transition-colors hover:text-white"
        >
          Add To Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
