import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import local hero images
import hero1 from '../../assets/images/hero/hero1.png';
import hero2 from '../../assets/images/hero/hero2.png';
import hero3 from '../../assets/images/hero/hero3.png';

const heroSlides = [
  {
    id: 1,
    title: 'Designer Spotlight',
    subtitle: 'Discover the latest trends in fashion',
    description:
      'A designer dedicated to infusing luxury with creative freedom, bringing unique expressions to fashion',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    image: hero1,
  },
  {
    id: 2,
    title: 'Haute Couture',
    subtitle: 'Art of Crafting Luxury',
    description:
      'Our pieces are made with the highest quality materials and attention to detail, blending tradition with innovation.',
    buttonText: 'Browse Collections',
    buttonLink: '/collections',
    image: hero2,
  },
  {
    id: 3,
    title: 'Exclusive Collections',
    subtitle: 'Curated for the Discerning Eye',
    description:
      'Discover our limited-edition pieces that redefine luxury and style, perfect for any occasion.',
    buttonText: 'Browse Collections',
    buttonLink: '/collections',
    image: hero3,
  },
];

const Hero = () => {
  const swiperRef = useRef(null);

  return (
    <>
      {/* 1. Critical CSS for bullets since Tailwind won't pick up classes in renderBullet strings */}
      <style>{`
        .custom-bullet {
          width: 12px !important;
          height: 12px !important;
          background: rgba(255, 255, 255, 0.5) !important;
          border-radius: 50% !important;
          display: inline-block !important;
          margin: 0 8px !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          opacity: 1 !important;
        }
        .swiper-pagination-bullet-active.custom-bullet {
          background: white !important;
          width: 30px !important;
          border-radius: 6px !important;
        }
      `}</style>

      <section className="relative flex min-h-[80vh] w-full items-center overflow-hidden bg-gray-900">
        <Swiper
          modules={[Autoplay, Pagination]}
          direction="horizontal"
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
            renderBullet: (index, className) => {
              // className here will include 'swiper-pagination-bullet'
              return `<span class="${className} custom-bullet"></span>`;
            },
          }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          className="h-full w-full"
        >
          {heroSlides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative">
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: '50% 20%',
                }}
              >
                <div className="absolute inset-0 z-10 bg-black/50"></div>
              </div>

              {/* Content */}
              <div className="relative z-20 flex h-[80vh] items-center justify-center px-4 text-center">
                <motion.div
                  className="mx-auto max-w-4xl text-white"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="bg-primary/80 mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-medium tracking-wide text-white backdrop-blur-sm">
                    {slide.subtitle}
                  </span>
                  <h1 className="mb-6 text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
                    {slide.description}
                  </p>
                  <motion.a
                    href={slide.buttonLink}
                    className="bg-primary hover:bg-primary/90 inline-block rounded-full px-10 py-4 text-lg font-medium text-white transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {slide.buttonText}
                  </motion.a>
                </motion.div>
              </div>
            </SwiperSlide>
          ))}

          {/* Pagination Container:
            Must be inside the Swiper component to interact correctly with custom el
          */}
          <div className="custom-pagination pointer-events-auto absolute right-0 bottom-10 left-0 z-50 flex items-center justify-center" />
        </Swiper>
      </section>
    </>
  );
};

export default Hero;
