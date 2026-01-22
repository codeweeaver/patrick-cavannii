import { lazy, Suspense } from 'react';
import { useRoutes } from 'react-router-dom';
import LoadingSpinner from '../components/global/LoadingSpinner';

// Route Modules
import { adminRoutes } from './routes/adminRoutes';
import { authRoutes } from './routes/authRoutes';
import { publicRoutes } from './routes/publicRoutes';

// Global Lazy Pages
const NotFound = lazy(() => import('../pages/NotFound'));
const Unauthorized = lazy(() => import('../pages/Unauthorized'));
const TermsAndConditions = lazy(() => import('../pages/TermsAndConditions'));

const AppRoutes = () => {
  const routes = [
    {
      path: '/',
      children: [
        ...publicRoutes,
        ...authRoutes,
        ...adminRoutes,
        {
          path: 'unauthorized',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <Unauthorized />
            </Suspense>
          ),
        },
        {
          path: 'terms-and-conditions',
          element: (
            <Suspense>
              <TermsAndConditions />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: (
            <Suspense fallback={<LoadingSpinner />}>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
  ];

  return useRoutes(routes);
};

export default AppRoutes;
