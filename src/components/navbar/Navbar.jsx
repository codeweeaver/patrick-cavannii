import { AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import NavbarRight from '../navbar/NavbarRight.jsx';
import NavbarLinks from './NavbarLinks.jsx';
import NavbarSearch from './NavbarSearch';

// Import images
import slideImage1 from '../../assets/images/product_002.jpg';
import slideImage3 from '../../assets/images/product_003.jpg';
import slideImage2 from '../../assets/images/product_004.jpg';
import MoblieNavbar from './MoblieNavbar.jsx';
import NavbarLeft from './NavbarLeft.jsx';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [categories, setCategories] = useState([]);

  const brands = [
    { name: 'gucci', id: 'ced1' },
    { name: 'nike', id: 'ec79' },
    { name: 'versace', id: '72d7' },
    { name: 'fendi', id: '73cd' },
    { name: 'burberry', id: '39fa' },
  ];

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const catRes = await fetch(`${baseUrl}/categories`);

        if (catRes.ok) {
          const catData = await catRes.json();
          // Assuming your API returns { "categories": [...] } or just [...]
          const rawCategories = Array.isArray(catData) ? catData : catData.categories || [];
          setCategories(rawCategories);
        }
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };
    fetchDropdownData();
  }, []);

  // Helper function to filter categories by gender
  const getFilteredCategories = (targetGender) => {
    return categories
      .filter((cat) => cat.gender === targetGender || cat.gender === 'unisex')
      .map((cat) => ({
        name: cat.name,
        params: cat.slug || cat.id,
      }));
  };

  const pageNavLinks = [
    { name: 'HOME', path: '/' },
    {
      name: 'STORE',
      path: '/products',
      dropdown: {
        slides: [
          { image: slideImage2, title: 'New Arrivals' },
          { image: slideImage1, title: 'Summer Collection' },
          { image: slideImage3, title: 'Special Offers' },
        ],
        // Dynamically filtered columns
        men: getFilteredCategories('men'),
        women: getFilteredCategories('women'),
        brands: brands.map((brand) => ({
          name: brand.name,
          params: brand.slug || brand.name,
        })),
        collections: [
          { name: 'Haute-Couture', params: 'haute-couture' },
          { name: 'Cavanni Wardrobe', params: 'cavanni-wardrobe' },
          { name: 'Exclusive Collection', params: 'exclusive' },
        ],
      },
    },
    { name: 'OUR BLOGS', path: '/blogs' },
    { name: 'ABOUT US', path: '/about' },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white shadow-sm">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <NavbarLeft mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

            <NavbarLinks pageNavLinks={pageNavLinks} />

            <NavbarRight toggleSearch={() => setShowSearch(!showSearch)} />
          </div>
        </div>
      </nav>

      <NavbarSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />

      <AnimatePresence>
        {mobileMenuOpen && (
          <MoblieNavbar pageNavLinks={pageNavLinks} onClose={() => setMobileMenuOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
