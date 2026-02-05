import { FiBox, FiHeart, FiMapPin, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import AddressCard from '../../components/global/AddressCard';
import AnimatedPage from '../../components/global/AnimatedPage';
import { useAuth } from '../../hooks/useAuth';

const UserOverview = () => {
  const { user, error } = useAuth();

  // Mock stats since orders might not be fully implemented in db.json yet
  const stats = [
    {
      label: 'Total Orders',
      value: user.orders?.length || 0,
      icon: <FiBox className="h-6 w-6 text-blue-500" />,
      bg: 'bg-blue-50',
      link: 'orders',
    },
    {
      label: 'Wishlist',
      value: user.wishlist?.length || 0,
      icon: <FiHeart className="h-6 w-6 text-red-500" />,
      bg: 'bg-red-50',
      link: 'wishlist',
    },
    {
      label: 'Cart Items',
      value: user.cart?.length || 0,
      icon: <FiShoppingBag className="h-6 w-6 text-green-500" />,
      bg: 'bg-green-50',
      link: 'cart',
    },
  ];

  if (error) {
    return (
      <h2 className="text-red-500">
        {typeof error === 'string' ? error : error.message || 'An error occurred'}
      </h2>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user.user.full_name?.split(' ')[0]}!
          </h2>
          <p className="mt-1 text-gray-500">
            From your account dashboard you can view your recent orders, manage your shipping and
            billing addresses, and edit your password and account details.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Link
              key={index}
              to={stat.link === 'cart' ? '/cart' : stat.link}
              className="group flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`${stat.bg} rounded-full p-4 transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Info Grid */}
        <div className="">
          {/* Address Book Section */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            {user.address?.length > 0 && (
              <Link
                to="address"
                className="text-primary mb-3 inline-block text-xs font-medium uppercase hover:underline"
              >
                manage all
              </Link>
            )}

            {/* Address Display Logic */}
            {user.address?.some((addr) => addr.isDefault) ? (
              <div className="space-y-4">
                {user.address
                  .filter((addr) => addr.isDefault)
                  .map((addr) => (
                    <AddressCard key={addr.id} addr={addr} />
                  ))}
              </div>
            ) : (
              /* Fallback UI when no default address exists */
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50/50 py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <FiMapPin className="h-6 w-6 text-gray-300" />
                </div>
                <h4 className="text-sm font-bold text-gray-900">No Default Address</h4>
                <p className="mt-1 mb-4 max-w-[200px] text-xs text-gray-500">
                  Please set a primary address for faster checkout.
                </p>
                <Link
                  to={user.address?.length > 0 ? 'address' : 'address/create'}
                  className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-bold tracking-wider text-gray-900 uppercase shadow-sm transition-colors hover:bg-gray-50"
                >
                  {user.address?.length > 0 ? 'Set Default' : 'Add New Address'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default UserOverview;
