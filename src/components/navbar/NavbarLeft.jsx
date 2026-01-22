import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

const NavbarLeft = ({ setMobileMenuOpen, mobileMenuOpen }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Mobile Menu Toggle */}
      <motion.button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="p-2 text-gray-600 lg:hidden"
      >
        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </motion.button>

      {/* Logo */}
      <motion.div className="flex shrink-0 items-center" whileHover={{ scale: 1.05 }}>
        <Link to="/" className="text-primary text-2xl font-bold">
          <img className="h-20 w-20" src={Logo} alt="Patrick Cavanni" />
        </Link>
      </motion.div>
    </div>
  );
};

export default NavbarLeft;
