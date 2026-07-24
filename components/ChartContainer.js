'use client';

export default function ChartContainer({ title, children, className = '' }) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <h3 className="text-base font-semibold text-slate-800 mb-4">{title}</h3>
      {children}
    </div>
  );
}
