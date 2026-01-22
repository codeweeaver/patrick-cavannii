import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import NavbarRight from '../navbar/NavbarRight.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarSearch from './NavbarSearch';

//import images
import slideImage1 from '../../assets/images/product_002.jpg';
import slideImage3 from '../../assets/images/product_003.jpg';
import slideImage2 from '../../assets/images/product_004.jpg';
import MoblieNavbar from './MoblieNavbar.jsx';
import NavbarLeft from './NavbarLeft.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const [catRes, brandRes] = await Promise.all([
          fetch(`${baseUrl}/categories`),
          fetch(`${baseUrl}/brands`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        if (brandRes.ok) {
          const brandData = await brandRes.json();
          setBrands(brandData);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdownData();
  }, []);

  const pageNavLinks = [
    { name: 'HOME', path: '/' },
    { name: 'STORE', path: '/products' },
    {
      name: 'CAVANNI WARDROBE',
      path: '/products',
      dropdown: {
        slides: [
          {
            image: slideImage2,
            title: 'New Arrivals',
          },
          {
            image: slideImage1,
            title: 'Summer Collection',
          },
          {
            image: slideImage3,
            title: 'Special Offers',
          },
        ],
        men: categories.map((cat) => ({
          name: cat.name,
          params: cat.name,
        })),
        women: categories.map((cat) => ({
          name: cat.name,
          params: cat.name,
        })),
        brands: brands.map((brand) => ({
          name: brand.name,
          params: brand.name,
        })),
        collections: [
            {
                name: "Cavanni Wardrobe",
                params: "/collections/cavanni-wardrobe",
            },
            {
                name: "Exclusive Collection",
                params: "/collections/exclusive-collections",
            }
        ]
      },
    },
    { name: 'OUR BLOGS', path: '/blogs' },
    { name: 'ABOUT US', path: '/about' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
    hover: { scale: 1.05 },
  };

  return (
    <>
      <nav className="sticky top-0 z-20 w-full bg-white shadow-sm">
        {/* Headers Section */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Navbar Left */}
            <NavbarLeft mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            {/* Nav Links */}
            <NavbarLinks pageNavLinks={pageNavLinks} />

            {/* Navbar Right Seation */}
            <NavbarRight
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              toggleSearch={() => setShowSearch(!showSearch)}
            />
          </div>
        </div>
      </nav>
      {/* Search Component */}
      <NavbarSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MoblieNavbar pageNavLinks={pageNavLinks} onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
