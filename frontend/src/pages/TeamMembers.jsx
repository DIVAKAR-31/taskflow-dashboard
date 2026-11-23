import React, { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Badge from '../components/common/Badge';
import { Users, Shield, User, Loader2, Mail, ShieldCheck } from 'lucide-react';

const TeamMembers = () => {
  const { users, fetchUsers, loading } = useProjects();
  const { user: currentUser, isAdmin } = useAuth();
  const [updatingId, setUpdatingId] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      setMessage('');
      const res = await axiosInstance.patch(`/users/${userId}/role`, {
        role: newRole,
      });
      setMessage(res.data.message || `Role updated to ${newRole}`);
      await fetchUsers();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Team Members
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage contributors, roles, and project assignments
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-xl shadow-soft-sm text-xs font-semibold text-slate-600">
          <Users className="w-4 h-4 text-indigo-600" />
          <span>{users.length} Total Members</span>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs rounded-xl font-medium flex items-center justify-between">
          <span>{message}</span>
          <button
            onClick={() => setMessage('')}
            className="text-xs font-bold underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Team Cards Grid */}
      {loading && users.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400">Loading team members...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {users.map((member) => (
            <div
              key={member._id}
              className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        member.avatar ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                          member.name
                        )}`
                      }
                      alt={member.name}
                      className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/20"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">
                        {member.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {member.title || 'Team Member'}
                      </p>
                    </div>
                  </div>

                  <Badge variant={member.role} size="sm">
                    {member.role === 'Admin' ? (
                      <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    ) : (
                      <User className="w-3 h-3 text-slate-400" />
                    )}
                    {member.role}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg mb-4 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>

              {/* Role Management (Admin only) */}
              {isAdmin && (
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Manage Role:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      disabled={
                        updatingId === member._id || member.role === 'Member'
                      }
                      onClick={() => handleRoleChange(member._id, 'Member')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        member.role === 'Member'
                          ? 'bg-slate-200 text-slate-800 cursor-default'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Member
                    </button>
                    <button
                      disabled={
                        updatingId === member._id || member.role === 'Admin'
                      }
                      onClick={() => handleRoleChange(member._id, 'Admin')}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                        member.role === 'Admin'
                          ? 'bg-indigo-600 text-white cursor-default'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                      }`}
                    >
                      Admin
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
