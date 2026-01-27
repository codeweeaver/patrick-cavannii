import { useEffect, useMemo, useState } from 'react';
import { FiHeart, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
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
import 'swiper/css/thumbs';

const ProductDetail = () => {
  const { addToCart } = useCart();
  const { addToHistory } = useAuth();
  const { formatPrice } = useCurrency();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        let response = await fetch(`${baseUrl}/products/${productId}`);
        if (!response.ok) {
          const slugResponse = await fetch(`${baseUrl}/products?slug=${productId}`);
          const data = await slugResponse.json();
          if (data.length > 0) {
            setProduct(data[0]);
            return;
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

  useEffect(() => {
    if (product) {
      const firstVariant = product.inventory?.variants?.[0];
      if (firstVariant) {
        setSelectedColor(firstVariant.color);
        setSelectedSize(firstVariant.size);
      }
      if (product.id) addToHistory('products', product.id);
    }
  }, [product, addToHistory]);

  const currentVariant = useMemo(() => {
    return product?.inventory?.variants?.find(
      (v) => v.color === selectedColor && v.size === selectedSize,
    );
  }, [product, selectedColor, selectedSize]);

  const isOutOfStock = useMemo(() => {
    if (!product) return true;
    if (product.inventory?.status === 'outOfStock') return true;
    if (product.inventory?.variants?.length > 0) {
      return !currentVariant || currentVariant.quantity <= 0;
    }
    return false;
  }, [product, currentVariant]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart({
      ...product,
      size: selectedSize,
      color: selectedColor,
      sku: currentVariant?.sku,
      quantity,
    });
  };

  if (loading || !product) return <LoadingSpinner />;

  return (
    <section className="min-h-screen bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- LEFT COLUMN: GALLERY --- */}
          <div className="lg:col-span-7">
            <div className="flex flex-col-reverse gap-4 md:flex-row">
              {/* Thumbnails */}
              <div className="w-full md:w-24">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction="horizontal"
                  breakpoints={{ 768: { direction: 'vertical' } }}
                  spaceBetween={10}
                  slidesPerView={4}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="h-24 md:h-[500px]"
                >
                  {product.images?.map((img, index) => (
                    <SwiperSlide key={index} className="h-auto! cursor-pointer">
                      <div className="aspect-square overflow-hidden rounded-lg border-2 border-transparent transition-all in-[.swiper-slide-thumb-active]:border-black">
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Image Container */}
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-gray-50 ring-1 ring-gray-100">
                <Swiper
                  loop={true}
                  navigation={true}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Thumbs]}
                  className="aspect-4/5 w-full"
                >
                  {product.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} alt={product.name} className="h-full w-full object-cover" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Badges & Heart - Using high z-index and pointer-events-auto */}
                <div className="pointer-events-none absolute inset-0 z-20 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-2">
                      {product.discount > 0 && (
                        <span className="pointer-events-auto rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-xl transition-transform hover:scale-110 active:scale-95"
                    >
                      <FiHeart
                        className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="lg:col-span-5">
            <div className="relative z-10">
              {' '}
              {/* Ensure right col is above any accidental overflows */}
              <p className="mb-2 text-xs font-bold tracking-widest text-gray-400 uppercase">
                {product.brand || 'Premium Quality'}
              </p>
              <h1 className="mb-4 text-4xl font-black text-gray-900">{product.name}</h1>
              <div className="mb-6 flex items-center gap-4">
                <span className="text-3xl font-black text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.oldPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through decoration-red-500/30">
                    {formatPrice(product.oldPrice)}
                  </span>
                )}
              </div>
              {/* Color Selection */}
              <div className="mb-8 border-t border-gray-100 pt-8">
                <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
                  Color:{' '}
                  <span className="ml-1 font-medium text-gray-500 capitalize">{selectedColor}</span>
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors?.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-10 w-10 rounded-full p-0.5 transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-black ring-offset-2'
                          : 'ring-1 ring-gray-200'
                      }`}
                    >
                      <span
                        className="block h-full w-full rounded-full border border-black/5"
                        style={{ backgroundColor: color === 'archive-beige' ? '#D2B48C' : color }}
                      />
                    </button>
                  ))}
                </div>
              </div>
              {/* Size Selection */}
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-bold tracking-wider text-gray-900 uppercase">
                  Select Size
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes?.map((size) => {
                    const variant = product.inventory?.variants?.find(
                      (v) => v.size === size && v.color === selectedColor,
                    );
                    const isAvailable = variant && variant.quantity > 0;
                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(size)}
                        className={`flex h-12 items-center justify-center rounded-lg border-2 font-bold transition-all ${
                          selectedSize === size
                            ? 'border-black bg-black text-white'
                            : isAvailable
                              ? 'border-gray-100 bg-white hover:border-gray-300'
                              : 'cursor-not-allowed border-gray-50 bg-gray-50 text-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Action Area */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 items-center rounded-xl border-2 border-gray-100 bg-gray-50 px-2">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2">
                      <FiMinus />
                    </button>
                    <span className="w-10 text-center font-bold">{quantity}</span>
                    <button onClick={() => setQuantity((prev) => prev + 1)} className="p-2">
                      <FiPlus />
                    </button>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex h-14 flex-1 items-center justify-center gap-3 rounded-xl bg-black font-bold text-white transition-all hover:bg-gray-800 disabled:bg-gray-200"
                  >
                    <FiShoppingCart /> {isOutOfStock ? 'OUT OF STOCK' : 'ADD TO BAG'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetail;
