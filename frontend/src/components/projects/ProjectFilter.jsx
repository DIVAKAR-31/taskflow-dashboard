import React from 'react';
import { Search, Filter } from 'lucide-react';

const ProjectFilter = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}) => {
  const categories = [
    'All',
    'Web Development',
    'Mobile App',
    'Design & UI/UX',
    'Marketing',
    'DevOps',
    'General',
  ];

  const statuses = ['All', 'In Progress', 'Planning', 'Completed', 'On Hold'];

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft-sm flex flex-col md:flex-row items-center justify-between gap-3">
      {/* Search Bar */}
      <div className="relative w-full md:w-80">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        />
      </div>

      {/* Category & Status Filters */}
      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Category Dropdown */}
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              Category: {cat}
            </option>
          ))}
        </select>

        {/* Status Dropdown */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        >
          {statuses.map((st) => (
            <option key={st} value={st}>
              Status: {st}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProjectFilter;
