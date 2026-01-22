import { useEffect, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { apiClient } from '../../utils/apiClient.js'; // Use your Axios instance
import ProductCard from '../global/ProductCard';

const JustForYou = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Use apiClient to automatically handle the Base URL from Netlify Env Vars
        const data = await apiClient.get('/products');

        // Logic: Filter high-rated -> Shuffle -> Slice
        const recommended = data
          .filter((item) => Number(item.rating) >= 4.0)
          .sort(() => Math.random() - 0.5)
          .slice(0, 10); // Take 10 for a better slider feel

        setProducts(recommended);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <JustForYouSkeleton />;
  if (products.length === 0) return null;

  return (
    <section className="overflow-hidden bg-gray-50 py-16">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Just For You</h2>
            <div className="bg-primary mt-2 h-1 w-12"></div>
          </div>
          <Link
            to="/products"
            className="text-primary font-semibold decoration-2 underline-offset-4 hover:underline"
          >
            View All Collections
          </Link>
        </div>

        <div className="group relative">
          <Swiper
            modules={[Autoplay, Pagination, Navigation]}
            spaceBetween={24}
            slidesPerView={1.2}
            loop={products.length > 4} // Only loop if we have enough items
            centeredSlides={false}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              el: '.custom-prod-pagination',
              bulletClass: 'swiper-pagination-bullet !bg-gray-400 !opacity-50',
              bulletActiveClass: '!bg-primary !opacity-100 !w-6 !rounded-full',
            }}
            navigation={{
              nextEl: '.jfy-next',
              prevEl: '.jfy-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              1024: { slidesPerView: 4 }, // Clean 4-column layout on desktop
            }}
            className="!pb-14"
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <ProductCard product={product} />
              </SwiperSlide>
            ))}

            {/* Pagination Container */}
            <div className="custom-prod-pagination absolute bottom-0 left-1/2 z-10 flex -translate-x-1/2 gap-2" />

            {/* Custom Navigation - Positioned at edges */}
            <button className="jfy-prev hover:bg-primary absolute top-[40%] -left-5 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800 opacity-0 shadow-xl transition-all group-hover:left-2 group-hover:opacity-100 hover:text-white disabled:opacity-0 lg:flex">
              <FiArrowLeft size={24} />
            </button>
            <button className="jfy-next hover:bg-primary absolute top-[40%] -right-5 z-20 hidden h-12 w-12 items-center justify-center rounded-full bg-white text-gray-800 opacity-0 shadow-xl transition-all group-hover:right-2 group-hover:opacity-100 hover:text-white disabled:opacity-0 lg:flex">
              <FiArrowRight size={24} />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

// Simple Skeleton for better UX
const JustForYouSkeleton = () => (
  <div className="mx-auto max-w-6xl px-4 py-16">
    <div className="mb-8 h-8 w-48 animate-pulse rounded bg-gray-200" />
    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-80 animate-pulse rounded-xl bg-gray-200" />
      ))}
    </div>
  </div>
);

export default JustForYou;
