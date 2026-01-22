import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { FaGoogle } from 'react-icons/fa';
import { FiLock, FiMail } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { loginSchema } from '../schema/index';

import { Input } from '../components/global/Input';
import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';

const Login = () => {
  const { loginUser } = useAuth();
  const { startLoading, stopLoading } = useLoading();
  const navigate = useNavigate();

  const methods = useForm({
    defaultValues: { email: '', password: '', rememberMe: false },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    startLoading();
    try {
      // Implement login logic here
      await loginUser(data.email, data.password, data.rememberMe);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      stopLoading();
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 text-center">
        <h2 className="mb-2 text-3xl font-bold text-gray-900">Login</h2>
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      <FormProvider {...methods}>
        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
          <Input
            name="email"
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            icon={<FiMail />}
          />

          <Input
            name="password"
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            icon={<FiLock />}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                name="rememberMe"
                id="rememberMe"
                type="checkbox"
                className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-gray-600 hover:text-blue-900 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="bg-primary/90 hover:bg-primary focus:ring-primary flex w-full justify-center rounded-md border border-transparent px-6 py-3 text-sm font-medium text-white uppercase shadow-sm transition-all hover:scale-101 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            >
              Sign In
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
              aria-label="Login with Google"
            >
              <FaGoogle className="h-5 w-5" />
              <span>Login with Google</span>
            </Link>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Login;
