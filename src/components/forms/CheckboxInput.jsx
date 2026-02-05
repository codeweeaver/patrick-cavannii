import { AnimatePresence } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { FiCheck } from 'react-icons/fi';
import { InputError } from '../global/InputError';

export const CheckboxInput = ({ name, label }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-4 w-4 items-center justify-center">
          <input
            type="checkbox"
            id={name}
            {...register(name)}
            className={`peer h-full w-full cursor-pointer appearance-none rounded-md border transition-all ${error ? 'border-red-500' : 'border-gray-300'} checked:border-primary checked:bg-primary focus:ring-primary/50 focus:ring-2 focus:ring-offset-2 focus:outline-none`}
          />
          <div className="pointer-events-none absolute text-white opacity-0 transition-opacity peer-checked:opacity-100">
            <FiCheck strokeWidth={3} size={14} />
          </div>
        </div>
        {label && (
          <label
            htmlFor={name}
            className="cursor-pointer text-sm text-gray-600 transition-colors select-none hover:text-gray-900"
          >
            {label}
          </label>
        )}
      </div>
      <AnimatePresence mode="wait">
        {error?.message && (
          <div className="pl-8">
            <InputError message={error.message} key={error.message} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
