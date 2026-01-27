import { motion } from 'framer-motion';
import { useCart } from '../../hooks/useCart';

import { FiLogIn, FiSearch, FiShoppingCart } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import BaseNavLink from '../global/BaseNavLink';
import ExclusiveButton from '../products/ExclusiveButton';
import NavbarProfile from './NavbarProfile';
import ToggleCurrency from './ToggleCurrency';

const NavbarRight = ({ containerVariants, itemVariants, toggleSearch }) => {
  const { cartCount } = useCart();
  const { user } = useAuth();

  return (
    <motion.div
      className="order-1 flex items-center space-x-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Search Icon */}
      <motion.button
        onClick={toggleSearch}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="hover:text-primary p-2 text-gray-600"
      >
        <FiSearch size={20} />
      </motion.button>

      <span className="h-6 w-px bg-gray-300" />

      {/* Currency Toggle */}
      <ToggleCurrency />

      <BaseNavLink to="/cart" activeBackgroundClassName="hidden">
        <motion.div
          className="group relative flex cursor-pointer items-center space-x-1 text-gray-700"
          variants={itemVariants}
          whileHover="hover"
        >
          <span className="group-hover:text-primary relative text-gray-600">
            <FiShoppingCart size={20} />
          </span>
          <span className="group-hover:text-primary text-sm font-medium max-sm:hidden">Cart</span>
          <span className="bg-accent group-hover:bg-primary absolute -top-3 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white transition">
            {cartCount}
          </span>
        </motion.div>
      </BaseNavLink>

      {/* go to exclusive products */}
      <ExclusiveButton />

      {user ? (
        <NavbarProfile />
      ) : (
        <BaseNavLink to="login" activeBackgroundClassName="hidden">
          <motion.button
            className="bg-primary hover:bg-primary/90 inline-flex cursor-pointer items-center space-x-2 rounded-md px-4 py-2 text-white"
            variants={itemVariants}
            whileHover="hover"
          >
            <span className="relative">
              <FiLogIn size={16} />
            </span>
            <span className="text-sm font-medium max-sm:hidden">Login</span>
          </motion.button>
        </BaseNavLink>
      )}
    </motion.div>
  );
};

export default NavbarRight;
