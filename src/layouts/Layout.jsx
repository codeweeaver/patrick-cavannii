// src/layouts/Layout.jsx
import { AnimatePresence } from 'framer-motion';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';
import ScrollToTop from '../components/global/ScrollToTop';
import Navbar from '../components/navbar/Navbar';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-600">
      <ScrollToTop />
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <AnimatePresence mode="wait">
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
