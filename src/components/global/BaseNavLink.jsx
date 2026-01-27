import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

const BaseNavLink = ({
  to,
  icon: Icon,
  label,
  iconPosition = 'left',
  className = '',
  activeClassName = '',
  inactiveClassName = '',
  activeBackgroundClassName = 'bg-black rounded-lg',
  layoutId = 'active-pill',
  end = false,
  children,
  ...props
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 transition-colors duration-300 ${className} ${isActive ? activeClassName : inactiveClassName} `
      }
      {...props}
    >
      {({ isActive }) => (
        <>
          <div
            className={`relative z-10 flex w-full items-center gap-2 ${iconPosition === 'right' ? 'flex-row-reverse justify-between' : 'flex-row'} `}
          >
            {/* Animated Icon Container */}
            {Icon && (
              <motion.span
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="shrink-0"
              >
                {Icon}
              </motion.span>
            )}

            {/* Label */}
            {label && <span className="truncate">{label}</span>}

            {/* Render children (e.g. badges) */}
            {children}
          </div>

          {/* SHARED LAYOUT BACKGROUND:
              This creates a sliding pill/background effect when a link becomes active.
          */}
          {isActive && (
            <motion.div
              layoutId={layoutId}
              className={`absolute inset-0 z-0 ${activeBackgroundClassName}`}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};

export default BaseNavLink;
