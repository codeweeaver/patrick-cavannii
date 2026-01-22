import { motion } from 'framer-motion';
import { FiAward, FiChevronRight, FiGlobe, FiHeart, FiUsers } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import AnimatedPage from '../components/global/AnimatedPage';

const About = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const stats = [
    {
      icon: <FiAward className="h-6 w-6" />,
      value: '10+',
      label: 'Years in Fashion',
    },
    {
      icon: <FiUsers className="h-6 w-6" />,
      value: '50K+',
      label: 'Happy Customers',
    },
    {
      icon: <FiGlobe className="h-6 w-6" />,
      value: '30+',
      label: 'Countries Served',
    },
    {
      icon: <FiHeart className="h-6 w-6" />,
      value: '100%',
      label: 'Quality Guaranteed',
    },
  ];

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-linear-to-r from-gray-900 to-gray-800 py-20 text-white md:py-32"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 z-0 bg-black/50" />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.h1
            className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            Our Fashion Story
          </motion.h1>
          <motion.p
            className="mx-auto max-w-3xl text-lg text-gray-200 md:text-xl"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            Redefining style with passion, innovation, and timeless elegance since 2013
          </motion.p>
        </div>
      </motion.section>

      {/* Our Story */}

      <section className="py-20">
        <div className="container m-auto mb-16 text-center">
          <motion.h2
            className="mb-6 text-3xl font-bold md:text-4xl"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Welcome to Patrick Cavanni
          </motion.h2>
          <motion.p
            className="mb-8 text-gray-600"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            At Patrick Cavanni, we believe fashion is more than just clothing—it's a form of
            self-expression. Founded in 2013, our journey began with a simple vision: to create
            high-quality, sustainable fashion that celebrates individuality and empowers people to
            express their unique style.
          </motion.p>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-lg bg-gray-50 p-6 text-center"
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="text-primary mb-3 flex justify-center">{stat.icon}</div>
              <h3 className="mb-1 text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Mission */}
      <motion.section
        className="bg-white py-16"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="order-2 md:order-1">
              <h2 className="mb-6 text-3xl font-bold">Our Mission</h2>
              <p className="text-gray-600">
                To inspire confidence and individuality through thoughtfully designed, sustainable
                fashion that makes a positive impact on both people and the planet. We believe in
                creating pieces that not only look good but also do good.
              </p>
            </div>
            <div className="order-1 md:order-2">
              <div className="h-64 overflow-hidden rounded-lg bg-gray-100 md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Our Mission"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Our Vision */}
      <motion.section
        className="bg-accent/5 py-20"
        variants={fadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        <div className="container">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <div className="h-64 overflow-hidden rounded-lg bg-gray-100 md:h-80">
                <img
                  src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                  alt="Our Vision"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="mb-6 text-3xl font-bold">Our Vision</h2>
              <p className="text-gray-600">
                To be a global leader in sustainable fashion, setting new standards for ethical
                production, innovative design, and exceptional customer experience. We envision a
                future where fashion and sustainability go hand in hand, creating a positive impact
                on both style and the environment.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}

      <section className="py-20">
        <div className="container mx-auto text-center">
          <motion.h2
            className="mb-12 text-3xl font-bold md:text-4xl"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Meet Our Team
          </motion.h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                name: 'Patrick Cavanni',
                role: 'Founder & Creative Director',
                image: 'https://randomuser.me/api/portraits/men/32.jpg',
              },
              {
                name: 'Sarah Johnson',
                role: 'Head of Design',
                image: 'https://randomuser.me/api/portraits/women/44.jpg',
              },
              {
                name: 'Michael Chen',
                role: 'Retail Director',
                image: 'https://randomuser.me/api/portraits/men/22.jpg',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="text-center"
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
              >
                <div className="mx-auto mb-4 h-48 w-48 overflow-hidden rounded-full border-4 border-white shadow-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-12">
        <motion.div
          className="rounded-2xl p-8 text-center md:p-12"
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">Join Our Fashion Journey</h2>
          <p className="mx-auto mb-6 max-w-2xl text-gray-600">
            Experience the perfect blend of style, comfort, and sustainability. Shop our latest
            collection today and discover your signature look.
          </p>
          <Link
            to="/products"
            className="bg-primary hover:bg-primary/90 inline-flex items-center rounded-full px-8 py-3 font-medium text-white transition-all hover:scale-105"
          >
            Shop Now <FiChevronRight className="ml-2" />
          </Link>
        </motion.div>
      </section>
    </AnimatedPage>
  );
};

export default About;
