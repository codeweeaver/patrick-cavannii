import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import Logo from '../assets/images/logo.png';

const Footer = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const socialVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 },
    },
    hover: { scale: 1.1, rotate: 5, transition: { duration: 0.2 } },
  };

  const socialLinks = [
    { name: 'facebook', Icon: <FaFacebook size={20} />, path: '#' },
    { name: 'twitter', Icon: <FaTwitter size={20} />, path: '#' },
    { name: 'youtube', Icon: <FaYoutube size={20} />, path: '#' },
    { name: 'instagram', Icon: <FaInstagram size={20} />, path: '#' },
    { name: 'tiktok', Icon: <FaTiktok size={20} />, path: '#' },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white py-16">
      <div className="mx-auto max-w-6xl px-6">
        {/* Main Footer Content */}
        <motion.div
          className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-3 lg:grid-cols-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center md:m-0 md:items-start md:text-left"
          >
            <NavLink className="" to="/" aria-label="Patrick Cavanni home" title="Home">
              <motion.img
                src={Logo}
                alt="Patrick Cavanni — premium leather goods"
                loading="lazy"
                className="h-auto w-32"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              />
            </NavLink>
            <p className="mt-3 max-w-60 text-center text-sm text-gray-600 md:text-left">
              Handcrafted leather goods sustainable materials, timeless design.
            </p>
          </motion.div>

          {/* Services Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center md:m-0 md:items-start md:text-left"
          >
            <motion.h3 className="font-accent text-primary mb-4 text-xl italic">
              Access Our !
            </motion.h3>
            <h2 className="mb-6 text-2xl font-bold">QUICK LINKS</h2>
            <motion.div
              className="bg-primary mb-6 h-1 w-12 self-center md:self-start"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <ul className="space-y-3">
              {[
                'About Us',
                'Our Blogs',
                'Cavanni Wardrobe',
                'Exclusive Collections',
                'Haute Couture',
              ].map((item, index) => (
                <motion.li
                  key={index}
                  className="hover:text-primary cursor-pointer text-gray-700 transition-colors"
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center md:m-0 md:items-start md:text-left"
          >
            <motion.h3 className="font-accent text-primary mb-4 text-xl italic">
              Talk to Us Now !
            </motion.h3>
            <h2 className="mb-6 text-2xl font-bold">CONTACT US</h2>
            <motion.div
              className="bg-primary mb-6 h-1 w-12 self-center md:self-start"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
            <Link
              to="https://www.google.com/maps/search/?api=1&query=No+8,+Ndele+Street,+Wuse+Zone+3,+FCT+Abuja,+Nigeria"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary mb-4 text-gray-600 underline transition-colors"
            >
              <span className="mr-1 text-xl">📍</span>
              <span>
                No 8, Ndele Street, <br /> Wuse Zone 3,
                <br />
                FCT Abuja, Nigeria
              </span>
            </Link>
            <Link to="tel:+2349087770900" className="text-md group mb-3 inline-block font-semibold">
              <span className="mr-1 text-xl">📞</span>
              <span className="group-hover:text-primary font-medium group-hover:underline">
                +(234) 908 777 0900
              </span>
            </Link>
            <Link
              href="mailto:info@patrickcavanni.com"
              className="text-md group inline-flex items-center gap-2"
            >
              <span className="text-xl">📧</span>
              <span className="group-hover:text-primary font-medium group-hover:underline">
                info@patrickcavanni.com
              </span>
            </Link>
          </motion.div>

          {/* Social Section */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center text-center md:m-0 md:items-start md:text-left"
          >
            <motion.h3 className="font-accent text-primary mb-4 text-xl italic">
              Get in Touch !
            </motion.h3>
            <h2 className="mb-6 text-2xl font-bold">FOLLOW US</h2>
            <motion.div
              className="bg-primary mb-6 h-1 w-12 self-center md:self-start"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            />
            {/* socials links icons */}
            <div className="flex justify-center gap-6 md:flex-wrap md:justify-start">
              {socialLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  variants={socialVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="md:w-1/4 md:flex-wrap"
                >
                  <NavLink
                    to={link.path}
                    className="text-primary flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md hover:shadow-lg"
                  >
                    {link.Icon}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="my-12 border-t border-gray-200"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        />

        {/* Copyright Section */}
        <motion.div
          className="py-8 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.p variants={itemVariants} className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Patrick Cavanni. All rights reserved.
          </motion.p>
          <motion.p variants={itemVariants} className="mt-3 text-xs text-gray-500">
            Designed with <span className="text-red-500">♥</span> by your team
          </motion.p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
