import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { FiLock } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/global/Input';
import { securitySchema } from '../../schema';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Security = () => {
  const navigate = useNavigate();
  const savedData = JSON.parse(sessionStorage.getItem('securityData') || '{}');

  const methods = useForm({
    defaultValues: {
      password: savedData.password || '',
      comfirmPassword: savedData.comfirmPassword || '',
      terms: savedData.terms || false,
    },
    resolver: yupResolver(securitySchema),
  });

  const onSubmit = (data) => {
    sessionStorage.setItem('securityData', JSON.stringify(data));
    navigate('/register/address');
  };

  const handleBack = () => {
    const currentValues = methods.getValues();
    sessionStorage.setItem('securityData', JSON.stringify(currentValues));
    navigate('/register');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div key="step2" exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              name="password"
              label="Password"
              type="password"
              id="password"
              placeholder="Create a password"
              icon={<FiLock />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              name="comfirmPassword"
              label="Confirm Password"
              type="password"
              id="comfirmPassword"
              placeholder="Confirm your password"
              icon={<FiLock />}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="relative flex items-center justify-center">
            <Input
              name="terms"
              id="terms"
              type="checkbox"
              className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
              errorClass="absolute -bottom-5 left-1/2 transform -translate-x-1/2"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I Accept the{' '}
              <Link to="/terms-and-conditions" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
            </label>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={handleBack}
              className="focus:ring-primary flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Back
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              Next
            </button>
          </motion.div>
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default Security;
