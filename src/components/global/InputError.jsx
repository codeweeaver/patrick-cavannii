import { motion } from 'framer-motion';
import { MdError } from 'react-icons/md';

export const InputError = ({ message, className = '' }) => {
  return (
    <motion.p
      className={`flex max-w-sm items-center gap-1 rounded-md bg-red-100 px-2 text-xs whitespace-nowrap text-red-500 ${className}`}
      {...framer_error}
    >
      <MdError />
      {message}
    </motion.p>
  );
};

const framer_error = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.2 },
};
