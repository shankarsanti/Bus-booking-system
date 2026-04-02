'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { firestoreService } from '../../../lib/firestore';

export default function AgentProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      if (!user?.uid) {
        console.error('No user ID available');
        return;
      }
      
      const profileData = await firestoreService.read('users', user.uid);
      setProfile(profileData);
      setFormData({
        name: profileData?.name || '',
        email: profileData?.email || '',
        mobile: profileData?.mobile || ''
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.uid) {
      alert('User not authenticated');
      return;
    }
    
    setSaving(true);
    try {
      await firestoreService.update('users', user.uid, formData);
      setProfile({ ...profile, ...formData });
      setEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          {/* Profile Header */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {profile?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.role?.toUpperCase()}</p>
              <div className="mt-2 inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Commission Rate: {((profile?.commissionRate || 0.05) * 100).toFixed(1)}%
              </div>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Profile Details */}
          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Mobile</label>
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  maxLength={10}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      name: profile.name || '',
                      email: profile.email || '',
                      mobile: profile.mobile || ''
                    });
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-semibold">{profile?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-lg font-semibold">{profile?.email || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Mobile</p>
                <p className="text-lg font-semibold">{profile?.mobile}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">User ID</p>
                <p className="text-sm font-mono bg-gray-100 px-3 py-2 rounded">{profile?.uid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Member Since</p>
                <p className="text-lg font-semibold">
                  {profile?.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Account Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">Account Information</h3>
          <p className="text-sm text-blue-800">
            Your commission rate is set by the admin. If you need to update your commission rate or have any account-related queries, please contact the administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
