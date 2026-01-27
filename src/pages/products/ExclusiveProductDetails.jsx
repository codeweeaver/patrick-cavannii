import { useEffect, useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiHeart, FiMail, FiMessageCircle } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { FreeMode, Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import LoadingSpinner from '../../components/global/LoadingSpinner';
import { useAuth } from '../../hooks/useAuth.jsx';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

const ExclusiveProductDetails = () => {
  const { addToHistory } = useAuth();
  const { id: productId } = useParams();

  const [product, setProduct] = useState(null);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openAccordion, setOpenAccordion] = useState('details');

  // Refs for Custom Navigation
  const prevRef = useRef(null);
  const nextRef = useRef(null);

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
    if (product?.id) addToHistory('products', product.id);
  }, [product, addToHistory]);

  if (loading || !product) return <LoadingSpinner />;

  const toggleAccordion = (id) => setOpenAccordion(openAccordion === id ? null : id);

  return (
    <section className="relative min-h-screen bg-white pb-20">
      <div className="container mx-auto px-4 pt-8 lg:pt-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* --- LEFT COLUMN: GALLERY --- */}
          <div className="lg:col-span-8">
            <div className="flex flex-col-reverse gap-6 md:flex-row">
              {/* Thumbnails */}
              <div className="w-full md:w-20">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction="horizontal"
                  breakpoints={{ 768: { direction: 'vertical' } }}
                  spaceBetween={12}
                  slidesPerView={5}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="exclusive-thumbs h-24 md:h-[600px]"
                >
                  {product.images?.map((img, index) => (
                    <SwiperSlide key={index} className="cursor-pointer">
                      <div
                        className={`aspect-3/4 overflow-hidden rounded-sm border transition-all duration-300 ${
                          thumbsSwiper?.activeIndex === index
                            ? 'border-black ring-1 ring-black'
                            : 'border-gray-100'
                        }`}
                      >
                        <img src={img} alt="" className="h-full w-full object-cover" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Display Image */}
              <div className="group relative flex-1 overflow-hidden bg-[#F6F6F6]">
                <Swiper
                  loop={true}
                  pagination={{
                    clickable: true,
                    dynamicBullets: true,
                    bulletClass: 'custom-bullet',
                    bulletActiveClass: 'custom-bullet-active',
                  }}
                  navigation={{
                    prevEl: prevRef.current,
                    nextEl: nextRef.current,
                  }}
                  onBeforeInit={(swiper) => {
                    swiper.params.navigation.prevEl = prevRef.current;
                    swiper.params.navigation.nextEl = nextRef.current;
                  }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Thumbs, Pagination]}
                  className="main-product-slider aspect-3/4 w-full"
                >
                  {product.images?.map((img, index) => (
                    <SwiperSlide key={index}>
                      <img src={img} alt={product.name} className="h-full w-full object-contain" />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <button
                  ref={prevRef}
                  className="absolute top-1/2 left-4 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white active:scale-90"
                >
                  <FiChevronLeft size={24} />
                </button>
                <button
                  ref={nextRef}
                  className="absolute top-1/2 right-4 z-20 -translate-y-1/2 rounded-full bg-white/80 p-3 text-black opacity-0 shadow-md backdrop-blur-sm transition-all group-hover:opacity-100 hover:bg-white active:scale-90"
                >
                  <FiChevronRight size={24} />
                </button>

                {/* Favorite Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                  className="absolute top-6 right-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur-md transition-all hover:scale-110 active:scale-95"
                >
                  <FiHeart
                    className={`h-6 w-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-900'}`}
                  />
                </button>

                {/* Custom Pagination CSS (Injecting into JS for convenience) */}
                <style>{`
                  .custom-bullet {
                    display: inline-block;
                    width: 30px;
                    height: 2px;
                    background: #ccc;
                    margin: 0 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                  }
                  .custom-bullet-active {
                    background: #000 !important;
                    width: 50px;
                  }
                  .swiper-pagination {
                    bottom: 20px !important;
                  }
                `}</style>
              </div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: DETAILS --- */}
          <div className="relative z-20 lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              <div className="space-y-4">
                <div className="inline-block bg-gray-100 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-gray-600 uppercase">
                  Online Exclusive
                </div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase lg:text-4xl">
                  {product.name}
                </h1>
              </div>

              <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
                <AccordionItem
                  title="Color"
                  isOpen={openAccordion === 'color'}
                  onToggle={() => toggleAccordion('color')}
                >
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {product.colors?.[0] || 'Original Print'}
                    </span>
                    <div className="flex gap-2">
                      {product.colors?.map((c, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full border border-gray-200 shadow-sm"
                          style={{
                            backgroundColor: c === 'print' ? 'transparent' : c,
                            backgroundImage: c === 'print' ? `url(${product.images[0]})` : 'none',
                            backgroundSize: 'cover',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="Product Details"
                  isOpen={openAccordion === 'details'}
                  onToggle={() => toggleAccordion('details')}
                >
                  <div className="space-y-4 py-4 text-sm leading-relaxed text-gray-600">
                    <p>
                      {product.description || 'Exclusive craftsmanship and archival aesthetics.'}
                    </p>
                    <ul className="list-inside list-disc space-y-1 text-xs font-bold tracking-widest text-gray-900 uppercase">
                      <li>Professional Dry Clean Only</li>
                      <li>Made in Italy</li>
                      <li>Archival Hardware</li>
                    </ul>
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="Contact Us"
                  isOpen={openAccordion === 'contact'}
                  onToggle={() => toggleAccordion('contact')}
                >
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <a
                      href="mailto:concierge@exclusive.com"
                      className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50"
                    >
                      <FiMail className="text-black" />
                      <span className="text-xs font-bold tracking-tighter uppercase">Email Us</span>
                    </a>
                    <button className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 transition-colors hover:bg-gray-50">
                      <FiMessageCircle className="text-black" />
                      <span className="text-xs font-bold tracking-tighter uppercase">WhatsApp</span>
                    </button>
                  </div>
                </AccordionItem>
              </div>

              <p className="text-center text-[10px] font-bold tracking-[0.1em] text-gray-400 uppercase">
                Complimentary Express Shipping
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AccordionItem = ({ title, children, isOpen, onToggle }) => (
  <div className="w-full">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between py-6 text-left outline-none"
    >
      <span className="text-sm font-black tracking-widest text-gray-900 uppercase">{title}</span>
      {isOpen ? <FiMinus className="text-gray-400" /> : <FiPlus className="text-gray-400" />}
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
    >
      {children}
    </div>
  </div>
);

const FiPlus = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const FiMinus = ({ className }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

export default ExclusiveProductDetails;
