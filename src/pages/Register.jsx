// src/pages/Register.jsx
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { TextInput } from '../components/forms/TextInput';
import { registerSchema } from '../schema';

const Register = () => {
  const methods = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      comfirmPassword: '',
    },
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    console.log(data);
  };

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <TextInput name="fullname" label="Full Name" type="text" icon={<FiUser />} />

            <div>
              <button
                type="submit"
                className="bg-primary/90 hover:bg-primary focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-6 py-3 text-sm font-medium text-white uppercase shadow-sm transition-all hover:scale-101 focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Register
              </button>
            </div>

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
                aria-label="Sign up with Google"
              >
                <FaGoogle className="h-5 w-5" />
                <span>Login with Google</span>
              </Link>
            </div>
          </form>
        </FormProvider>
      </motion.div>
    </div>
  );
};

export default Register;
