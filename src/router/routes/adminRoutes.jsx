// src/router/routes/adminRoutes.jsx
import AdminLayout from '../../layouts/AdminLayout';
import AuthGuard from '../guards/AuthGuard';

export const adminRoutes = [
  {
    element: <AuthGuard allowedRoles={['admin']} />,
    children: [
      {
        path: 'admin',
        element: <AdminLayout />,
        children: [{ index: true, element: <h2>Admin Dashboard</h2> }],
      },
    ],
  },
];
