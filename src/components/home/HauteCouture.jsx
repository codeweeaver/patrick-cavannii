import { motion } from 'framer-motion';
import { FaCheck } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

import hauteCoutureImage from '../../assets/images/haute-couture.jpg';

const HauteCouture = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gray-50 to-gray-100 py-12 md:py-16">
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 md:gap-12 lg:grid-cols-2">
          {/* Left side - Image */}
          <motion.div
            className="relative h-[350px] w-full overflow-hidden rounded-xl shadow-lg md:h-[500px] md:rounded-2xl md:shadow-2xl"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src={hauteCoutureImage}
              alt="Haute Couture Collection"
              className="h-full w-full object-cover object-[0_10%]"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-4 text-white md:p-8">
              <span className="text-xs font-medium tracking-widest text-amber-200 md:text-sm">
                NEW COLLECTION
              </span>
              <h3 className="mt-0.5 text-xl font-bold md:mt-1 md:text-2xl">Spring/Summer 2025</h3>
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary/80 font-accent text-base font-medium md:text-lg">
              HAUTE COUTURE
            </span>
            <h2 className="mt-1 mb-4 text-3xl font-bold text-gray-900 md:mt-2 md:mb-6 md:text-4xl">
              Elegance Redefined
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-gray-600 md:text-base">
              Experience the epitome of luxury with our exclusive haute couture collection. Each
              piece is meticulously crafted with the finest materials and attention to detail,
              designed to make a statement wherever you go.
            </p>

            <div className="mb-8 space-y-4">
              <div className="flex items-start">
                <div className="mt-0.5 shrink-0 md:mt-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400 md:h-6 md:w-6">
                    <FaCheck className="text-xs text-white md:text-sm" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 md:text-base">
                  Handcrafted by master artisans with decades of experience
                </p>
              </div>
              <div className="flex items-start">
                <div className="mt-0.5 shrink-0 md:mt-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-400 md:h-6 md:w-6">
                    <FaCheck className="text-xs text-white md:text-sm" />
                  </div>
                </div>
                <p className="ml-3 text-sm text-gray-600 md:text-base">
                  Made with sustainable and ethically sourced materials
                </p>
              </div>
            </div>

            <Link
              to="/collection"
              className="hover:bg-primary inline-flex w-full items-center justify-center rounded-md border border-transparent bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-300 sm:w-auto md:px-8 md:py-3 md:text-base"
            >
              Explore Collection
              <svg
                className="-mr-1 ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HauteCouture;
