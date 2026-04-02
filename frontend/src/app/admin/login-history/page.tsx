import { useState, useEffect } from 'react';
import { Clock, User, Shield, Users, Phone, Mail, AlertCircle, CheckCircle, Filter } from 'lucide-react';
import { loginHistoryService } from '../../../lib/loginHistoryService';
import type { LoginHistory } from '../../../types/loginHistory';
import { Timestamp } from 'firebase/firestore';

export default function LoginHistoryPage() {
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'admin' | 'agent' | 'customer'>('all');

  useEffect(() => {
    loadLoginHistory();
  }, [filter]);

  const loadLoginHistory = async () => {
    setLoading(true);
    try {
      let data: LoginHistory[] = [];
      
      if (filter === 'success' || filter === 'failed') {
        if (filter === 'failed') {
          data = await loginHistoryService.getFailedLoginAttempts(100);
        } else {
          data = await loginHistoryService.getAllLoginHistory(100);
          data = data.filter(item => item.status === 'success');
        }
      } else if (filter === 'admin' || filter === 'agent' || filter === 'customer') {
        data = await loginHistoryService.getLoginHistoryByRole(filter, 100);
      } else {
        data = await loginHistoryService.getAllLoginHistory(100);
      }
      
      setLoginHistory(data);
    } catch (error) {
      console.error('Failed to load login history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: Timestamp) => {
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return <Shield className="w-4 h-4" />;
      case 'agent':
        return <Users className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
      case 'super_admin':
        return 'bg-purple-100 text-purple-700';
      case 'agent':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Login History</h1>
        <p className="text-gray-600">Track all login attempts across the system</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All Logins' },
            { value: 'success', label: 'Successful' },
            { value: 'failed', label: 'Failed' },
            { value: 'admin', label: 'Admin' },
            { value: 'agent', label: 'Agent' },
            { value: 'customer', label: 'Customer' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === option.value
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Login History Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading login history...</p>
          </div>
        ) : loginHistory.length === 0 ? (
          <div className="p-12 text-center">
            <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No login history found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loginHistory.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {formatTimestamp(record.loginTime)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="font-medium text-gray-900">{record.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(record.userRole)}`}>
                        {getRoleIcon(record.userRole)}
                        {record.userRole}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        {record.loginMethod === 'phone_otp' ? (
                          <>
                            <Phone className="w-4 h-4" />
                            OTP
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Email
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {record.email || record.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {record.status === 'success' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                          <AlertCircle className="w-3 h-3" />
                          Failed
                        </span>
                      )}
                      {record.failureReason && (
                        <div className="text-xs text-red-600 mt-1">{record.failureReason}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {record.deviceInfo || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      {!loading && loginHistory.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Total Logins</div>
            <div className="text-2xl font-bold text-gray-900">{loginHistory.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Successful</div>
            <div className="text-2xl font-bold text-green-600">
              {loginHistory.filter(r => r.status === 'success').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Failed</div>
            <div className="text-2xl font-bold text-red-600">
              {loginHistory.filter(r => r.status === 'failed').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-600 mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round((loginHistory.filter(r => r.status === 'success').length / loginHistory.length) * 100)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
