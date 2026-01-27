import { motion } from 'framer-motion';
import { FiArrowRight, FiLock } from 'react-icons/fi';
import { useNavigate } from 'react-router';

const ExclusiveButton = () => {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05, boxShadow: '0px 0px 20px rgba(var(--primary-rgb), 0.5)' }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate('/exclusive')}
      className="group relative flex items-center gap-2 overflow-hidden rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition-all"
    >
      {/* The Animated "Shimmer" Streak */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite] bg-linear-to-r from-transparent via-white/20 to-transparent" />

      {/* Button Content */}
      <span className="relative z-10 flex items-center gap-1.5 tracking-wide uppercase">
        <FiLock className="text-primary transition-transform group-hover:rotate-12" />
        Exclusive
      </span>

      <FiArrowRight className="relative z-10 transition-transform group-hover:translate-x-1" />

      {/* Border Glow */}
      <div className="group-hover:border-primary/50 absolute inset-0 rounded-full border border-white/10 transition-colors" />
    </motion.button>
  );
};

export default ExclusiveButton;
