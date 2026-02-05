import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import {
  FiCamera,
  FiHeart,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingBag,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { Outlet, useLocation } from 'react-router-dom';
import BaseNavLink from '../components/global/BaseNavLink';
import Modal from '../components/global/Modal'; // Ensure this path is correct
import { useAuth } from '../hooks/useAuth';

const UserProfileLayout = () => {
  const { user, logOut, updateUser } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // AI Generated Avatars from your chosen style
  const aiAvatars = [
    { label: 'Money Spender', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=MoneySpender' },
    { label: 'Model', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Model' },
    {
      label: 'Tech Visionary',
      url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=TechVisionary',
    },
    { label: 'Classic', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Classic' },
    { label: 'Avant-Garde', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=AvantGarde' },
    {
      label: 'Street Influencer',
      url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=StreetInfluencer',
    },
    { label: 'Minimalist', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Minimalist' },
    { label: 'Boss Mode', url: 'https://api.dicebear.com/9.x/avataaars/svg?seed=BossMode' },
  ];

  const handleAvatarSelect = async (url) => {
    try {
      if (updateUser) {
        await updateUser(user.id, { ...user.user, profilePic: url });
      }
      setShowAvatarModal(false);
    } catch (err) {
      console.error('Failed to update profile picture', err);
    }
  };

  return (
    <div className="bg-accent/5 min-h-screen px-4 py-8 md:py-12">
      {/* Avatar Selection Modal */}
      <Modal
        isOpen={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        title="Select Your Persona"
      >
        <div className="grid grid-cols-4 gap-4 p-4">
          {aiAvatars.map((avatar, i) => (
            <button
              key={i}
              onClick={() => handleAvatarSelect(avatar.url)}
              className="group flex flex-col items-center gap-2"
            >
              <div className="group-hover:border-primary relative h-16 w-16 overflow-hidden rounded-full border-2 border-transparent transition-all group-hover:scale-105">
                <img src={avatar.url} alt={avatar.label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100">
                  <span className="text-[10px] font-bold text-white uppercase">Select</span>
                </div>
              </div>
              <span className="w-full truncate text-center text-[10px] font-medium text-gray-500">
                {avatar.label}
              </span>
            </button>
          ))}
        </div>
      </Modal>

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
              {/* Profile Pic with Change Trigger */}
              <div
                className="group relative cursor-pointer"
                onClick={() => setShowAvatarModal(true)}
              >
                <img
                  src={
                    user?.profilePic ||
                    `https://ui-avatars.com/api/?name=${user.user?.full_name}&background=E8ECEF&color=2D3748`
                  }
                  alt="Avatar"
                  className="h-14 w-14 rounded-full border border-gray-100 object-cover transition-opacity group-hover:opacity-80"
                />
                <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <FiCamera className="text-white" size={18} />
                </div>
                <div className="absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-green-400"></div>
              </div>

              <div className="flex flex-col">
                <h2 className="text-primary text-[18px] leading-tight font-bold">
                  {user.user?.full_name || 'User'}
                </h2>
                <span className="text-[14px] text-gray-600">
                  {user.user?.email || 'user@example.com'}
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
              to="/profile"
              icon={<FiUser />}
              label="View Profile"
              end
              onClick={() => setIsSidebarOpen(false)}
            />
            <ProfileLink
              to="/profile/wishlist"
              icon={<FiHeart />}
              label="Wishlist"
              onClick={() => setIsSidebarOpen(false)}
            />
            <ProfileLink
              to="/profile/orders"
              icon={<FiShoppingBag />}
              label="Orders"
              onClick={() => setIsSidebarOpen(false)}
            />

            <div className="my-2 h-px bg-slate-100" />
            <ProfileLink
              to="/profile/settings"
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
  <BaseNavLink
    to={to}
    end={end}
    onClick={onClick}
    className="mb-2 rounded-lg px-4 py-3.5"
    activeClassName="text-gray-900"
    inactiveClassName="text-gray-600 hover:bg-accent/5"
    activeBackgroundClassName="bg-accent/5 rounded-lg"
    layoutId="profile-sidebar"
  >
    <span className="text-xl text-slate-500 transition-colors group-hover:text-slate-900">
      {icon}
    </span>
    <span className="ml-2 flex-1 text-[16px] font-semibold">{label}</span>
  </BaseNavLink>
);

export default UserProfileLayout;
