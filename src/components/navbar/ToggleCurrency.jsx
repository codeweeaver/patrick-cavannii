import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import { useCurrency } from '../../context/CurrencyContext';

// flags
import ngFlag from '../../assets/images/flags/nigeria-flag.png';
import usFlag from '../../assets/images/flags/usa-flag.png';

const ToggleCurrency = ({ itemVariants }) => {
  const { currency, setCurrency } = useCurrency();
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);

  const currencies = [
    { code: 'USD', flag: usFlag, label: 'USD' },
    { code: 'NGN', flag: ngFlag, label: 'NGN' },
  ];
  const activeCurrency = currencies.find((c) => c.code === currency) || currencies[0];
  return (
    <motion.div className="relative z-20" variants={itemVariants}>
      <motion.button
        className="group flex cursor-pointer items-center space-x-1 text-gray-700"
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
      >
        <img src={activeCurrency.flag} alt={activeCurrency.code} className="h-3 w-4" />
        <span className="group-hover:text-primary text-sm font-medium max-sm:hidden">
          {activeCurrency.code}
        </span>

        <span className="group-hover:text-primary relative text-gray-600">
          <FiChevronDown
            className={`transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`}
          />
        </span>
      </motion.button>

      <AnimatePresence>
        {isCurrencyOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setIsCurrencyOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 z-20 mt-2 w-32 overflow-hidden rounded-xl border border-gray-100 bg-white py-2 shadow-xl"
            >
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    setCurrency(c.code);
                    setIsCurrencyOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                    currency === c.code
                      ? 'bg-primary/5 text-primary font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <img src={c.flag} alt={c.code} className="h-3 w-4" />
                  <span>{c.code}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ToggleCurrency;
