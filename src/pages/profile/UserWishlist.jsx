import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import ProductCard from '../../components/products/ProductCard';
import { useWishlist } from '../../hooks/useWishlist';

const UserWishlist = () => {
  const { wishlistItems, wishlistCount } = useWishlist();

  if (wishlistCount === 0) {
    return (
      <AnimatedPage>
        <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="mb-6 rounded-full bg-red-50 p-6">
            <FiHeart className="h-10 w-10 text-red-500" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-gray-900">Your wishlist is empty</h3>
          <p className="mb-8 max-w-md text-lg text-gray-500">
            Looks like you haven't added any items to your wishlist yet. Explore our collection and
            save your favorites for later!
          </p>
          <Link
            to="/products"
            className="bg-primary shadow-primary/20 hover:bg-primary/90 inline-flex items-center gap-2 rounded-full px-8 py-3 font-bold text-white shadow-lg transition-all"
          >
            <FiShoppingBag className="text-xl" />
            Start Shopping
          </Link>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
            <p className="mt-1 text-gray-500">
              {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {wishlistItems.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
};

export default UserWishlist;
