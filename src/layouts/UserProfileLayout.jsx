import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiHeart, FiLogOut, FiMenu, FiSettings, FiShoppingBag, FiUser, FiX } from 'react-icons/fi';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const UserProfileLayout = () => {
  const { user, logOut } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="bg-accent/5 min-h-screen px-4 py-8 md:py-12">
      <div className="container mx-auto flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Mobile Header with Toggle */}
        <div className="flex items-center justify-between lg:hidden">
          <span className="text-lg font-bold text-gray-900">My Account</span>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-md border border-gray-200 bg-white p-2 text-gray-600"
          >
            <FiMenu size={20} />
          </button>
        </div>

        {/* Backdrop for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* --- THE EXACT SIDEBAR CARD --- */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[350px] transform overflow-y-auto bg-white transition-transform duration-300 ease-in-out lg:static lg:z-0 lg:w-[340px] lg:shrink-0 lg:translate-x-0 lg:self-start lg:overflow-hidden lg:rounded-xl lg:border lg:border-gray-100 lg:shadow-md ${
            isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Header: Profile Info */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={`https://ui-avatars.com/api/?name=${user?.name}&background=E8ECEF&color=2D3748`}
                  alt="Avatar"
                  className="h-14 w-14 rounded-full border border-gray-100 object-cover"
                />
                <div className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400"></div>
              </div>
              <div className="flex flex-col">
                <h2 className="text-primary text-[18px] leading-tight font-bold">
                  {user?.name || 'User'}
                </h2>
                <span className="text-[14px] text-gray-600">
                  {user?.email || 'hellomahmud@gmail.com'}
                </span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-500 lg:hidden">
              <FiX size={24} />
            </button>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Menu Items */}
          <nav className="p-2">
            <ProfileLink
              to="."
              icon={<FiUser />}
              label="View Profile"
              end
              onClick={() => setIsSidebarOpen(false)}
            />
            <ProfileLink
              to="wishlist"
              icon={<FiHeart />}
              label="Wishlist"
              onClick={() => setIsSidebarOpen(false)}
            />
            <ProfileLink
              to="orders"
              icon={<FiShoppingBag />}
              label="Orders"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="my-2 h-px bg-slate-100" />
            <ProfileLink
              to="settings"
              icon={<FiSettings />}
              label="Account Settings"
              onClick={() => setIsSidebarOpen(false)}
            />

            <button
              onClick={logOut}
              className="text-accent group flex w-full items-center gap-4 rounded-lg px-4 py-3.5 transition-colors hover:bg-red-50"
            >
              <FiLogOut className="text-xl" />
              <span className="text-[16px] font-semibold">Log Out</span>
            </button>
          </nav>
        </aside>

        {/* --- CONTENT AREA --- */}

        <AnimatePresence mode="wait">
          <motion.main
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="min-h-[500px] flex-1 rounded-xl border border-gray-100 bg-white px-4 py-6 shadow-sm md:px-8"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Helper Component for the Exact Link Style
const ProfileLink = ({ to, icon, label, end, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `group mb-2 flex items-center gap-4 rounded-lg px-4 py-3.5 transition-all duration-200 ${isActive ? 'bg-accent/5 text-gray-900' : 'hover:bg-accent/5 text-gray-600'} `
    }
  >
    <span className="text-xl text-slate-500 transition-colors group-hover:text-slate-900">
      {icon}
    </span>
    <span className="flex-1 text-[16px] font-semibold">{label}</span>
  </NavLink>
);

export default UserProfileLayout;
