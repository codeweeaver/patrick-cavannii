import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ExclusiveProductCard = ({ product, delay = 0 }) => {
  const [isHovered, setIsHovered] = useState(false);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  const productPath = `/exclusive/${product.slug || product.id}`;
  // Use first two images as requested
  const displayImages = product.images?.slice(0, 2) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="group flex flex-col"
    >
      {/* 1. Image Container with Slider */}
      <div
        className="relative aspect-3/4 w-full overflow-hidden bg-[#F3F3F3]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* "Online Exclusive" Badge */}
        {product.isExclusive !== false && (
          <div className="absolute top-0 left-0 z-30 bg-white/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-black uppercase shadow-sm">
            Online Exclusive
          </div>
        )}

        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          speed={1000}
          loop={true}
          allowTouchMove={true}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          autoplay={isHovered ? { delay: 2000, disableOnInteraction: false } : false}
          className="exclusive-swiper h-full w-full"
        >
          {displayImages.map((img, index) => (
            <SwiperSlide key={index}>
              <Link to={productPath} className="block h-full w-full">
                <img
                  src={img}
                  alt={product.name}
                  className={`h-full w-full object-cover object-center transition-all duration-700 ease-in-out ${isHovered ? 'scale-105 grayscale-0' : 'brightness-105 grayscale'}`}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation Icons - Only visible on hover */}
        <div
          className={`absolute inset-x-0 top-1/2 z-40 flex -translate-y-1/2 justify-between px-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
        >
          <button
            ref={prevRef}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black shadow-md transition-colors hover:bg-white"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            ref={nextRef}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-black shadow-md transition-colors hover:bg-white"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 2. Minimalist Details */}
      <div className="mt-4 flex flex-col space-y-3 px-1">
        <Link to={productPath}>
          <h3 className="text-sm font-bold tracking-tight text-black uppercase transition-colors hover:text-gray-600 md:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Color Indicators */}
        {product.colors && (
          <div className="flex items-center gap-2">
            {product.colors.map((color, idx) => (
              <div
                key={idx}
                className="group/color relative h-5 w-5 cursor-pointer rounded-full border border-gray-200 transition-transform hover:scale-110"
                style={{ backgroundColor: color.hex || color }}
              >
                {/* Tooltip for color name */}
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 scale-0 rounded bg-black px-1.5 py-0.5 text-[8px] text-white uppercase transition-transform group-hover/color:scale-100">
                  {color.name || color}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adding Global styles for Swiper pagination bullets to match theme */}
      <style jsx global>{`
        .exclusive-swiper .swiper-pagination-bullet {
          background: #000 !important;
          opacity: 0.3;
        }
        .exclusive-swiper .swiper-pagination-bullet-active {
          opacity: 1;
          background: #000 !important;
        }
      `}</style>
    </motion.div>
  );
};

export default ExclusiveProductCard;
