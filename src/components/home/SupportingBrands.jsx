import { motion } from 'framer-motion';
import burberry from '../../assets/images/brands/burberry.avif';
import cartier from '../../assets/images/brands/cartier.avif';
import fendi from '../../assets/images/brands/fendi.avif';
import gucci from '../../assets/images/brands/gucci.avif';
import nike from '../../assets/images/brands/nike.avif';
import rolex from '../../assets/images/brands/rolex.avif';
import versace from '../../assets/images/brands/versace.avif';

const brands = [
  { id: 1, name: 'Burberry', logo: burberry },
  { id: 2, name: 'Cartier', logo: cartier },
  { id: 3, name: 'Gucci', logo: gucci },
  { id: 4, name: 'Nike', logo: nike },
  { id: 5, name: 'Versace', logo: versace },
  { id: 6, name: 'Rolex', logo: rolex },
  { id: 7, name: 'Fendi', logo: fendi },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    y: -5,
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

const SupportingBrands = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Supporting Brands</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Proudly partnered with the world's most prestigious brands
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-2 items-center gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7"
        >
          {brands.map((brand) => (
            <motion.div
              key={brand.id}
              variants={item}
              whileHover="hover"
              className="flex items-center justify-center rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <img
                src={brand.logo}
                alt={brand.name}
                className="h-12 w-auto object-contain grayscale transition-all duration-300 hover:grayscale-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default SupportingBrands;
