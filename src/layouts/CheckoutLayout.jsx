import { motion } from 'framer-motion';
import { FiCheck, FiCreditCard, FiMapPin, FiTruck } from 'react-icons/fi';
import { Outlet, useLocation } from 'react-router-dom';

const steps = [
  { path: '/checkout/address', label: 'Address', icon: <FiMapPin /> },
  { path: '/checkout/shipping', label: 'Shipping', icon: <FiTruck /> },
  { path: '/checkout/payment', label: 'Payment', icon: <FiCreditCard /> },
];

const CheckoutLayout = () => {
  const location = useLocation();

  // Find the index of the current active step
  const currentStepIndex = steps.findIndex((step) => step.path === location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto max-w-2xl px-4">
        {/* Step Indicator */}
        <div className="relative mx-auto mb-12 max-w-[400px]">
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

        {/* Dynamic Content (Sub-routes) */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl bg-white p-8 shadow-sm"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default CheckoutLayout;
