import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  FiArrowRight,
  FiFileText,
  FiHash,
  FiHelpCircle,
  FiPackage,
  FiSearch,
  FiTag,
  FiX,
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
  const [activeItemIndex, setActiveItemIndex] = useState(-1);

  const searchTimeout = useRef(null);
  const resultsContainerRef = useRef(null);
  const inputRef = useRef(null);

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

      const helpMatches = staticPages.filter((page) =>
        page.name.toLowerCase().includes(trimmedQuery.toLowerCase()),
      );

      const matchesQuery = (text) =>
        text ? text.toLowerCase().includes(trimmedQuery.toLowerCase()) : false;

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
            link: `/products?category=${item.slug || item.id}`,
          })),
        ...helpMatches.map((item) => ({ ...item, type: 'Help', link: item.url })),
      ];

      setResults(combinedResults);
    } catch (err) {
      console.error('Global search failed', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => performSearch(searchTerm), 300);
    return () => clearTimeout(searchTimeout.current);
  }, [searchTerm, performSearch]);

  // Handle Body Scroll and Keyboard Shortcuts (Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      // Auto focus input when opened
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Arrow Key Navigation
  useEffect(() => {
    const handleNavigation = (e) => {
      if (!isOpen || results.length === 0) return;

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
          window.location.href = activeItem.link;
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleNavigation);
    return () => window.removeEventListener('keydown', handleNavigation);
  }, [isOpen, results, activeItemIndex, searchTerm, saveToHistory, onClose]);

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

  useEffect(() => setActiveItemIndex(-1), [results]);

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
      <section className="mb-8 last:mb-0">
        <div className="mb-4 flex items-center justify-between px-1">
          <h3 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
            <Icon size={14} className="text-primary" />
            {title}
          </h3>
          {viewAllLink && (
            <Link
              to={viewAllLink}
              onClick={() => {
                saveToHistory(searchTerm);
                onClose();
              }}
              className="text-primary flex items-center gap-1 text-xs font-semibold hover:underline"
            >
              View all <FiArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-1">
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
                className={`group flex items-center justify-between rounded-xl p-3 transition-all ${
                  isActive
                    ? 'bg-primary ring-primary text-white shadow-md ring-1'
                    : 'bg-white hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={isActive}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 ${isActive ? 'bg-white/20' : ''}`}
                  >
                    {item.image ? (
                      <img src={item.image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Icon size={18} className={isActive ? 'text-white' : 'text-primary'} />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}
                    >
                      {item.name || item.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                        {item.category || item.type}
                      </p>
                      {item.type === 'Product' && item.price && (
                        <p
                          className={`text-xs font-bold ${isActive ? 'text-white' : 'text-primary'}`}
                        >
                          • ${item.price}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <FiArrowRight
                  size={16}
                  className={`transition-transform ${isActive ? 'translate-x-1 opacity-100' : 'opacity-0 group-hover:translate-x-1 group-hover:opacity-100'}`}
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
        <div className="fixed inset-0 z-100 flex items-start justify-center px-4 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          >
            {/* Improved Header Alignment */}
            <div className="flex items-center gap-4 border-b border-gray-100 px-6 py-5">
              <div className="relative flex flex-1 items-center">
                <FiSearch
                  className={`absolute left-0 text-gray-400 transition-colors ${isLoading ? 'text-primary animate-pulse' : ''}`}
                  size={22}
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search products, brands, or help..."
                  className="w-full bg-transparent pl-9 text-lg font-medium text-gray-900 placeholder-gray-400 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                aria-label="Close"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Results Area */}
            <div className="scrollbar-hide flex-1 overflow-y-auto p-6" ref={resultsContainerRef}>
              {searchTerm.length >= 2 ? (
                <div role="listbox">
                  {results.length > 0 ? (
                    <>
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

                      <div className="mt-6 border-t border-gray-50 pt-6 text-center">
                        <p className="text-xs font-medium text-gray-400">
                          {results.length} results for "{searchTerm}"
                        </p>
                      </div>
                    </>
                  ) : !isLoading ? (
                    <div className="py-20 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 text-gray-300">
                        <FiSearch size={32} />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">No results found</h3>
                      <p className="text-sm text-gray-500">
                        Try checking your spelling or use more general terms.
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center py-20">
                      <div className="border-primary h-10 w-10 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-4">
                  {recentSearches.length > 0 && (
                    <div className="mb-10">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                          Recent Searches
                        </h3>
                        <button
                          onClick={() => {
                            setRecentSearches([]);
                            localStorage.removeItem('recentSearches');
                          }}
                          className="text-xs font-semibold text-gray-400 hover:text-red-500"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => setSearchTerm(term)}
                            className="hover:border-primary hover:text-primary flex items-center gap-2 rounded-full border border-gray-100 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-white"
                          >
                            <FiSearch size={14} /> {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="py-4 text-center">
                    <div className="bg-primary/5 text-primary mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full">
                      <FiSearch size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Looking for something?</h3>
                    <p className="mx-auto mt-2 max-w-[280px] text-sm text-gray-500">
                      Search our entire catalog of products, collections, and articles.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Trending Tags Footer */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                  Trending:
                </span>
                {['summer', 'tops', 'dress', 'new arrival'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="hover:ring-primary hover:text-primary rounded-full bg-white px-4 py-1.5 text-xs font-bold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-all"
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
