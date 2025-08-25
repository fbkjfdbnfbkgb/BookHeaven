import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Calendar, 
  Edit3, 
  Save, 
  X,
  RefreshCw,
  Shield,
  Bell,
  Eye,
  EyeOff
} from 'lucide-react';

const Setting = () => {
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const [Value, setValue] = useState({address: ""});
  const [ProfileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [saving, setSaving] = useState(false);
  
  const headers = {
    "id": localStorage.getItem("id"),
    "Authorization": `Bearer ${localStorage.getItem("token")}`
  };

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/api/v1/get-user-info', { headers });    
      setProfileData(response.data.user || response.data);
      setEditData(response.data.user || response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update address using the specific endpoint
      const response = await axios.put('http://localhost:3000/api/v1/update-address', 
        { address: editData.address }, 
        { headers }
      );
      setProfileData(editData);
      setIsEditing(false);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update address");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(ProfileData);
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-900 p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-r from-zinc-600 to-zinc-700">
                <SettingsIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-zinc-300 text-lg">
                  Manage your account and preferences
                </p>
              </div>
            </div>
            
            <button 
              onClick={fetchUserInfo}
              disabled={Loading}
              className="flex items-center gap-3 px-6 py-3 bg-zinc-700/50 hover:bg-zinc-600/50 backdrop-blur-md rounded-2xl border border-zinc-600/50 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${Loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {Error && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="backdrop-blur-md bg-red-500/20 border border-red-500/30 rounded-2xl p-4">
            <p className="text-red-300 text-center">{Error}</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {Loading && (
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <span className="ml-4 text-white text-lg">Loading your settings...</span>
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      {!Loading && ProfileData && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Information */}
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <User className="w-6 h-6 text-blue-400" />
                  Profile Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl text-blue-300 font-medium transition-all duration-300 hover:scale-105"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Address
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-xl text-green-300 font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    >
                      {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Address
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-medium transition-all duration-300 hover:scale-105"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-zinc-300 font-medium">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <div className="px-4 py-3 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-white">
                    {ProfileData.username || 'Not provided'}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="px-4 py-3 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-white">
                    {ProfileData.email || 'Not provided'}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="flex items-center gap-2 text-zinc-300 font-medium">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-zinc-700/50 border border-zinc-600/50 rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 resize-none"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <div className="px-4 py-3 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-white min-h-[80px]">
                      {ProfileData.address || 'Not provided'}
                    </div>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <div className="px-4 py-3 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-white">
                    {ProfileData.phone || 'Not provided'}
                  </div>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-zinc-300 font-medium">
                    <Calendar className="w-4 h-4" />
                    Member Since
                  </label>
                  <div className="px-4 py-3 bg-zinc-700/30 border border-zinc-600/30 rounded-xl text-white">
                    {ProfileData.createdAt ? new Date(ProfileData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not available'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3 mb-6">
                <Shield className="w-6 h-6 text-green-400" />
                Account Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-zinc-700/30 border border-zinc-600/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-white font-medium">Email Notifications</p>
                      <p className="text-zinc-400 text-sm">Receive updates about your orders</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-700/30 border border-zinc-600/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-white font-medium">Profile Visibility</p>
                      <p className="text-zinc-400 text-sm">Make your profile visible to others</p>
                    </div>
                  </div>
                  <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!Loading && !ProfileData && !Error && (
        <div className="max-w-4xl mx-auto">
          <div className="backdrop-blur-md bg-zinc-800/50 rounded-3xl border border-zinc-700/50 shadow-2xl p-16 text-center">
            <div className="mb-6">
              <User className="w-24 h-24 text-zinc-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">No profile data found</h2>
              <p className="text-zinc-300 text-lg max-w-md mx-auto">
                Unable to load your profile information. Please try refreshing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Setting;