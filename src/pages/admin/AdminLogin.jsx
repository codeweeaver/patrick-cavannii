import { yupResolver } from '@hookform/resolvers/yup';
import { motion } from 'framer-motion';
import { FormProvider, useForm } from 'react-hook-form';
import { HiLockClosed, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import logo from '../../assets/images/logo.png'; // Your logo without background
import { TextInput } from '../../components/forms/TextInput';
import { useAuth } from '../../hooks/useAuth';

const schema = yup.object().shape({
  email: yup.string().required('User Name is required'),
  password: yup.string().required('Password is required'),
});

const AdminLogin = () => {
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: { email: '', password: '', rememberMe: false },
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await loginUser(data.email, data.password, data.rememberMe);
      navigate('/admin');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div
      className="relative flex h-screen w-full items-center justify-center overflow-hidden px-4"
      style={{
        background: `linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)`,
      }}
    >
      {/* 1. Integrated Watermark Layer */}
      {/* This uses your logo.png to create a repeating pattern across the entire background */}
      <div
        className="ro pointer-events-none absolute inset-0 z-0 opacity-[0.06]"
        style={{
          backgroundImage: `url(${logo})`,
          backgroundSize: '180px auto', // Adjust size of the watermark here
          backgroundRepeat: 'repeat',
          filter: 'brightness(0) invert(1)', // Ensures logo text appears white/silvery
        }}
      />

      {/* 2. Floating Ambient Orbs (Behind the card, above the watermark) */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <motion.div
          animate={{ y: [0, -40, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[5%] left-[10%] h-64 w-64 rounded-full bg-white/10 blur-[80px]"
        />
        <motion.div
          animate={{ y: [0, 40, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute right-[5%] bottom-[5%] h-80 w-80 rounded-full bg-black/10 blur-[100px]"
        />
      </div>

      {/* 3. Login Card Container (Highest Z-Index) */}
      <div className="z-50 w-full max-w-[440px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-[3rem] border border-white/30 bg-white/10 p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] backdrop-blur-3xl"
        >
          {/* Branded Lock Icon Header */}
          <div className="mb-5 flex flex-col items-center">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="flex items-center justify-center rounded-3xl bg-white p-4 shadow-2xl"
            >
              <HiLockClosed className="text-accent text-2xl" />
            </motion.div>
            <h1 className="text-md mt-2 text-center font-black tracking-[0.2em] text-white uppercase">
              Admin Login
            </h1>
            <div className="mt-2 h-1 w-12 rounded-full bg-white/30" />
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <TextInput
                  name="email"
                  placeholder="User Name"
                  icon={<HiOutlineUser className="text-xl text-slate-400" />}
                  className="h-[45px] w-full rounded-full border-none bg-white/95 pr-6 pl-14 text-slate-900 shadow-xl transition-all focus:ring-4 focus:ring-white/20"
                />

                <TextInput
                  name="password"
                  type="password"
                  placeholder="Password"
                  icon={<HiOutlineLockClosed className="text-xl text-slate-400" />}
                  className="h-[45px] w-full rounded-full border-none bg-white/95 pr-6 pl-14 text-slate-900 shadow-xl transition-all focus:ring-4 focus:ring-white/20"
                />
              </div>

              {/* Options */}
              <div className="flex items-center justify-between px-3 text-[13px] text-white/90">
                <label className="flex cursor-pointer items-center gap-2 font-medium">
                  <input
                    type="checkbox"
                    {...register('rememberMe')}
                    className="accent-accent h-4 w-4 rounded border-none bg-white/20 focus:ring-0"
                  />
                  Stay signed in
                </label>
                <button
                  type="button"
                  className="font-bold underline decoration-white/30 underline-offset-4 transition-all hover:text-white"
                >
                  Forgot password?
                </button>
              </div>

              {/* Action Button - Solid Color from Image Design */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex h-[45px] w-full items-center justify-center rounded-full text-sm font-black tracking-[0.2em] text-white uppercase shadow-xl transition-all disabled:opacity-70"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  'login'
                )}
              </motion.button>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
