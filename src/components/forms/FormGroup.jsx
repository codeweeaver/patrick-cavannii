import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle } from 'react-icons/fi';
import { InputError } from '../global/InputError';

export const FormGroup = ({ label, error, children, icon, id, isMarked, errorClass }) => {
  // A field is "marked" only if it's valid (no error) and isMarked is true
  const showCheck = isMarked && !error;

  return (
    <div className="relative flex w-full flex-col gap-1.5">
      <div className="flex min-h-[18px] items-end justify-between px-1">
        {label && (
          <label
            htmlFor={id}
            className="cursor-pointer text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase"
          >
            {label}
          </label>
        )}

        <AnimatePresence mode="wait">
          {error?.message && (
            <InputError message={error.message} key={error.message} className={errorClass} />
          )}
        </AnimatePresence>
      </div>

      <div className="group relative">
        {icon && (
          <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-black">
            {icon}
          </div>
        )}

        {children}

        <AnimatePresence>
          {showCheck && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 text-green-500"
            >
              <FiCheckCircle size={12} strokeWidth={3} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
