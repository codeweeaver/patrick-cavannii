import { useEffect, useRef, useState } from 'react';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

import { Link } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../global/ProductCard';

const JustForYou = () => {
  const swiperRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('import.meta.env.VITE_API_URL/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();

        // Recommendation Logic:
        // 1. Filter for high-rated items (e.g., rating >= 4.0)
        // 2. Shuffle the array to show different items each time
        // 3. Take the top 8 items
        const recommended = data
          .filter((item) => item.rating >= 4.0)
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);

        setProducts(recommended);
      } catch (error) {
        console.error('Error fetching Just For You products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="h-64 w-full animate-pulse rounded-lg bg-gray-200"></div>
        </div>
      </section>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="relative text-2xl font-bold text-gray-900 md:text-3xl">
            Just For You
            <span className="bg-primary/80 absolute bottom-1/2 -left-4 h-1 w-12 translate-y-1/2"></span>
          </h2>
          <Link to="products" className="text-primary hover:text-primary-dark font-medium">
            View All
          </Link>
        </div>

        <div className="relative">
          <Swiper
            spaceBetween={20}
            slidesPerView={1.2}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4.2 },
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              reverseDirection: true,
            }}
            loop={true}
            pagination={{
              clickable: true,
              el: '.custom-pagination',
              renderBullet: (index, className) => {
                return `<span class="${className} inline-block w-3 h-3 mx-1 rounded-full bg-primary hover:bg-primary-dark transition-all duration-300"></span>`;
              },
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="h-full w-full"
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id} className="pb-10">
                <ProductCard product={product} />
              </SwiperSlide>
            ))}

            {/* Navigation and Pagination */}
            <div className="custom-pagination absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 transform space-x-2" />

            <button
              className="swiper-button-prev text-primary absolute top-1/2 left-4 z-30 flex -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-gray-100 md:left-8"
              aria-label="Previous slide"
            >
              <FiArrowLeft className="inline-block h-full w-full p-2" />
            </button>

            <button
              className="swiper-button-next text-primary absolute top-1/2 right-4 z-30 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-all duration-300 hover:bg-gray-100 md:right-8"
              aria-label="Next slide"
            >
              <FiArrowRight className="inline-block h-full w-full p-2" />
            </button>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default JustForYou;
