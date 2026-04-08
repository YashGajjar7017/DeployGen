'use client';

/**
 * Glass Card Component
 * Reusable glassmorphic card with blur effect
 */

export const GlassCard = ({
  children,
  className = '',
  variant = 'default',
  hover = true,
  ...props
}) => {
  const variants = {
    default: 'bg-white/20 dark:bg-slate-900/20',
    light: 'bg-white/40 dark:bg-white/10',
    dark: 'bg-black/10 dark:bg-black/30',
    primary: 'bg-blue-400/20 dark:bg-blue-900/20',
  };

  const hoverClass = hover ? 'hover:bg-white/30 dark:hover:bg-slate-900/30 transition-all duration-300 hover:shadow-glass-lg' : '';

  return (
    <div
      className={`
        backdrop-blur-md rounded-2xl border border-white/30 dark:border-white/10
        shadow-glass ${variants[variant]} ${hoverClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Glass Button Component
 * Glassmorphic button with smooth interactions
 */
export const GlassButton = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variants = {
    primary: 'bg-blue-500/70 hover:bg-blue-600/80 text-white shadow-glass',
    secondary: 'bg-white/30 dark:bg-white/10 hover:bg-white/40 text-slate-900 dark:text-white',
    accent: 'bg-cyan-500/70 hover:bg-cyan-600/80 text-white shadow-glass',
    danger: 'bg-red-500/70 hover:bg-red-600/80 text-white shadow-glass',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`
        backdrop-blur-md rounded-xl border border-white/20 
        transition-all duration-200 active:scale-95
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

/**
 * Glass Input Component
 * Glassmorphic input field
 */
export const GlassInput = ({
  placeholder = '',
  className = '',
  ...props
}) => {
  return (
    <input
      placeholder={placeholder}
      className={`
        w-full px-4 py-3 rounded-xl
        bg-white/20 dark:bg-white/5
        border border-white/30 dark:border-white/10
        backdrop-blur-md
        text-slate-900 dark:text-white
        placeholder-slate-600 dark:placeholder-slate-400
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        focus:border-blue-500/50
        transition-all duration-200
        ${className}
      `}
      {...props}
    />
  );
};

/**
 * Glass Container Component
 * Full-width container with glass background
 */
export const GlassContainer = ({
  children,
  className = '',
  blur = 'blur-md',
  ...props
}) => {
  const blurClasses = {
    'blur-sm': 'backdrop-blur-sm',
    'blur-md': 'backdrop-blur-md',
    'blur-lg': 'backdrop-blur-lg',
  };

  return (
    <div
      className={`
        w-full rounded-3xl
        bg-white/10 dark:bg-slate-900/10
        border border-white/20 dark:border-white/5
        ${blurClasses[blur]}
        shadow-glass-lg
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Glass Badge Component
 * Small glassmorphic badge for labels
 */
export const GlassBadge = ({
  children,
  className = '',
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'bg-blue-500/40 text-blue-100 border-blue-400/30',
    success: 'bg-green-500/40 text-green-100 border-green-400/30',
    warning: 'bg-yellow-500/40 text-yellow-100 border-yellow-400/30',
    error: 'bg-red-500/40 text-red-100 border-red-400/30',
    info: 'bg-cyan-500/40 text-cyan-100 border-cyan-400/30',
  };

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full
        backdrop-blur-md border text-sm font-medium
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

/**
 * Glass Panel Component
 * Large panel with glass effect for sections
 */
export const GlassPanel = ({
  children,
  title,
  subtitle,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="space-y-1">
          {title && <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">{title}</h2>}
          {subtitle && <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
      )}
      <GlassContainer className="p-6 md:p-8">
        {children}
      </GlassContainer>
    </div>
  );
};

/**
 * Glass Modal Component
 * Modal with glassmorphic background overlay
 */
export const GlassModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
  ...props
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <GlassContainer className={`w-full max-w-md p-6 space-y-4 ${className}`} {...props}>
          {title && (
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-white/60 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
          )}
          {children}
        </GlassContainer>
      </div>
    </>
  );
};
