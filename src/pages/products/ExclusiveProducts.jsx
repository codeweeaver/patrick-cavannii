import { useEffect, useMemo, useState } from 'react';
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiRotateCcw,
  FiSearch,
} from 'react-icons/fi';
import ReactPaginate from 'react-paginate';
import { useSearchParams } from 'react-router-dom';
import AnimatedPage from '../../components/global/AnimatedPage';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import ExclusiveProductCard from '../../components/products/ExclusiveProductCard';
import { useCurrency } from '../../context/CurrencyContext';

const ExclusiveProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { formatPrice } = useCurrency();
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const itemsPerPage = 12;

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
      const sM = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const cM =
        selectedCategory === 'Any' ||
        (Array.isArray(p.categories)
          ? p.categories.includes(selectedCategory)
          : p.category === selectedCategory);
      const bM = selectedBrand === 'Any' || p.brand === selectedBrand;
      const gM =
        selectedGender === 'Any' || p.gender?.toLowerCase() === selectedGender.toLowerCase();
      const szM = selectedSize === 'Any' || (p.sizes && p.sizes.includes(selectedSize));
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('Any');
    setSelectedBrand('Any');
    setSelectedGender('Any');
    setSelectedSize('Any');
    setMinRating('Any');
    setMaxPrice('Any');
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const [pRes, cRes, bRes] = await Promise.allSettled([
          fetch(`${baseUrl}/products?isExclusive=true`).then((r) => r.json()),
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

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50/50 pb-20">
        <div className="container mx-auto px-4 pt-12">
          {/* 1. Header & Toolbar Area */}
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gray-200 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-gray-900 uppercase lg:text-4xl">
                Exclusive <span className="text-primary font-accent opacity-60">Archive</span>
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">
                Luxury Essentials • {filteredProducts.length} Pieces
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex h-11 items-center gap-2 rounded-full border px-6 text-sm font-bold shadow-sm transition-all active:scale-95 ${
                  showAdvancedFilters
                    ? 'bg-primary border-primary shadow-primary/20 text-white'
                    : 'hover:border-primary/50 border-gray-200 bg-white text-gray-900'
                }`}
              >
                <FiFilter className={showAdvancedFilters ? 'animate-pulse' : ''} />
                {showAdvancedFilters ? 'Close Filters' : 'Filter & Search'}
              </button>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-500 transition-all hover:bg-red-500 hover:text-white"
                >
                  <FiRotateCcw size={18} />
                </button>
              )}
            </div>
          </div>

          {/* 2. Top Filter Dashboard */}
          <div
            className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
              showAdvancedFilters ? 'mb-12 max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="rounded-4xl border border-white/40 bg-white/70 p-8 shadow-2xl shadow-gray-200/40 backdrop-blur-xl">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                <div className="space-y-2 lg:col-span-2">
                  <label className="ml-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                    Keywords
                  </label>
                  <div className="relative">
                    <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search product name..."
                      className="focus:ring-primary/20 focus:border-primary h-12 w-full rounded-2xl border-transparent bg-white/80 pr-4 pl-11 text-sm font-medium transition-all outline-none focus:bg-white focus:ring-2"
                    />
                  </div>
                </div>

                <HorizontalFilter
                  label="Category"
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories}
                />
                <HorizontalFilter
                  label="Brand"
                  value={selectedBrand}
                  onChange={setSelectedBrand}
                  options={brands}
                />
                <HorizontalFilter
                  label="Gender"
                  value={selectedGender}
                  onChange={setSelectedGender}
                  options={['Men', 'Women', 'Unisex']}
                />
                {/* <HorizontalFilter
                  label="Size"
                  value={selectedSize}
                  onChange={setSelectedSize}
                  options={['XS', 'S', 'M', 'L', 'XL']}
                /> */}
                {/* <HorizontalFilter
                  label="Rating"
                  value={minRating}
                  onChange={setMinRating}
                  options={['4', '3', '2', '1']}
                  prefix="★ "
                /> */}

                {/* Price Slider - Theme Primary */}
                {/* <div className="space-y-4 pt-2">
                  <div className="flex justify-between">
                    <label className="ml-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                      Max Price
                    </label>
                    <span className="text-primary text-xs font-bold">
                      {formatPrice(maxPrice === 'Any' ? 2000 : maxPrice)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="50"
                    value={maxPrice === 'Any' ? 2000 : maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="accent-primary h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                  />
                </div> */}
              </div>
            </div>
          </div>

          {/* 3. Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <LoadingSpinner />
            ) : filteredProducts.length === 0 ? (
              <NoResults reset={resetFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {currentItems.map((p, idx) => (
                    <ExclusiveProductCard key={p.id} product={p} delay={idx * 0.05} />
                  ))}
                </div>

                {/* Pagination - Theme Primary */}
                <div className="mt-20 flex justify-center">
                  <ReactPaginate
                    pageCount={Math.ceil(filteredProducts.length / itemsPerPage)}
                    onPageChange={handlePageClick}
                    containerClassName="flex gap-2 p-2 bg-white/50 backdrop-blur-md rounded-full border border-white/40 shadow-sm"
                    activeLinkClassName="!bg-primary !text-white !border-primary shadow-md shadow-primary/20 cursor-pointer"
                    pageLinkClassName="w-10 h-10 flex items-center justify-center rounded-full text-xs font-bold text-gray-500 hover:bg-white hover:text-primary transition-all cursor-pointer"
                    previousLinkClassName="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-primary transition-colors cursor-pointer"
                    nextLinkClassName="w-10 h-10 flex items-center justify-center rounded-full text-gray-400 hover:text-primary transition-colors cursor-pointer"
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
    </AnimatedPage>
  );
};

const HorizontalFilter = ({ label, value, onChange, options, prefix = '' }) => (
  <div className="space-y-2">
    <label className="ml-1 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
      {label}
    </label>
    <div className="group relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="focus:ring-primary/20 focus:border-primary h-12 w-full cursor-pointer appearance-none rounded-2xl border border-gray-100 bg-white/80 px-4 text-sm font-bold text-gray-800 transition-all outline-none focus:bg-white focus:ring-2"
      >
        <option value="Any">Any {label}</option>
        {options.map((opt, i) => (
          <option key={i} value={opt.slug || opt.name || opt}>
            {prefix}
            {opt.name || opt}
          </option>
        ))}
      </select>
      <FiChevronDown className="group-hover:text-primary pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 transition-colors" />
    </div>
  </div>
);

const NoResults = ({ reset }) => (
  <div className="flex flex-col items-center justify-center py-32 text-center">
    <div className="mb-6 rounded-full bg-gray-100 p-8 shadow-inner">
      <FiSearch size={48} className="text-gray-300" />
    </div>
    <h3 className="text-2xl font-black tracking-tight text-gray-900 uppercase">No matches found</h3>
    <p className="mt-2 text-sm text-gray-500">
      Try adjusting your filters to find what you're looking for.
    </p>
    <button
      onClick={reset}
      className="bg-primary hover:bg-primary/90 shadow-primary/20 mt-8 rounded-full px-8 py-3 text-xs font-bold tracking-widest text-white uppercase shadow-lg transition-all active:scale-95"
    >
      Clear all filters
    </button>
  </div>
);

export default ExclusiveProducts;
