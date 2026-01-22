import { AnimatePresence, motion } from 'framer-motion';
import { FiCreditCard, FiFile, FiHeart, FiShoppingBag } from 'react-icons/fi';
import { Outlet, useLocation } from 'react-router-dom';
import authImage from '../assets/images/product_001.jpg';

const AuthLayout = () => {
  const location = useLocation();

  return (
    <div className="font-primary flex h-screen overflow-hidden bg-white">
      <div className="relative hidden md:block md:w-1/2">
        <div className="from-primary/60 to-accent/80 absolute inset-0 z-10 bg-linear-to-bl"></div>
        <div className="relative z-0 flex h-full items-center justify-center">
          <img src={authImage} alt="Fashion illustration" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 z-20 flex flex-col justify-center p-8 text-white">
          <p className="font-accent mb-4 text-lg text-gray-100 opacity-80">Your Style, Your Way</p>

          <h1 className="mb-8 text-5xl font-bold">
            Patrick Cavanni Wardrobe, where creativity meets craftsmanship.
          </h1>

          <div className="mb-8 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <FiFile />
              <span>Discover latest news and exclusive offers.</span>
            </div>
            <div className="flex items-center gap-2">
              <FiShoppingBag />
              <span>View your order history and saved addresses.</span>
            </div>
            <div className="flex items-center gap-2">
              <FiHeart />
              <span>Save items to your Wishlist.</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCreditCard />
              <span>Checkout faster.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="scrollbar-hide flex h-screen w-full flex-col overflow-y-auto md:w-1/2">
        <div className="flex-1 px-4 py-12 sm:px-6 lg:px-20 xl:px-24">
          <div className="mx-auto flex min-h-full w-full max-w-md flex-col">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
