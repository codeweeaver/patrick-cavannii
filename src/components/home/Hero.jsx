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
    bgColor: 'bg-gray-100',
  },
  {
    id: 2,
    title: 'Haute Couture',
    subtitle: 'Art of Crafting Luxury',
    description:
      'Our pieces are made with the highest quality materials and attention to detail, blending tradition with innovation.',
    buttonText: 'Browser Collections',
    buttonLink: '/collections',
    image: hero2,
    bgColor: 'bg-blue-50',
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
    bgColor: 'bg-amber-50',
  },
];

const Hero = () => {
  const swiperRef = useRef(null);
  return (
    <section className="relative flex min-h-[70vh] items-center bg-gray-900">
      <Swiper
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
            return `<span class="${className} inline-block w-3 h-3 mx-2 rounded-full bg-white/50 hover:bg-white transition-all duration-300"></span>`;
          },
        }}
        modules={[Autoplay, Pagination]}
        className="absolute inset-0 h-full w-full"
        style={{
          '--swiper-pagination-color': '#ffffff',
          '--swiper-pagination-bullet-size': '10px',
          '--swiper-pagination-bullet-horizontal-gap': '6px',
        }}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
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
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div className="absolute inset-0 z-10 bg-black/40"></div>
            </div>

            {/* Content */}
            <div className="relative z-20 flex h-[80vh] items-center justify-center px-4 text-center">
              <motion.div
                className="mx-auto max-w-4xl text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="bg-accent mb-6 inline-block rounded-full px-4 py-1.5 text-sm font-medium text-white">
                  {slide.subtitle}
                </span>
                <h1 className="mb-6 text-4xl leading-tight font-bold md:text-5xl lg:text-6xl">
                  {slide.title}
                </h1>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 md:text-xl">
                  {slide.description}
                </p>
                <motion.a
                  href={slide.buttonLink}
                  className="bg-primary hover:bg-primary/90 inline-block rounded-full px-8 py-4 text-lg font-medium text-white transition-colors duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slide.buttonText}
                </motion.a>
              </motion.div>
            </div>
          </SwiperSlide>
        ))}

        {/* Pagination */}
        <div className="custom-pagination absolute bottom-10 left-1/2 z-100 flex -translate-x-1/2 transform space-x-2" />
      </Swiper>
    </section>
  );
};

export default Hero;
