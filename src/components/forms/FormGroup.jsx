import { AnimatePresence } from 'framer-motion';
import { InputError } from '../global/InputError';

export const FormGroup = ({ label, error, children, icon, id }) => {
  return (
    <div className="flex w-full flex-col gap-1.5">
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
          {error?.message && <InputError message={error.message} key={error.message} />}
        </AnimatePresence>
      </div>

      <div className="group relative">
        {icon && (
          <div className="absolute top-1/2 left-4 z-10 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-black">
            {icon}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
