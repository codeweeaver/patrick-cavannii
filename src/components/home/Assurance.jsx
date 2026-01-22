import { motion, useAnimation } from 'framer-motion';
import { FaArrowsRotate, FaHeadset, FaRegPaperPlane } from 'react-icons/fa6';

const assuranceItems = [
  {
    id: 1,
    icon: <FaRegPaperPlane className="h-5 w-5" />,
    title: 'Fast Shipping',
    description: 'Free shipping on all orders over $50',
  },
  {
    id: 2,
    icon: <FaArrowsRotate className="h-5 w-5" />,
    title: 'Money Back Guarantee',
    description: '30 days return policy for all orders',
  },
  {
    id: 3,
    icon: <FaHeadset className="h-5 w-5" />,
    title: 'Online Support 24/7',
    description: '24/7 customer support via email, phone, and live chat',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 10, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
    },
  },
};

const Assurance = () => {
  const controls = useAnimation();

  return (
    <section className="bg-primary/5 py-12 md:py-16">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {assuranceItems.map((itemData) => {
            return (
              <motion.div
                key={itemData.id}
                variants={item}
                className="group relative overflow-hidden rounded-lg border border-dotted border-green-400/80 bg-white p-6 text-center transition-all"
                onHoverStart={() => {
                  if (itemData.id === 1) {
                    controls.start({
                      x: 60,
                      y: -60,
                      opacity: 0,
                      transition: { duration: 0.4 },
                    });
                  } else if (itemData.id === 2) {
                    controls.start({
                      rotate: 180,
                      transition: {
                        duration: 0.6,
                        type: 'spring',
                        bounce: 0.4,
                      },
                    });
                  } else if (itemData.id === 3) {
                    controls.start({
                      x: [0, -10, 10, -10, 10, -5, 5, 0],
                      y: [0, 0, 0, 0, 0, 0, 0, 0],
                      transition: {
                        duration: 0.8,
                        times: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1],
                        ease: 'easeInOut',
                      },
                    });
                  } else {
                    controls.start({ scale: 1.1 });
                  }
                }}
                onHoverEnd={() => {
                  controls.start({
                    x: 0,
                    y: 0,
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                    transition: { duration: 0.3 },
                  });
                }}
              >
                <div className="relative">
                  <motion.div
                    className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-50"
                    animate={controls}
                  >
                    <span className="text-primary">{itemData.icon}</span>
                  </motion.div>
                </div>
                <h3 className="mb-1.5 text-lg font-medium text-gray-900">{itemData.title}</h3>
                <p className="text-sm leading-relaxed text-gray-500">{itemData.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Assurance;
