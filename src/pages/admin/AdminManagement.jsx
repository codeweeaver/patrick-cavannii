import { yupResolver } from '@hookform/resolvers/yup';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { HiPencil, HiPlus, HiTrash } from 'react-icons/hi';
import * as yup from 'yup';

// Validation Schema
const adminSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: yup.string().oneOf(['admin', 'super_admin'], 'Invalid role').required('Role is required'),
});

const AdminManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data - Replace with useCrud('/users') later
  const admins = [
    {
      id: 1,
      name: 'Thomas Anree',
      email: 'thomas@example.com',
      role: 'super_admin',
      status: 'active',
    },
    {
      id: 2,
      name: 'Sarah Connor',
      email: 'sarah@example.com',
      role: 'admin',
      status: 'blocked',
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(adminSchema),
  });

  const onSubmit = (data) => {
    console.log('New Admin Data:', data);
    // Call registerUser here
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage system administrators and their privileges.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent hover:bg-accent/90 shadow-accent/20 flex items-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white shadow-lg transition-all"
          style={{ backgroundColor: 'var(--accent)' }}
        >
          <HiPlus size={20} />
          Add New Admin
        </button>
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <th className="px-6 py-4">Admin User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {admins.map((admin) => (
                <tr key={admin.id} className="transition-colors hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500">
                        {admin.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{admin.name}</p>
                        <p className="text-sm text-gray-500">{admin.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        admin.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      } `}
                    >
                      {admin.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                        admin.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      } `}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          admin.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></span>
                      {admin.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="hover:text-accent hover:bg-accent/10 rounded-lg p-2 text-gray-400 transition-colors">
                        <HiPencil size={18} />
                      </button>
                      <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                        <HiTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="mb-6 text-xl font-bold text-gray-900">Add New Admin</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    {...register('name')}
                    className="focus:ring-accent/20 focus:border-accent w-full rounded-xl border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2"
                    placeholder="e.g. John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    {...register('email')}
                    className="focus:ring-accent/20 focus:border-accent w-full rounded-xl border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2"
                    placeholder="john@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    {...register('password')}
                    className="focus:ring-accent/20 focus:border-accent w-full rounded-xl border border-gray-200 px-4 py-2 transition-all outline-none focus:ring-2"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
                  <select
                    {...register('role')}
                    className="focus:ring-accent/20 focus:border-accent w-full rounded-xl border border-gray-200 bg-white px-4 py-2 transition-all outline-none focus:ring-2"
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                  {errors.role && (
                    <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
                  )}
                </div>
                <div className="mt-8 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 shadow-accent/20 flex-1 rounded-xl px-4 py-2.5 font-medium text-white shadow-lg transition-all"
                    style={{ backgroundColor: 'var(--accent)' }}
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminManagement;
