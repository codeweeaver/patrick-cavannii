import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaHeadset } from 'react-icons/fa6';
import {
  FiArrowUpCircle,
  FiChevronDown,
  FiHeart,
  FiLogOut,
  FiSettings,
  FiUser,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const NavbarProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logOut } = useAuth();

  // Animation variants
  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };
  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 focus:outline-none"
      >
        <div className="relative">
          <img
            src="https://i.pravatar.cc/150?u=mahamud"
            alt="User Avatar"
            className="border-primary h-10 w-10 rounded-full border-2 object-cover"
          />
          <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
        </div>

        <FiChevronDown
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click outside to close backdrop */}
            <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />

            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute right-0 z-20 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl"
            >
              <div className="flex w-full items-center gap-3 border-b border-gray-50 px-4 py-4">
                <div className="relative">
                  <img
                    src="https://i.pravatar.cc/150?u=mahamud"
                    alt="User Avatar"
                    className="border-primary h-10 w-10 rounded-full border-2 object-cover"
                  />
                  <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-gray-900">{user.name}</p>
                  <p className="truncate text-xs text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Menu Groups */}
              <div className="p-2">
                <DropdownItem
                  to="/profile"
                  variants={itemVariants}
                  icon={<FiUser />}
                  label="View Profile"
                  onClick={() => setIsOpen(false)}
                />

                <DropdownItem
                  to="profile/wishlist"
                  variants={itemVariants}
                  icon={<FiHeart />}
                  label="Wishlist"
                  onClick={() => setIsOpen(false)}
                />

                <DropdownItem
                  to="profile/orders"
                  variants={itemVariants}
                  icon={<FiArrowUpCircle />}
                  label="Orders"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <div className="border-t border-gray-50 p-2">
                <DropdownItem
                  to="/help-center"
                  variants={itemVariants}
                  icon={<FaHeadset />}
                  label="Support"
                  onClick={() => setIsOpen(false)}
                />

                <DropdownItem
                  to="profile/settings"
                  variants={itemVariants}
                  icon={<FiSettings />}
                  label="Account Settings"
                  onClick={() => setIsOpen(false)}
                />
              </div>

              <div className="border-t border-gray-50 bg-gray-50/50 p-2">
                <button
                  onClick={logOut}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50"
                >
                  <FiLogOut className="text-lg" />
                  Log Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

const DropdownItem = ({ to, icon, label, isAccent = false, variants, onClick }) => {
  return (
    <motion.div variants={variants} whileHover={{ x: 5 }}>
      <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
          `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          } ${isAccent && !isActive ? 'text-accent hover:bg-accent/5' : ''} `
        }
      >
        {({ isActive }) => (
          <>
            <span className={`text-lg ${isActive ? 'text-primary' : 'text-gray-400'}`}>{icon}</span>
            {label}
            {isAccent && (
              <span className="bg-accent/10 text-accent ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                Pro
              </span>
            )}
          </>
        )}
      </NavLink>
    </motion.div>
  );
};

export default NavbarProfile;
