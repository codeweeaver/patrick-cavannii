import { useEffect, useState } from 'react';
import { FiHeart, FiShoppingCart } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import { useCurrency } from '../../context/CurrencyContext';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useCart } from '../../hooks/useCart.jsx';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { addToHistory } = useAuth();
  const { formatPrice } = useCurrency();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        // Try fetching by ID first
        let response = await fetch(`${baseUrl}/products/${productId}`);

        if (!response.ok) {
          // If not found by ID, try fetching by slug
          const slugResponse = await fetch(`${baseUrl}/products?slug=${productId}`);
          if (slugResponse.ok) {
            const data = await slugResponse.json();
            if (Array.isArray(data) && data.length > 0) {
              setProduct(data[0]);
              return;
            }
          }
          throw new Error('Product not found');
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    if (productId) fetchProduct();
  }, [productId]);

  // Set default selected size and color when component mounts
  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
    if (product?.colors?.length > 0) {
      setSelectedColor(product.colors[0]);
    }
    if (product?.id) {
      addToHistory('products', product.id);
    }
  }, [product, addToHistory]);

  if (loading || !product) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Main Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <Swiper
              loop={false}
              spaceBetween={10}
              navigation={true}
              thumbs={{ swiper: thumbsSwiper }}
              modules={[Navigation, Thumbs]}
              className="h-full w-full"
              style={{
                '--swiper-navigation-color': '#000',
                '--swiper-pagination-color': '#000',
              }}
            >
              {product.images?.map((img, index) => (
                <SwiperSlide key={index} className="flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-contain"
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 z-10 rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart
                className={`h-5 w-5 ${isFavorite ? 'fill-current text-red-500' : 'text-gray-600'}`}
              />
            </button>
          </div>

          {/* Thumbnails */}
          <div className="mt-4 px-2">
            <Swiper
              onSwiper={setThumbsSwiper}
              spaceBetween={10}
              slidesPerView={4}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="product-thumbs"
            >
              {product.images?.map((img, index) => (
                <SwiperSlide key={index} className="cursor-pointer">
                  <div className="aspect-square overflow-hidden rounded-md border-2 border-transparent bg-gray-100 transition-colors hover:border-gray-300">
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="mb-2 text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="mb-4 flex items-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">({product.reviews || 0} reviews)</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="ml-2 text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="ml-2 font-medium text-green-600">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>
            {!product.inStock && <span className="mt-1 text-sm text-red-500">Out of Stock</span>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-medium">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Categories */}
          {product.categories?.length > 0 && (
            <div className="mt-6 mb-6 border-t border-gray-200 pt-6">
              <h3 className="mb-2 text-sm font-medium text-gray-500">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {product.categories.map((category, index) => (
                  <span key={index} className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md border px-4 py-2 ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-medium">Color</h3>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 w-10 rounded-full border-2 ${
                      selectedColor === color
                        ? 'ring-2 ring-gray-900 ring-offset-2'
                        : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-medium">Quantity</h3>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="rounded-l-md border px-3 py-1 hover:bg-gray-50"
              >
                -
              </button>
              <span className="border-t border-b px-4 py-1">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="rounded-r-md border px-3 py-1 hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => addToCart(product)}
              disabled={!product.inStock}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-8 py-3 ${
                product.inStock
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'cursor-not-allowed bg-gray-200 text-gray-500'
              }`}
            >
              <FiShoppingCart className="h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              className="flex-1 rounded-md border border-black px-8 py-3 transition-colors hover:bg-gray-50"
              disabled={!product.inStock}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
