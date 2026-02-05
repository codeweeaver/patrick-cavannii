import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FormGroup } from './FormGroup';

export const TextInput = ({
  name,
  label,
  icon,
  type = 'text',
  isMarked,
  errorClass,
  validate, // Custom validation rules object
  matchField, // Field to match for password confirmation
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  const error = errors[name];
  const fieldValue = watch(name);
  const matchFieldValue = watch(matchField || '');

  // Logic: Is it a password field?
  const isPasswordType = type === 'password';

  // Logic: Should we show the checkmark?
  // (Must have value, no error, and if matching field provided, values must match)
  const isValidAndMatching =
    isMarked && fieldValue && !error && (!matchField || fieldValue === matchFieldValue);

  // Logic: Toggle input type based on eye state
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;

  // Build validation rules with matchField support
  const validationRules = validate ? { ...validate } : {};
  if (validate?.matchField) {
    validationRules.validate = (value) => {
      const compareValue = getValues(validate.matchField);
      if (value !== compareValue) {
        return 'Passwords do not match';
      }
      return true;
    };
    delete validationRules.matchField;
  }

  return (
    <FormGroup
      label={label}
      error={error}
      icon={icon}
      id={name}
      isMarked={isValidAndMatching}
      errorClass={errorClass}
    >
      <div className="relative">
        <motion.input
          id={name}
          type={inputType}
          {...register(name, validationRules)}
          whileFocus={{ scale: 1.005 }}
          className={`h-12 w-full border bg-white px-4 text-sm transition-all duration-300 outline-none ${icon ? 'pl-11' : 'pl-4'} ${isPasswordType || isValidAndMatching ? 'pr-12' : 'pr-4'} ${
            error
              ? 'border-primary ring-2 ring-red-500/10'
              : 'border-primary/60 focus:border-primary focus:ring-2 focus:ring-black/5'
          } rounded-xl shadow-sm placeholder:text-gray-300`}
          {...props}
        />

        {/* EYE TOGGLE: Only shows if it's a password AND NOT currently showing a checkmark */}
        <AnimatePresence>
          {isPasswordType && !isValidAndMatching && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-4 z-20 -translate-y-1/2 text-gray-400 transition-colors hover:text-black"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </FormGroup>
  );
};
