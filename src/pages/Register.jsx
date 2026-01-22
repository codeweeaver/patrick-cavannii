// src/pages/Register.jsx
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { Link, Outlet, useLocation } from 'react-router-dom';

const steps = [
  { path: '/register', label: 'Personal' },
  { path: '/register/security', label: 'Security' },
  { path: '/register/address', label: 'Address' },
];

const Register = () => {
  const location = useLocation();

  const getCurrentStepIndex = () => {
    const currentPath = location.pathname;
    if (currentPath.includes('address')) return 2;
    if (currentPath.includes('security')) return 1;
    return 0;
  };

  const currentStepIndex = getCurrentStepIndex();

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

        {/* Step Indicator */}
        <div className="relative mx-auto mb-12 max-w-[300px]">
          {/* Progress Bar Background */}
          <div className="absolute top-1/2 left-0 h-0.5 w-full -translate-y-1/2 bg-gray-200" />

          {/* Active Progress Bar */}
          <motion.div
            className="bg-primary absolute top-1/2 left-0 h-0.5 origin-left -translate-y-1/2"
            initial={{ width: '0%' }}
            animate={{
              width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />

          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = index === currentStepIndex;

              return (
                <div key={step.path} className="relative flex flex-col items-center gap-2">
                  <motion.div
                    className={`z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-white text-sm font-bold ${
                      isActive ? 'shadow-[0_0_0_4px_rgba(201,153,71,0.2)]' : ''
                    }`}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted ? '#c99947' : '#ffffff',
                      borderColor: isActive || isCompleted ? '#c99947' : '#e5e7eb',
                      color: isCompleted ? '#ffffff' : isActive ? '#c99947' : '#9ca3af',
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {isCompleted ? <FiCheck className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </motion.div>
                  <motion.span
                    className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                    animate={{
                      opacity: isActive || isCompleted ? 1 : 0.5,
                      y: isActive ? 0 : 0,
                    }}
                  >
                    {step.label}
                  </motion.span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
