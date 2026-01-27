import { motion } from 'framer-motion';
import { useFormContext } from 'react-hook-form';
import { FormGroup } from './FormGroup';

export const TextInput = ({ name, label, icon, type = 'text', ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <FormGroup label={label} error={error} icon={icon} id={name}>
      <motion.input
        id={name}
        type={type}
        {...register(name)}
        whileFocus={{ scale: 1.005 }}
        className={`h-12 w-full border bg-white px-4 text-sm transition-all duration-300 outline-none ${icon ? 'pl-11' : 'pl-4'} ${
          error
            ? 'border-red-500 ring-2 ring-red-500/10'
            : 'focus:border-primary focus:ring-primary/10 border-gray-100 focus:ring-4'
        } rounded-xl shadow-sm placeholder:text-gray-300`}
        {...props}
      />
    </FormGroup>
  );
};
