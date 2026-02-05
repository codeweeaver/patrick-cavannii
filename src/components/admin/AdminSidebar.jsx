import { AnimatePresence, motion } from 'framer-motion';
import {
  HiOutlineCog,
  HiOutlineCube,
  HiOutlineDocumentText,
  HiOutlineHome,
  HiOutlineLogout,
  HiOutlineShieldCheck,
  HiOutlineShoppingCart,
  HiOutlineUsers,
} from 'react-icons/hi';
import { TbSettingsAutomation } from 'react-icons/tb';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const AdminSidebar = ({ isOpen, setIsOpen, user }) => {
  const { logOut } = useAuth();
  const role = user?.role || 'admin';

  const links = [
    {
      category: 'MENU',
      items: [
        {
          name: 'Dashboard',
          path: '/admin',
          icon: <HiOutlineHome size={20} />,
          roles: ['customer', 'admin', 'super_admin'],
        },
        {
          name: 'Products',
          path: '/admin/products',
          icon: <HiOutlineCube size={20} />,
          roles: ['customer', 'admin', 'super_admin'],
        },
        {
          name: 'Orders',
          path: '/admin/orders',
          icon: <HiOutlineShoppingCart size={20} />,
          roles: ['customer', 'admin', 'super_admin'],
        },
        {
          name: 'Customers',
          path: '/admin/customers',
          icon: <HiOutlineUsers size={20} />,
          roles: ['customer', 'admin', 'super_admin'],
        },
        {
          name: 'Blogs',
          path: '/admin/blogs',
          icon: <HiOutlineDocumentText size={20} />,
          roles: ['customer', 'admin', 'super_admin'],
        },
      ],
    },
    {
      category: 'MANAGEMENT',
      items: [
        {
          name: 'Admins',
          path: '/admin/admins',
          icon: <HiOutlineShieldCheck size={20} />,
          roles: ['super_admin', 'customer'],
        },
        {
          name: 'Settings',
          path: '/admin/settings',
          icon: <HiOutlineCog size={20} />,
          roles: ['admin', 'super_admin', 'customer'],
        },
      ],
    },
  ];

  return (
    <motion.aside
      initial={{ width: isOpen ? 260 : 0 }}
      animate={{ width: isOpen ? 260 : 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex h-full flex-col overflow-hidden border-r border-slate-800 bg-slate-900 text-white"
    >
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="bg-accent rounded-lg p-1.5">
            <TbSettingsAutomation className="text-xl text-white" />
          </div>
          <span className="text-lg font-bold tracking-wide">AdminPanel</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 space-y-8 overflow-y-auto px-3 py-6">
        {links.map((section, idx) => (
          <div key={idx}>
            <AnimatePresence>
              {isOpen && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mb-3 px-3 text-xs font-bold tracking-wider text-slate-500 uppercase"
                >
                  {section.category}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items
                .filter((item) => item.roles.includes(role))
                .map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/admin'}
                    className={({ isActive }) =>
                      `group flex items-center gap-3 rounded-lg px-3 py-2.5 whitespace-nowrap transition-all duration-200 ${
                        isActive
                          ? 'bg-accent shadow-accent/25 text-white shadow-lg'
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      } `
                    }
                  >
                    <span className="">{item.icon}</span>
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Logout */}
      <div className="border-t border-slate-800 p-4">
        <button
          onClick={logOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <HiOutlineLogout size={20} />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </motion.aside>
  );
};

export default AdminSidebar;
