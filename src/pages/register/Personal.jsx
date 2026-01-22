import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/global/Input';
import { personalSchema } from '../../schema/personalSchema';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Personal = () => {
  const navigate = useNavigate();

  const savedData = JSON.parse(sessionStorage.getItem('personalData') || '{}');

  const methods = useForm({
    defaultValues: {
      name: savedData.name || '',
      email: savedData.email || '',
      phone: savedData.phone || '',
    },
    resolver: yupResolver(personalSchema),
  });

  const onSubmit = (data) => {
    sessionStorage.setItem('personalData', JSON.stringify(data));
    navigate('/register/security');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <motion.div key="step1" exit={{ opacity: 0, x: -20 }} className="space-y-4">
          <motion.div variants={itemVariants}>
            <Input
              name="name"
              label="Full Name"
              type="name"
              id="name"
              placeholder="enter your full name"
              icon={<FiUser />}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <Input
              name="email"
              label="Email"
              type="email"
              id="email"
              placeholder="your.email@example.com"
              icon={<FiMail />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Input
              phone={true}
              name="phone"
              label="Phone Number"
              placeholder="+123456789"
              id="phone"
            />
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4">
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              Continue
            </button>
          </motion.div>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          {/* signup with social media */}
          <div className="mt-6 flex items-center justify-center gap-5">
            {/* Google */}
            <Link
              to="/auth/google"
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#DB4437] px-6 py-3 text-white transition-colors hover:bg-[#c53929]"
              aria-label="Login with Google"
            >
              <FaGoogle className="h-5 w-5" />
              <span>Login with Google</span>
            </Link>
          </div>
        </motion.div>
      </form>
    </FormProvider>
  );
};

export default Personal;
