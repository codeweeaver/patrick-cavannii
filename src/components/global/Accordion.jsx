import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';

const Accordion = ({
  title,
  children,
  defaultOpen = false,
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`border-b border-gray-100 last:border-b-0 ${className}`}>
      <motion.button
        onClick={toggleAccordion}
        type="button"
        className={`flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-gray-50 ${headerClassName}`}
        aria-expanded={isOpen}
      >
        <div className="flex flex-1 items-center gap-3">
          {typeof title === 'string' ? (
            <span className="font-semibold text-gray-900">{title}</span>
          ) : (
            title
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="shrink-0 text-gray-500"
        >
          <FiChevronDown size={20} />
        </motion.div>
      </motion.button>

      <motion.div
        initial={false}
        animate={{
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut',
        }}
        className="overflow-hidden"
      >
        <div className={`bg-gray-50 px-6 py-4 ${contentClassName}`}>{children}</div>
      </motion.div>
    </div>
  );
};

export default Accordion;
