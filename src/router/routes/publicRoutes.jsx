// src/router/routes/publicRoutes.jsx
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import HelpLayout from '../../layouts/HelpLayout';
import Layout from '../../layouts/Layout';

// Lazy Pages
const Home = lazy(() => import('../../pages/Home'));
const About = lazy(() => import('../../pages/About'));
const Blogs = lazy(() => import('../../pages/blogs/Blogs'));
const BlogDetails = lazy(() => import('../../pages/blogs/BlogDetails'));
const Products = lazy(() => import('../../pages/products/Products'));
const ProductDetail = lazy(() => import('../../pages/products/productDetail'));

// Help Pages (Assuming these are not lazy based on original file, but you can make them lazy if needed)
const HelpContact = lazy(() => import('../../pages/help/HelpContact'));
const HelpOrder = lazy(() => import('../../pages/help/HelpOrder'));
const HelpPayment = lazy(() => import('../../pages/help/HelpPayment'));
const HelpReturn = lazy(() => import('../../pages/help/HelpReturn'));
const HelpShipping = lazy(() => import('../../pages/help/HelpShipping'));

// src/router/routes/userRoutes.jsx
import CheckoutLayout from '../../layouts/CheckoutLayout';
import UserProfileLayout from '../../layouts/UserProfileLayout';
import AuthGuard from '../guards/AuthGuard';

//User Profiles Pages
const UserOrders = lazy(() => import('../../pages/profile/UserOrders'));
const UserSettings = lazy(() => import('../../pages/profile/UserSettings'));
const TwoFactorSetup = lazy(() => import('../../pages/profile/TwoFactorSetup'));
const UserWishlist = lazy(() => import('../../pages/profile/UserWishlist'));
const UserReviews = lazy(() => import('../../pages/profile/UserReviews'));
const UserOverview = lazy(() => import('../../pages/profile/UserOverview'));
const AddressList = lazy(() => import('../../pages/profile/AddressList'));
const AddressForm = lazy(() => import('../../pages/profile/AddressForm'));

// Exclusive Products
const ExclusiveProducts = lazy(() => import('../../pages/products/ExclusiveProducts'));
const ExclusiveProductDetails = lazy(() => import('../../pages/products/ExclusiveProductDetails'));

// Checkout Pages
const Cart = lazy(() => import('../../pages/Cart'));
const CheckoutAddresses = lazy(() => import('../../pages/checkout/CheckoutAddresses'));
const CheckoutPayment = lazy(() => import('../../pages/checkout/CheckoutPayment'));
const CheckoutShipping = lazy(() => import('../../pages/checkout/CheckoutShipping'));

const Suspended = ({ children }) => <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>;

export const publicRoutes = [
  {
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspended>
            <Home />
          </Suspended>
        ),
      },
      {
        path: 'products',
        element: (
          <Suspended>
            <Products />
          </Suspended>
        ),
      },
      {
        path: 'products/:productId',
        element: (
          <Suspended>
            <ProductDetail />
          </Suspended>
        ),
      },
      {
        path: 'blogs',
        element: (
          <Suspended>
            <Blogs />
          </Suspended>
        ),
      },
      {
        path: 'blogs/:blogId',
        element: (
          <Suspended>
            <BlogDetails />
          </Suspended>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspended>
            <About />
          </Suspended>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspended>
            <Cart />
          </Suspended>
        ),
      },

      // Protected Routes
      {
        element: <AuthGuard allowedRoles={['customer']} />,
        children: [
          {
            path: 'exclusive',
            element: (
              <Suspended>
                <ExclusiveProducts />
              </Suspended>
            ),
          },
          {
            path: 'exclusive/:id',
            element: (
              <Suspended>
                <ExclusiveProductDetails />
              </Suspended>
            ),
          },

          // Checkout Flow
          {
            path: 'checkout',
            element: (
              <Suspended>
                <CheckoutLayout />
              </Suspended>
            ),
            children: [
              {
                index: true,
                element: (
                  <Suspended>
                    <CheckoutAddresses />
                  </Suspended>
                ),
              },
              {
                path: 'shipping',
                element: (
                  <Suspended>
                    <CheckoutShipping />
                  </Suspended>
                ),
              },
              {
                path: 'payment',
                element: (
                  <Suspended>
                    <CheckoutPayment />
                  </Suspended>
                ),
              },
            ],
          },

          // User Profile Flow
          {
            path: 'profile',
            element: <UserProfileLayout />,
            children: [
              {
                index: true,
                element: (
                  <Suspended>
                    <UserOverview />
                  </Suspended>
                ),
              },
              {
                path: 'address',
                element: (
                  <Suspended>
                    <AddressList />
                  </Suspended>
                ),
              },
              {
                path: 'address/create',
                element: (
                  <Suspended>
                    <AddressForm />
                  </Suspended>
                ),
              },
              {
                path: 'address/edit/:id',
                element: (
                  <Suspended>
                    <AddressForm />
                  </Suspended>
                ),
              },
              {
                path: 'orders',
                element: (
                  <Suspended>
                    <UserOrders />
                  </Suspended>
                ),
              },
              {
                path: 'wishlist',
                element: (
                  <Suspended>
                    <UserWishlist />
                  </Suspended>
                ),
              },
              {
                path: 'reviews',
                element: (
                  <Suspended>
                    <UserReviews />
                  </Suspended>
                ),
              },
              {
                path: 'settings',
                element: (
                  <Suspended>
                    <UserSettings />
                  </Suspended>
                ),
              },
              {
                path: 'settings/2fa',
                element: (
                  <Suspended>
                    <TwoFactorSetup />
                  </Suspended>
                ),
              },
            ],
          },
        ],
      },

      // Help Center
      {
        path: 'help-center',
        element: <HelpLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspended>
                <HelpPayment />
              </Suspended>
            ),
          },
          {
            path: 'order',
            element: (
              <Suspended>
                <HelpOrder />
              </Suspended>
            ),
          },
          {
            path: 'return',
            element: (
              <Suspended>
                <HelpReturn />
              </Suspended>
            ),
          },
          {
            path: 'shipping',
            element: (
              <Suspended>
                <HelpShipping />
              </Suspended>
            ),
          },
          {
            path: 'contact',
            element: (
              <Suspended>
                <HelpContact />
              </Suspended>
            ),
          },
          {
            path: 'payment',
            element: (
              <Suspended>
                <HelpPayment />
              </Suspended>
            ),
          },
        ],
      },
    ],
  },
];
