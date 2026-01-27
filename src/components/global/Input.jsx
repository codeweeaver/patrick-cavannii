import { motion } from 'framer-motion';
import { useId } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import Select from 'react-select';
import Flag from 'react-world-flags';
import { findInputError, isFormInvalid } from '../../utils/index';
import { InputError } from './InputError';

const inputVariants = {
  initial: { scale: 1, borderColor: '#D1D5DB' }, // gray-300
  focus: {
    scale: 1.0,
    borderColor: '#c99947', // primary color
    boxShadow: '0 0 0 2px rgba(201, 153, 71, 0.2)', // focus ring
    transition: { duration: 0.2, ease: 'circOut' },
  },
  error: {
    borderColor: '#EF4444', // red-500
    transition: { duration: 0.2 },
  },
};

export const Input = ({
  id,
  name,
  label,
  icon,
  placeholder,
  type,
  multiline = false,
  select = false,
  phone = false,
  rows = 3,
  className,
  options = [],
  isCountry = false,
  errorClass,
  country,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const inputErrors = findInputError(errors, name);
  const isInvalid = isFormInvalid(inputErrors);

  const baseClasses = `block w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 border rounded-md shadow-sm focus:outline-none placeholder-gray-400 transition-colors duration-200`;

  // Helper to render the option content
  const formatOptionLabel = (option) => (
    <div className="flex items-center gap-2">
      {isCountry && <Flag code={option.value} className="h-3 w-5 rounded-sm" />}
      <span className="text-sm">{option.label}</span>
    </div>
  );

  return (
    <div className={className || 'relative flex w-full flex-col'}>
      <div className="flex justify-between">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1 block text-sm font-medium whitespace-nowrap text-gray-700"
          >
            {label}
          </label>
        )}
        {isInvalid && (
          <InputError
            message={inputErrors.error.message}
            key={inputErrors.error.message}
            className={errorClass}
          />
        )}
      </div>

      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            {icon}
          </div>
        )}
        {multiline ? (
          <motion.textarea
            id={inputId}
            name={name} // Keep name for form submission
            className={`${baseClasses} ${isInvalid ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            rows={rows}
            style={{ minHeight: `${rows}rem` }}
            variants={inputVariants}
            initial="initial"
            whileFocus="focus"
            animate={isInvalid ? 'error' : 'initial'}
            {...props}
            {...register(name)} // Use register}
          />
        ) : select ? (
          <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                options={options}
                formatOptionLabel={formatOptionLabel}
                // Convert string value from Hook Form to Object for React-Select
                value={options.find((opt) => opt.value === field.value) || null}
                // Convert Object back to string for Hook Form
                onChange={(val) => {
                  field.onChange(val ? val.value : '');
                  if (isCountry) {
                    setValue('phone', '');
                  }
                }}
                placeholder={placeholder}
                isDisabled={disabled}
                unstyled
                classNames={{
                  control: (state) =>
                    `!min-h-[38px] !px-3 !border !rounded-md !shadow-sm !transition-all !duration-200 ${
                      state.isFocused
                        ? '!border-primary !ring-2 !ring-primary/20'
                        : '!border-gray-300'
                    } ${error ? '!border-red-500' : ''}`,
                  menu: () =>
                    '!mt-2 !rounded-md !bg-white !shadow-xl !border !border-gray-100 !z-50',
                  option: (state) =>
                    `!px-3 !py-2 !text-sm !cursor-pointer ${
                      state.isFocused
                        ? '!bg-primary/10 !text-primary'
                        : '!bg-transparent !text-gray-700'
                    }`,
                  noOptionsMessage: () => '!p-4 !text-sm !text-gray-500',
                  placeholder: () => '!text-gray-400 !text-sm',
                  singleValue: () => '!text-gray-900 !text-sm',
                }}
              />
            )}
          />
        ) : phone ? (
          <Controller
            name={name}
            control={control}
            render={({ field: { onChange, value, ref } }) => (
              <motion.div
                variants={inputVariants}
                initial="initial"
                animate={isInvalid ? 'error' : 'initial'}
                className={`focus-within:border-primary focus-within:ring-primary/20 flex items-center rounded-md border shadow-sm transition-all duration-200 focus-within:ring-2 ${
                  isInvalid ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <PhoneInput
                  key={country}
                  ref={ref}
                  defaultCountry={country?.toLowerCase()}
                  value={value || ''}
                  onChange={(phone) => onChange(phone)}
                  className={`flex w-full items-center ${icon ? 'pl-10' : ''}`}
                  inputClassName="!border-0 !bg-transparent !w-full !text-gray-900 !text-sm !h-10 !px-3 focus:!outline-none focus:!ring-0 placeholder:text-gray-400"
                  countrySelectorStyleProps={{
                    buttonClassName:
                      '!border-0 !border-r !border-gray-200 !bg-transparent !h-10 !px-3 hover:!bg-gray-50 !rounded-l-md',
                  }}
                  placeholder={placeholder}
                  {...props}
                />
              </motion.div>
            )}
          />
        ) : (
          <motion.input
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            className={baseClasses}
            variants={inputVariants}
            initial="initial"
            whileFocus="focus" // This now works correctly on motion.input
            animate={isInvalid ? 'error' : 'initial'}
            {...props}
            {...register(name)}
          />
        )}
      </div>
    </div>
  );
};
