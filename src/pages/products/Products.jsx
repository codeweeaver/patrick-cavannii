import { useEffect, useState } from 'react';
import {
    FiChevronDown,
    FiChevronLeft,
    FiChevronRight,
    FiFilter,
    FiGrid,
    FiList,
    FiSearch,
    FiX,
} from 'react-icons/fi'; // Added for icons
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import ProductCard from '../../components/global/ProductCard';
import ProductListItem from '../../components/global/ProductListItem';
import { useCurrency } from '../../context/CurrencyContext';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- Filter State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Any');
  const [selectedBrand, setSelectedBrand] = useState('Any');
  const [selectedGender, setSelectedGender] = useState('Any');
  const [selectedSize, setSelectedSize] = useState('Any');
  const [minRating, setMinRating] = useState('Any');
  const [maxPrice, setMaxPrice] = useState('Any');

  const [currentPage, setCurrentPage] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  const isFiltered =
    searchTerm !== '' ||
    selectedCategory !== 'Any' ||
    selectedBrand !== 'Any' ||
    selectedGender !== 'Any' ||
    selectedSize !== 'Any' ||
    minRating !== 'Any' ||
    maxPrice !== 'Any';

  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [productsRes, categoriesRes, brandsRes] = await Promise.allSettled([
          fetch(`${import.meta.env.VITE_API_URL}/products`).then((res) => res.json()),
          fetch(`${import.meta.env.VITE_API_URL}/categories`).then((res) => res.json()),
          fetch(`${import.meta.env.VITE_API_URL}/brands`).then((res) => res.json()),
        ]);

        if (productsRes.status === 'fulfilled') setProducts(productsRes.value);
        else console.error('Failed to load products');

        if (categoriesRes.status === 'fulfilled') setCategories(categoriesRes.value);
        else setCategories([]);

        if (brandsRes.status === 'fulfilled') setBrands(brandsRes.value);
        else setBrands(['nike', 'adidas', 'puma']);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // 1. URL -> State (Single source of truth for initialization and external changes)
  useEffect(() => {
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'Any';
    const brand = searchParams.get('brand') || 'Any';
    const gender = searchParams.get('gender') || 'Any';
    const size = searchParams.get('size') || 'Any';
    const rating = searchParams.get('rating') || 'Any';
    const price = searchParams.get('maxPrice') || 'Any';
    const page = parseInt(searchParams.get('page') || '1') - 1;

    // We only update if there's an actual difference to avoid unnecessary re-renders
    if (search !== searchTerm) setSearchTerm(search);
    if (category !== selectedCategory) setSelectedCategory(category);
    if (brand !== selectedBrand) setSelectedBrand(brand);
    if (gender !== selectedGender) setSelectedGender(gender);
    if (size !== selectedSize) setSelectedSize(size);
    if (rating !== minRating) setMinRating(rating);
    if (price !== maxPrice) setMaxPrice(price);
    if (page !== currentPage && page >= 0) setCurrentPage(page);
  }, [searchParams.toString()]); // Use string for stable comparison

  // 2. State -> URL (Sync local changes back to URL)
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCategory !== 'Any') params.set('category', selectedCategory);
    if (selectedBrand !== 'Any') params.set('brand', selectedBrand);
    if (selectedGender !== 'Any') params.set('gender', selectedGender);
    if (selectedSize !== 'Any') params.set('size', selectedSize);
    if (minRating !== 'Any') params.set('rating', minRating);
    if (maxPrice !== 'Any') params.set('maxPrice', maxPrice);
    if (currentPage > 0) params.set('page', (currentPage + 1).toString());

    // Only update if the string representation changed to avoid infinite loops
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    minRating,
    maxPrice,
    currentPage,
  ]);

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    window.scrollTo(0, 0);
  };

  return (
    <AnimatedPage>
      <div className="bg-accent/2 min-h-screen pb-20">
        {/* --- ANILIST STYLE FILTER BAR --- */}
        <div className="container pt-8">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* --- SIDEBAR FILTER --- */}
            <aside
              className={`scrollbar-hide fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto border-r border-gray-100 bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out md:shadow-none lg:sticky lg:top-24 lg:z-0 lg:h-[calc(100vh-120px)] lg:w-64 lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-white/50 lg:backdrop-blur-sm ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <h2 className="text-xl font-bold tracking-tight text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-100"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="mb-6 hidden items-center justify-between lg:flex">
                <h2 className="text-sm font-bold tracking-wider text-gray-900 uppercase">
                  Filters
                </h2>
                {isFiltered && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Any');
                      setSelectedBrand('Any');
                      setSelectedGender('Any');
                      setSelectedSize('Any');
                      setMinRating('Any');
                      setMaxPrice('Any');
                    }}
                    className="text-primary hover:text-primary-dark text-xs font-semibold transition-colors hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>

              {isFiltered && !isSidebarOpen && (
                <div className="mb-6 flex flex-wrap gap-2 lg:hidden">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('Any');
                      setSelectedBrand('Any');
                      setSelectedGender('Any');
                      setSelectedSize('Any');
                      setMinRating('Any');
                      setMaxPrice('Any');
                      setIsSidebarOpen(false);
                    }}
                    className="bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  >
                    Clear All <FiX size={12} />
                  </button>
                </div>
              )}

              <div className="space-y-8">
                {/* Search */}
                <div className="space-y-3">
                  <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                    Search
                  </label>
                  <div className="group relative">
                    <FiSearch className="group-focus-within:text-primary absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 transition-colors" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm placeholder-gray-400 shadow-sm transition-all focus:ring-4 focus:outline-none"
                      placeholder="Enter name..."
                    />
                  </div>
                </div>

                {/* Categories */}
                <FilterDropdown
                  label="Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                />

                {/* Brands */}
                <FilterDropdown
                  label="Brand"
                  value={selectedBrand}
                  onChange={setSelectedBrand}
                  options={brands}
                />

                {/* Gender */}
                <FilterDropdown
                  label="Gender"
                  value={selectedGender}
                  onChange={setSelectedGender}
                  options={['men', 'women', 'unisex']}
                />

                {/* Size */}
                <FilterDropdown
                  label="Size"
                  value={selectedSize}
                  onChange={setSelectedSize}
                  options={[
                    'XS',
                    'S',
                    'M',
                    'L',
                    'XL',
                    'XXL',
                    'One Size',
                    '28',
                    '30',
                    '32',
                    '34',
                    '36',
                    '7',
                    '8',
                    '9',
                    '10',
                    '11',
                  ]}
                />

                {/* Rating */}
                <FilterDropdown
                  label="Rating"
                  value={minRating}
                  onChange={setMinRating}
                  options={['4', '3', '2', '1']}
                  prefix="★ "
                />

                {/* Price Range */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
                      Max Price
                    </label>
                    <span className="text-primary text-xs font-bold">
                      {maxPrice === 'Any' ? formatPrice(1000) : formatPrice(maxPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    step="10"
                    value={maxPrice === 'Any' ? 1000 : maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 transition-all hover:bg-gray-300"
                  />
                  <div className="flex items-center justify-between px-1 text-[10px] font-medium text-gray-400">
                    <span>{formatPrice(0)}</span>
                    <span>{formatPrice(1000)}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* --- PRODUCT GRID --- */}
            <div className="container my-10">
              {/* Mobile Filter Header */}
              <div className="mb-10 flex items-center justify-between md:hidden">
                <h1 className="text-2xl font-black tracking-tight text-gray-900 uppercase">
                  Store
                </h1>
                <button
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="bg-primary shadow-primary/20 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all active:scale-95"
                >
                  <FiFilter size={18} /> Filters
                </button>
              </div>

              {isLoading ? (
                <LoadingSpinner />
              ) : (
                (() => {
                  const filtered = products.filter((p) => {
                    const searchMatch =
                      !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
                    const catMatch = selectedCategory === 'Any' || p.category === selectedCategory;
                    const brandMatch = selectedBrand === 'Any' || p.brand === selectedBrand;
                    const genderMatch = selectedGender === 'Any' || p.gender === selectedGender;
                    const sizeMatch =
                      selectedSize === 'Any' || (p.sizes && p.sizes.includes(selectedSize));
                    const ratingMatch = minRating === 'Any' || p.rating >= Number(minRating);
                    const priceMatch = maxPrice === 'Any' || Number(p.price) <= Number(maxPrice);
                    return (
                      searchMatch &&
                      catMatch &&
                      brandMatch &&
                      genderMatch &&
                      sizeMatch &&
                      ratingMatch &&
                      priceMatch
                    );
                  });

                  if (filtered.length === 0) return <NoResults />;

                  const offset = currentPage * itemsPerPage;
                  const currentItems = filtered.slice(offset, offset + itemsPerPage);

                  return (
                    <>
                      {/* toolbar */}
                      <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-white/80 p-4 shadow-sm backdrop-blur-md">
                        <div className="flex flex-col">
                          <h2 className="text-sm font-bold tracking-tight text-gray-900 sm:text-lg">
                            All Products
                          </h2>
                          <p className="text-xs text-gray-500">
                            Showing {currentItems.length} of {filtered.length} results
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
                            <button
                              onClick={() => setViewMode('list')}
                              className={`group flex items-center justify-center rounded-lg p-2 transition-all ${
                                viewMode === 'list'
                                  ? 'text-primary bg-white shadow-sm ring-1 ring-gray-200'
                                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                              }`}
                              title="List view"
                            >
                              <FiList size={18} />
                            </button>
                            <button
                              onClick={() => setViewMode('grid')}
                              className={`group flex items-center justify-center rounded-lg p-2 transition-all ${
                                viewMode === 'grid'
                                  ? 'text-primary bg-white shadow-sm ring-1 ring-gray-200'
                                  : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                              }`}
                              title="Grid view"
                            >
                              <FiGrid size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* all products */}
                      <div
                        className={
                          viewMode === 'grid'
                            ? 'grid grid-cols-1 gap-x-4 gap-y-8 md:grid-cols-2 lg:grid-cols-3'
                            : 'flex flex-col gap-4'
                        }
                      >
                        {currentItems.map((product) =>
                          viewMode === 'grid' ? (
                            <ProductCard key={product.id} product={product} />
                          ) : (
                            <ProductListItem key={product.id} product={product} />
                          ),
                        )}
                      </div>
                      <div className="mt-16 flex justify-center">
                        <ReactPaginate
                          pageCount={Math.ceil(filtered.length / itemsPerPage)}
                          onPageChange={handlePageClick}
                          containerClassName="flex gap-2 items-center"
                          activeLinkClassName="!bg-primary !text-white !border-primary"
                          pageLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all font-medium text-sm cursor-pointer"
                          previousLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
                          nextLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:border-primary hover:text-primary transition-all cursor-pointer"
                          disabledLinkClassName="opacity-40 cursor-not-allowed"
                          previousLabel={<FiChevronLeft size={18} />}
                          nextLabel={<FiChevronRight size={18} />}
                          forcePage={currentPage}
                          breakLabel="..."
                          breakClassName="text-gray-400 px-2"
                        />
                      </div>
                    </>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

// --- Helper Components ---

const FilterDropdown = ({ label, value, onChange, options, prefix = '' }) => (
  <div className="space-y-3">
    <label className="ml-1 text-[11px] font-bold tracking-widest text-gray-400 uppercase">
      {label}
    </label>
    <div className="group relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:border-primary focus:ring-primary/10 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm transition-all focus:ring-4 focus:outline-none"
      >
        <option value="Any">Any</option>
        {options.map((opt, index) => (
          <option key={opt.name || opt || index} value={opt.name || opt}>
            {prefix}
            {opt.name || opt}
          </option>
        ))}
      </select>
      <FiChevronDown className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 transition-colors group-hover:text-gray-600" />
    </div>
  </div>
);

const NoResults = () => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-white/50 py-24 text-center backdrop-blur-sm">
    <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50 text-gray-200">
      <FiFilter size={40} />
    </div>
    <h3 className="mb-2 text-lg font-bold text-gray-900">
      No products match your current filters.
    </h3>
    <p className="text-sm text-gray-500">
      Try adjusting your search or filters to find what you're looking for.
    </p>
  </div>
);

export default Products;
