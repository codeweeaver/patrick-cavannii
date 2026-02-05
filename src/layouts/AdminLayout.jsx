import { useState } from 'react';
import { HiBell, HiMenuAlt2, HiOutlineUser, HiSearch } from 'react-icons/hi';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import { useAuth } from '../hooks/useAuth';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} user={user} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
          {/* Left: Toggle & Search */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <HiMenuAlt2 size={24} />
            </button>
            <div className="relative hidden md:block">
              <HiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="focus:ring-accent w-64 rounded-lg border-none bg-slate-100 py-2 pr-4 pl-10 text-sm outline-none focus:ring-2"
              />
            </div>
          </div>

          {/* Right: Actions & Profile */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
              <HiBell size={22} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full border border-white bg-red-500"></span>
            </button>

            <div className="mx-2 h-8 w-px bg-gray-200"></div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-gray-800">
                  {user?.name || 'Thomas Anree'}
                </p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || 'Super Admin'}</p>
              </div>
              <div className="bg-accent/10 border-accent/20 text-accent flex h-10 w-10 items-center justify-center rounded-full border">
                <HiOutlineUser size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
