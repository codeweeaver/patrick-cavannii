import { useEffect, useMemo, useState } from 'react';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiGrid,
  FiList,
  FiSearch,
  FiX,
} from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import ProductCard from '../../components/products/ProductCard';
import ProductListItem from '../../components/products/ProductListItem';
import { useCurrency } from '../../context/CurrencyContext';
import { useCart } from '../../hooks/useCart';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
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

  const itemsPerPage = 9;

  const isFiltered =
    searchTerm !== '' ||
    selectedCategory !== 'Any' ||
    selectedBrand !== 'Any' ||
    selectedGender !== 'Any' ||
    selectedSize !== 'Any' ||
    minRating !== 'Any' ||
    maxPrice !== 'Any';

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search Match
      const sM = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Category Match - Fix: Handles p.categories being an array or a single string
      const cM =
        selectedCategory === 'Any' ||
        (Array.isArray(p.categories)
          ? p.categories.includes(selectedCategory)
          : p.category === selectedCategory);

      // Brand Match
      const bM = selectedBrand === 'Any' || p.brand === selectedBrand;

      // Gender Match
      const gM =
        selectedGender === 'Any' || p.gender?.toLowerCase() === selectedGender.toLowerCase();

      // Size Match - Fix: Handles size arrays
      const szM = selectedSize === 'Any' || (p.sizes && p.sizes.includes(selectedSize));

      // Rating & Price Match
      const rM = minRating === 'Any' || p.rating >= Number(minRating);
      const pM = maxPrice === 'Any' || Number(p.price) <= Number(maxPrice);

      return sM && cM && bM && gM && szM && rM && pM;
    });
  }, [
    products,
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    minRating,
    maxPrice,
  ]);

  const offset = currentPage * itemsPerPage;
  const currentItems = filteredProducts.slice(offset, offset + itemsPerPage);

  // Fetch Initial Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const [pRes, cRes, bRes] = await Promise.allSettled([
          fetch(`${baseUrl}/products?isExclusive=false`).then((r) => r.json()),
          fetch(`${baseUrl}/categories`).then((r) => r.json()),
          fetch(`${baseUrl}/brands`).then((r) => r.json()),
        ]);
        if (pRes.status === 'fulfilled') setProducts(pRes.value);
        if (cRes.status === 'fulfilled') setCategories(cRes.value);
        if (bRes.status === 'fulfilled') setBrands(bRes.value);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Reset pagination when any filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    minRating,
    maxPrice,
  ]);

  // Sync SearchParams from URL to State
  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setSelectedCategory(searchParams.get('category') || 'Any');
    setSelectedBrand(searchParams.get('brand') || 'Any');
    setSelectedGender(searchParams.get('gender') || 'Any');
    setSelectedSize(searchParams.get('size') || 'Any');
    setMinRating(searchParams.get('rating') || 'Any');
    setMaxPrice(searchParams.get('maxPrice') || 'Any');

    const urlPage = parseInt(searchParams.get('page') || '1') - 1;
    setCurrentPage(urlPage >= 0 ? urlPage : 0);
  }, [searchParams]);

  // Sync State to SearchParams (URL)
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

    setSearchParams(params, { replace: true });
  }, [
    searchTerm,
    selectedCategory,
    selectedBrand,
    selectedGender,
    selectedSize,
    minRating,
    maxPrice,
    currentPage,
    setSearchParams,
  ]);

  const handleAddToCart = (product) => {
    const variant =
      product.inventory?.variants?.find((v) => (v.stock || v.quantity) > 0) ||
      product.inventory?.variants?.[0];

    const sku = variant?.sku || product.inventory?.skuBase || `SKU-${product.id}`;

    const cartItem = {
      ...product,
      sku: sku,
      selectedColor: variant?.color || (product.colors && product.colors[0]) || 'Default',
      selectedSize: variant?.size || (product.sizes && product.sizes[0]) || 'Standard',
      quantity: 1,
      inventory: product.inventory,
    };

    addToCart(cartItem);
  };

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <div className="container pt-8">
          <div className="flex flex-col gap-8 md:flex-row">
            {/* Sidebar */}
            <aside
              className={`scrollbar-hide fixed inset-y-0 left-0 z-50 w-72 transform overflow-y-auto border-r border-gray-100 bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out md:shadow-none lg:sticky lg:top-24 lg:z-0 lg:h-[calc(100vh-120px)] lg:w-64 lg:translate-x-0 lg:rounded-2xl lg:border lg:bg-white/70 lg:backdrop-blur-md ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
              <div className="mb-6 flex items-center justify-between lg:hidden">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="rounded-full bg-gray-50 p-2 text-gray-500 transition-colors hover:bg-gray-200"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="mb-8 hidden items-center justify-between lg:flex">
                <h2 className="text-[11px] font-black tracking-[0.15em] text-gray-400 uppercase">
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
                    className="text-primary text-[10px] font-bold tracking-tighter uppercase transition-opacity hover:opacity-70"
                  >
                    Reset All
                  </button>
                )}
              </div>

              <div className="space-y-8">
                {/* Search Input */}
                <div className="space-y-3">
                  <label className="ml-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                    Search
                  </label>
                  <div className="group relative">
                    <FiSearch className="group-focus-within:text-primary absolute top-1/2 left-3.5 -translate-y-1/2 text-gray-400 transition-colors" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="focus:border-primary focus:ring-primary/10 w-full rounded-xl border border-gray-200 bg-white py-2.5 pr-4 pl-10 text-sm shadow-sm transition-all hover:border-gray-300 focus:outline-none"
                      placeholder="Find a product..."
                    />
                  </div>
                </div>

                <FilterDropdown
                  label="Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                />
                <FilterDropdown
                  label="Brand"
                  value={selectedBrand}
                  onChange={setSelectedBrand}
                  options={brands}
                />
                <FilterDropdown
                  label="Gender"
                  value={selectedGender}
                  onChange={setSelectedGender}
                  options={['men', 'women', 'unisex']}
                />
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
                    '28',
                    '30',
                    '32',
                    '34',
                    '36',
                    '7',
                    '8',
                    '9',
                    '10',
                  ]}
                />
                <FilterDropdown
                  label="Rating"
                  value={minRating}
                  onChange={setMinRating}
                  options={['4', '3', '2', '1']}
                  prefix="★ "
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="ml-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                      Max Price
                    </label>
                    <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-bold">
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
                    className="accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                  />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8 flex items-center justify-between md:hidden">
                <h1 className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
                  Store
                </h1>
                <button
                  onClick={() => setIsSidebarOpen((prev) => !prev)}
                  className="bg-primary shadow-primary/20 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-transform active:scale-95"
                >
                  <FiFilter size={18} /> Filters
                </button>
              </div>

              {isLoading ? (
                <LoadingSpinner />
              ) : filteredProducts.length === 0 ? (
                <NoResults />
              ) : (
                <>
                  <div className="mb-8 flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm ring-1 ring-gray-900/5">
                    <div className="flex flex-col">
                      <h2 className="text-sm font-bold text-gray-900 sm:text-base">
                        Browse Collection
                      </h2>
                      <p className="text-[11px] font-medium text-gray-400">
                        Showing <span className="text-gray-900">{currentItems.length}</span> of{' '}
                        <span className="text-gray-900">{filteredProducts.length}</span> results
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-xl border border-gray-100 bg-gray-50 p-1">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`rounded-lg p-2 transition-all ${viewMode === 'list' ? 'text-primary bg-white shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <FiList size={18} />
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`rounded-lg p-2 transition-all ${viewMode === 'grid' ? 'text-primary bg-white shadow-sm ring-1 ring-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                      >
                        <FiGrid size={18} />
                      </button>
                    </div>
                  </div>

                  <div
                    className={
                      viewMode === 'grid'
                        ? 'grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3'
                        : 'flex flex-col gap-5'
                    }
                  >
                    {currentItems.map((p) =>
                      viewMode === 'grid' ? (
                        <ProductCard
                          key={p.id}
                          product={p}
                          onAddToCart={() => handleAddToCart(p)}
                        />
                      ) : (
                        <ProductListItem
                          key={p.id}
                          product={p}
                          onAddToCart={() => handleAddToCart(p)}
                        />
                      ),
                    )}
                  </div>

                  <div className="mt-16 flex justify-center">
                    <ReactPaginate
                      pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
                      onPageChange={handlePageClick}
                      containerClassName="flex gap-2 items-center"
                      activeLinkClassName="!bg-primary !text-white !border-primary"
                      pageLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-primary transition-all text-sm font-bold text-gray-600 hover:scale-105 active:scale-95 shadow-sm"
                      previousLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-primary transition-all shadow-sm"
                      nextLinkClassName="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl hover:border-primary transition-all shadow-sm"
                      previousLabel={<FiChevronLeft size={18} />}
                      nextLabel={<FiChevronRight size={18} />}
                      forcePage={currentPage}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

const FilterDropdown = ({ label, value, onChange, options, prefix = '' }) => (
  <div className="space-y-3">
    <label className="ml-1 text-[11px] font-bold tracking-wide text-gray-400 uppercase">
      {label}
    </label>
    <div className="group relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:border-primary focus:ring-primary/10 w-full cursor-pointer appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm shadow-sm transition-all hover:border-gray-300 focus:outline-none"
      >
        <option value="Any">Any {label}</option>
        {options.map((opt, i) => {
          // Handle both object options {name, slug} and string options
          const optionValue = opt.slug || opt.name || opt;
          const optionLabel = opt.name || opt;
          return (
            <option key={optionValue + i} value={optionValue}>
              {prefix}
              {optionLabel}
            </option>
          );
        })}
      </select>
      <FiChevronDown className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-gray-400 transition-transform group-hover:translate-y-[-40%]" />
    </div>
  </div>
);

const NoResults = () => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-white/50 py-24 text-center backdrop-blur-sm">
    <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50 text-gray-200 shadow-inner">
      <FiFilter size={40} className="animate-pulse" />
    </div>
    <h3 className="mb-2 text-xl font-bold text-gray-900">
      No products match your current filters.
    </h3>
    <p className="text-sm text-gray-500">Try adjusting your filters or search term.</p>
  </div>
);

export default Products;
