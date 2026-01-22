import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import Logo from '../../assets/images/logo.png';

const MoblieNavbar = ({ pageNavLinks, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const menuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto' },
  };

  const sidebarVariants = {
    hidden: { x: '-100%' },
    visible: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    exit: { x: '-100%', transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative z-10 h-full w-[85%] max-w-sm bg-white shadow-2xl"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-100">
            <div className="flex items-center space-x-2 p-4">
              <NavLink to="/" className="text-xl font-bold">
                <img src={Logo} alt="Patrick Cavanni Logo" className="h-auto w-30" />
              </NavLink>
            </div>
            <button
              onClick={onClose}
              className="bg-accent border-primary absolute top-18 -right-3.5 z-40 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 p-2 text-sm text-white transition-colors hover:scale-110"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 pb-20">
            {pageNavLinks.map((link) => {
              const isDropdown = !!link.dropdown;
              return (
                <div key={link.name} className="border-b border-gray-50 last:border-none">
                  {/* Link Header */}
                  <div className="flex items-center justify-between py-4">
                    {isDropdown ? (
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="cursor-pointer text-lg font-medium text-gray-800"
                      >
                        {link.name}
                      </button>
                    ) : (
                      <NavLink
                        to={link.path}
                        onClick={onClose}
                        end={link.path === '/'}
                        className={({ isActive }) =>
                          `text-lg font-medium ${isActive ? 'text-primary' : 'text-gray-800'}`
                        }
                      >
                        {link.name}
                      </NavLink>
                    )}
                    {link.dropdown && (
                      <button
                        onClick={() => toggleDropdown(link.name)}
                        className="hover:text-primary p-2 text-gray-500 transition-colors"
                      >
                        {openDropdown === link.name ? <FiMinus size={16} /> : <FiPlus size={16} />}
                      </button>
                    )}
                  </div>

                  {/* Dropdown Content */}
                  <AnimatePresence>
                    {link.dropdown && openDropdown === link.name && (
                      <motion.div
                        variants={menuVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="mb-4 overflow-hidden rounded-xl bg-gray-50/50"
                      >
                        <div className="space-y-6 p-4">
                          {/* Helper to render category sections */}
                          {[
                            {
                              title: 'Men',
                              items: link.dropdown.men,
                              param: 'category',
                              extraParam: 'gender=men&',
                            },
                            {
                              title: 'Women',
                              items: link.dropdown.women,
                              param: 'category',
                              extraParam: 'gender=women&',
                            },
                            {
                              title: 'Brands',
                              items: link.dropdown.brands,
                              param: 'brand',
                            },
                          ].map(
                            (section) =>
                              section.items &&
                              section.items.length > 0 && (
                                <div key={section.title}>
                                  <h4 className="mb-3 text-xs font-bold tracking-wider text-gray-900 uppercase">
                                    {section.title}
                                  </h4>
                                  <div className="flex flex-col space-y-2 border-l-2 border-gray-200 pl-3">
                                    {section.items.map((item) => (
                                      <NavLink
                                        key={item.name}
                                        to={`${link.path}?${
                                          section.extraParam || ''
                                        }${section.param}=${item.params}`}
                                        onClick={onClose}
                                        className="hover:text-primary py-1 text-sm text-gray-600 transition-colors"
                                      >
                                        {item.name}
                                      </NavLink>
                                    ))}
                                  </div>
                                </div>
                              ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MoblieNavbar;
