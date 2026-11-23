import React from 'react';

const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variantStyles = {
    // Priorities
    high: 'bg-rose-50 text-rose-700 border border-rose-200/60 font-medium',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200/60 font-medium',
    low: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-medium',

    // Statuses
    'to-do': 'bg-slate-100 text-slate-700 border border-slate-200',
    'in-progress': 'bg-blue-50 text-blue-700 border border-blue-200',
    completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    planning: 'bg-purple-50 text-purple-700 border border-purple-200',
    'on-hold': 'bg-gray-100 text-gray-700 border border-gray-200',

    // Roles
    admin: 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold',
    member: 'bg-slate-100 text-slate-700 border border-slate-200',

    default: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizeStyles = {
    xs: 'px-1.5 py-0.5 text-[10px] rounded',
    sm: 'px-2 py-0.5 text-xs rounded-md',
    md: 'px-2.5 py-1 text-xs rounded-md font-medium',
  };

  const key = String(variant).toLowerCase().replace(/\s+/g, '-');
  const appliedStyle = variantStyles[key] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none tracking-wide ${appliedStyle} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
