// src/router/routes/authRoutes.jsx
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import AuthLayout from '../../layouts/AuthLayout';
import GuestGuard from '../guards/GuestGuard';

// Actions & Components
const Register = lazy(() => import('../../pages/Register'));
const Login = lazy(() => import('../../pages/Login'));
const ForgotPassword = lazy(() => import('../../pages/ForgotPassword'));
const Personal = lazy(() => import('../../pages/register/Personal'));
const Security = lazy(() => import('../../pages/register/Security'));
const Address = lazy(() => import('../../pages/register/Address'));

const Suspended = ({ children }) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;

export const authRoutes = [
  {
    element: <GuestGuard />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'register',
            element: (
              <Suspended>
                <Register />
              </Suspended>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspended>
                    <Personal />
                  </Suspended>
                ),
              },
              {
                path: 'security',
                element: (
                  <Suspended>
                    <Security />
                  </Suspended>
                ),
              },
              {
                path: 'address',
                element: (
                  <Suspended>
                    <Address />
                  </Suspended>
                ),
              },
            ],
          },
          {
            path: 'login',
            element: (
              <Suspended>
                <Login />
              </Suspended>
            ),
          },
          {
            path: 'forgot-password',
            element: (
              <Suspended>
                <ForgotPassword />
              </Suspended>
            ),
          },
        ],
      },
    ],
  },
];
