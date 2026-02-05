// src/pages/Register.jsx
import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiLock, FiMail, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { CheckboxInput } from '../components/forms/CheckboxInput';
import { TextInput } from '../components/forms/TextInput';
import { useAuth } from '../hooks/useAuth';
import { registerSchema } from '../schema';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      comfirmPassword: '',
      terms: false,
    },
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const newUser = {
        email: data.email,
        password: data.password,
        comfirmPassword: data.comfirmPassword,
        full_name: data.fullName,
        profile_picture_url: '',
        role: 'admin',
      };
      await registerUser(newUser);
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
    }
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
            {/* fullname */}
            <motion.div className="mb-4" variants={itemVariants}>
              <TextInput name="fullName" label="Full Name" icon={<FiUser />} />
            </motion.div>

            {/* email */}
            <motion.div className="mb-4" variants={itemVariants}>
              <TextInput name="email" label="Email" type="email" icon={<FiMail />} />
            </motion.div>

            {/* password */}
            <motion.div className="mb-4" variants={itemVariants}>
              <TextInput
                name="password"
                label="Password"
                type="password"
                icon={<FiLock />} // Using Lock icon for the left side
                isMarked={true}
              />
            </motion.div>

            {/* confirm password */}
            <motion.div className="mb-4" variants={itemVariants}>
              <TextInput
                name="comfirmPassword"
                label="Comfirm Password"
                type="password"
                isMarked={true} // This will show the checkmark only when matching
                icon={<FiLock />}
                placeholder="Repeat your password"
              />
            </motion.div>

            {/* terms */}
            <motion.div className="mb-4 flex justify-center" variants={itemVariants}>
              <CheckboxInput
                name="terms"
                label={
                  <span>
                    I agree to the
                    <Link to="/terms-and-conditions" className="text-primary ml-2 hover:underline">
                      Terms and Conditions
                    </Link>
                  </span>
                }
              />
            </motion.div>

            <div>
              <button
                type="submit"
                className="bg-primary/90 hover:bg-primary focus:ring-primary mt-10 flex w-full cursor-pointer justify-center rounded-md border border-transparent px-6 py-3 text-sm font-medium text-white uppercase shadow-sm transition-all hover:scale-101 focus:ring-2 focus:ring-offset-2 focus:outline-none"
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
