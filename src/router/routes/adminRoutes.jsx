import { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import AdminLayout from '../../layouts/AdminLayout';
import AuthGuard from '../guards/AuthGuard';

// Lazy Pages
const AdminLogin = lazy(() => import('../../pages/admin/AdminLogin'));
const AdminManagement = lazy(() => import('../../pages/admin/AdminManagement'));

const Suspended = ({ children }) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;

export const adminRoutes = [
  {
    path: 'admin/login',
    element: (
      <Suspended>
        <AdminLogin />
      </Suspended>
    ),
  },
  {
    element: (
      <AuthGuard allowedRoles={['admin', 'super_admin']} loginPath="/admin/login" />
    ),
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [
          { index: true, element: <h2>Admin Dashboard</h2> },
          { path: 'products', element: <h2>Products</h2> },
          { path: 'orders', element: <h2>Orders</h2> },
          { path: 'customers', element: <h2>Customers</h2> },
          { path: 'blogs', element: <h2>Blogs</h2> },
          { path: 'settings', element: <h2>Settings</h2> },
          {
            element: <AuthGuard allowedRoles={['super_admin']} loginPath="/admin/login" />,
            children: [
              {
                path: 'admins',
                element: (
                  <Suspended>
                    <AdminManagement />
                  </Suspended>
                ),
              },
              { path: 'admins/create', element: <h2>Add Admin</h2> },
            ],
          },
        ],
      },
    ],
  },
];
