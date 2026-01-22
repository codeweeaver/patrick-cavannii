// c:/Users/CODEWEEAVER/Desktop/react-wp-app/patrick-cavanni/src/components/navbar/NavbarSearch.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useCallback, useRef } from 'react';
import {
  FiSearch,
  FiX,
  FiArrowRight,
  FiPackage,
  FiFileText,
  FiTag,
  FiHash,
  FiHelpCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const staticPages = [
  { name: 'Shipping Policy', url: '/help/shipping', type: 'Help' },
  { name: 'Return Center', url: '/help/returns', type: 'Help' },
  { name: 'Frequently Asked Questions', url: '/help/faq', type: 'Help' },
  { name: 'Privacy Policy', url: '/privacy-policy', type: 'Help' },
  { name: 'Terms & Conditions', url: '/terms-and-conditions', type: 'Help' },
  { name: 'Size Guide', url: '/help/size-guide', type: 'Help' },
];

const NavbarSearch = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchTimeout = useRef(null);

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  const saveToHistory = useCallback((term) => {
    if (!term || term.trim().length < 2) return;
    const trimmed = term.trim();
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase());
      const updated = [trimmed, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const performSearch = useCallback(async (query) => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      // Fire all requests at once for speed
      const [prodRes, blogRes, brandRes, catRes] = await Promise.all([
        fetch(`${baseUrl}/products?q=${trimmedQuery}&_limit=10`),
        fetch(`${baseUrl}/blogs?q=${trimmedQuery}&_limit=10`),
        fetch(`${baseUrl}/brands?q=${trimmedQuery}&_limit=10`),
        fetch(`${baseUrl}/categories?q=${trimmedQuery}&_limit=10`),
      ]);

      const products = await prodRes.json();
      const blogs = await blogRes.json();
      const brands = await brandRes.json();
      const categories = await catRes.json();

      // Client-side filter for static help pages
      const helpMatches = staticPages.filter((page) =>
        page.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
      );

      // Helper for secondary filtering to ensure strict matching in visible fields
      const matchesQuery = (text) =>
        text ? text.toLowerCase().includes(trimmedQuery.toLowerCase()) : false;

      // Combine and apply strict secondary filter
      const combinedResults = [
        ...products
          .filter((item) => matchesQuery(item.name) || matchesQuery(item.category))
          .map((item) => ({
            ...item,
            type: 'Product',
            link: `/products/${item.slug || item.id}`,
          })),
        ...blogs
          .filter((item) => matchesQuery(item.title) || matchesQuery(item.excerpt))
          .map((item) => ({ ...item, type: 'Blog', link: `/blogs/${item.id}` })),
        ...brands
          .filter((item) => matchesQuery(item.name))
          .map((item) => ({ ...item, type: 'Brand', link: `/products?brand=${item.name}` })),
        ...categories
          .filter((item) => matchesQuery(item.name))
          .map((item) => ({
            ...item,
            type: 'Category',
            link: `/products?category=${item.name}`,
          })),
        ...helpMatches.map((item) => ({ ...item, type: 'Help', link: item.url })),
      ];

      // Sort results by relevance (optional, but keep it simple for now)
      setResults(combinedResults);
    } catch (err) {
      console.error('Global search failed', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      performSearch(searchTerm);
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, performSearch]);

  // Prevent body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const resultsContainerRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();

      if (results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setActiveItemIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : prev));
        } else if (e.key === 'Enter' && activeItemIndex >= 0) {
          e.preventDefault();
          const activeItem = results[activeItemIndex];
          if (activeItem) {
            saveToHistory(searchTerm);
            window.location.href = activeItem.link; // Direct navigation for enter key
            onClose();
          }
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, activeItemIndex, searchTerm, saveToHistory]);

  // Scroll active item into view
  useEffect(() => {
    if (activeItemIndex >= 0 && resultsContainerRef.current) {
      const activeElement = resultsContainerRef.current.querySelector(
        `[data-index="${activeItemIndex}"]`,
      );
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeItemIndex]);

  // Reset active index when results change
  useEffect(() => {
    setActiveItemIndex(-1);
  }, [results]);

  // Clear search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setResults([]);
    }
  }, [isOpen]);

  const ResultSection = ({ title, items, icon: Icon, type, viewAllLink }) => {
    const filteredItems = items.filter((item) => item.type === type);
    if (filteredItems.length === 0) return null;

    return (
      <section className="mb-6 last:mb-0">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
            <Icon size={14} />
            {title}
          </h3>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              onClick={() => {
                saveToHistory(searchTerm);
                onClose();
              }}
              className="text-primary hover:text-primary-dark flex items-center gap-1 text-xs font-medium hover:underline"
            >
              View all
              <FiArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
          {filteredItems.map((item) => {
            const globalIndex = results.indexOf(item);
            const isActive = activeItemIndex === globalIndex;
            return (
              <Link
                key={`${type}-${item.id || item.name}`}
                to={item.link}
                data-index={globalIndex}
                onClick={() => {
                  saveToHistory(searchTerm);
                  onClose();
                }}
                className={`group flex items-center justify-between rounded-xl border p-3 transition-all hover:shadow-sm ${
                  isActive
                    ? 'border-primary ring-primary/20 bg-white shadow-sm ring-1'
                    : 'hover:border-primary/10 border-transparent bg-gray-50/50 hover:bg-white'
                }`}
                role="option"
                aria-selected={isActive}
              >
                <div className="flex items-center gap-3">
                  {item.image ? (
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  ) : (
                    <div className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                      <Icon size={20} />
                    </div>
                  )}
                  <div>
                    <p
                      className={`text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'group-hover:text-primary text-gray-900'}`}
                    >
                      {item.name || item.title}
                    </p>
                    <div className="flex items-center gap-2">
                      {item.category && <p className="text-xs text-gray-500">{item.category}</p>}
                      {item.type === 'Product' && item.price && (
                        <>
                          <span className="h-1 w-1 rounded-full bg-gray-300" />
                          <p className="text-primary text-xs font-bold">${item.price}</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <FiArrowRight
                  size={16}
                  className={`transition-all ${isActive ? 'text-primary translate-x-1' : 'group-hover:text-primary text-gray-300 group-hover:translate-x-1'}`}
                />
              </Link>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 py-8 sm:px-6 sm:py-20">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          {/* Search Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Global search"
          >
            {/* Search Header */}
            <div className="flex items-center gap-4 border-b border-gray-100 p-6">
              <div className="relative flex-1">
                <FiSearch
                  className={`absolute top-1/2 left-0 -translate-y-1/2 text-gray-400 transition-colors ${isLoading ? 'text-primary animate-pulse' : ''}`}
                  size={24}
                />
                <input
                  type="text"
                  placeholder="Search products, blogs, brands..."
                  className="w-full bg-transparent pl-10 text-xl font-light text-gray-900 placeholder-gray-400 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  aria-label="Search site content"
                />
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-red-500"
                aria-label="Close search overlay"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Search Results Area */}
            <div className="scrollbar-hide flex-1 overflow-y-auto p-6" ref={resultsContainerRef}>
              {searchTerm.length >= 2 ? (
                <>
                  {results.length > 0 ? (
                    <div className="space-y-8" role="listbox">
                      <ResultSection
                        title="Products"
                        items={results}
                        type="Product"
                        icon={FiPackage}
                        viewAllLink={`/products?search=${searchTerm}`}
                      />
                      <ResultSection
                        title="Articles"
                        items={results}
                        type="Blog"
                        icon={FiFileText}
                        viewAllLink={`/blogs?search=${searchTerm}`}
                      />
                      <ResultSection title="Brands" items={results} type="Brand" icon={FiTag} />
                      <ResultSection
                        title="Categories"
                        items={results}
                        type="Category"
                        icon={FiHash}
                      />
                      <ResultSection
                        title="Help & Support"
                        items={results}
                        type="Help"
                        icon={FiHelpCircle}
                      />

                      <div className="border-t border-gray-50 pt-4 text-center">
                        <p className="text-sm text-gray-500">
                          Found {results.length} results for "{searchTerm}"
                        </p>
                      </div>
                    </div>
                  ) : !isLoading ? (
                    <div className="py-20 text-center">
                      <div className="mb-4 flex justify-center text-gray-200">
                        <FiSearch size={48} />
                      </div>
                      <h3 className="mb-1 text-lg font-medium text-gray-900">No results found</h3>
                      <p className="text-gray-500">
                        We couldn't find anything matching "{searchTerm}".
                      </p>
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center">
                      <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8">
                  {recentSearches.length > 0 && (
                    <div className="mb-10">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                          Recent Searches
                        </h3>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('recentSearches');
                          }}
                          className="text-xs text-gray-400 hover:text-red-500"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="hover:border-primary hover:text-primary flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50/50 px-4 py-2 text-sm transition-all hover:bg-white"
                          >
                            <FiSearch size={14} className="text-gray-400" />
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="py-12 text-center">
                    <div className="text-primary/10 mb-6 flex justify-center">
                      <FiSearch size={64} />
                    </div>
                    <h3 className="mb-2 text-xl font-medium text-gray-900">
                      What are you looking for?
                    </h3>
                    <p className="mx-auto max-w-xs text-gray-500">
                      Search for products, collections, news, or help articles from our products.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer/Quick Links */}
            <div className="border-t border-gray-100 bg-gray-50/80 p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                  Trending:
                </span>
                {['Summer', 'Jeans', 'Dresses', 'Shoes'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="hover:border-primary hover:text-primary rounded-full border border-gray-200 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-all hover:shadow-sm"
                    aria-label={`Search for ${tag}`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default NavbarSearch;
