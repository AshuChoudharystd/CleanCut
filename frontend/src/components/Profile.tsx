import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  joinDate: string;
  avatar: string;
}

interface ProfileStats {
  orders: number;
  reviews: number;
  wishlist: number;
  rewards: number;
}

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const {isLogin} = useContext(ShopContext);
  const navigate = useNavigate();
  useEffect(()=>{
    if(!isLogin){
      navigate("/login");
    }
  })
  
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Alexandria Hartwell',
    email: 'alexandria.hartwell@example.com',
    phone: '+1 (555) 123-4567',
    address: '1234 Victorian Lane, London, UK',
    bio: 'Passionate about timeless fashion and vintage aesthetics. Collector of classic literature and antique jewelry.',
    joinDate: 'March 15, 2022',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80'
  });

  const [stats] = useState<ProfileStats>({
    orders: 24,
    reviews: 18,
    wishlist: 32,
    rewards: 1250
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log('Profile saved:', userProfile);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="mt-20 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Ornate Header */}
      <div className="relative bg-white border-b-4 border-black">
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="inline-block relative">
              <h1 className="text-4xl md:text-6xl font-serif text-black mb-2 tracking-wider relative">
                PROFILE
                <div className="absolute -top-2 -left-2 w-full h-full border-2 border-black opacity-20 -z-10" />
              </h1>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600 tracking-widest">
                <div className="w-8 h-px bg-black" />
                <span>CleanCut</span>
                <div className="w-8 h-px bg-black" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">


        {/* Profile Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white border-2 border-black rounded-lg shadow-xl overflow-hidden">
                <div className="bg-black text-white p-6 text-center relative">
                  <div className="absolute inset-0 opacity-10">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black" />
                  </div>
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto mb-4 border-4 border-white rounded-full overflow-hidden bg-gray-200">
                      <img 
                        src={userProfile.avatar} 
                        alt={userProfile.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-2xl font-serif tracking-wide">{userProfile.name}</h2>
                    <p className="text-gray-300 text-sm tracking-widest mt-1">MEMBER SINCE {userProfile.joinDate.toUpperCase()}</p>
                  </div>
                </div>
                
                {/* Stats */}
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Orders', value: stats.orders },
                      { label: 'Reviews', value: stats.reviews },
                      { label: 'Wishlist', value: stats.wishlist },
                      { label: 'Rewards', value: stats.rewards }
                    ].map((stat, index) => (
                      <div key={index} className="text-center p-3 border border-gray-300 rounded">
                        <div className="text-2xl font-bold text-black">{stat.value}</div>
                        <div className="text-xs text-gray-600 tracking-wider uppercase">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-black rounded-lg shadow-xl">
                <div className="border-b-2 border-black p-6 flex justify-between items-center">
                  <h3 className="text-2xl font-serif tracking-wide">Profile Information</h3>
                  <button
                    onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                    className="px-6 py-2 bg-black text-white font-serif tracking-wide hover:bg-gray-800 transition-colors duration-200 rounded border-2 border-black"
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </button>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="font-serif text-lg tracking-wide text-black">Full Name</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={userProfile.name}
                        onChange={handleInputChange}
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none transition-colors duration-200"
                      />
                    ) : (
                      <div className="md:col-span-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded font-mono">
                        {userProfile.name}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="font-serif text-lg tracking-wide text-black">Email Address</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={userProfile.email}
                        onChange={handleInputChange}
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none transition-colors duration-200"
                      />
                    ) : (
                      <div className="md:col-span-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded font-mono">
                        {userProfile.email}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <label className="font-serif text-lg tracking-wide text-black">Phone Number</label>
                    {isEditing ? (
                      <input
                        type="tel"
                        name="phone"
                        value={userProfile.phone}
                        onChange={handleInputChange}
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none transition-colors duration-200"
                      />
                    ) : (
                      <div className="md:col-span-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded font-mono">
                        {userProfile.phone}
                      </div>
                    )}
                  </div>

                  {/* Address */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <label className="font-serif text-lg tracking-wide text-black mt-2">Address</label>
                    {isEditing ? (
                      <textarea
                        name="address"
                        value={userProfile.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none transition-colors duration-200 resize-none"
                      />
                    ) : (
                      <div className="md:col-span-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded font-mono">
                        {userProfile.address}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    <label className="font-serif text-lg tracking-wide text-black mt-2">Biography</label>
                    {isEditing ? (
                      <textarea
                        name="bio"
                        value={userProfile.bio}
                        onChange={handleInputChange}
                        rows={4}
                        className="md:col-span-2 px-4 py-2 border-2 border-gray-300 rounded focus:border-black focus:outline-none transition-colors duration-200 resize-none"
                      />
                    ) : (
                      <div className="md:col-span-2 px-4 py-2 bg-gray-50 border-2 border-gray-200 rounded font-mono leading-relaxed">
                        {userProfile.bio}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex justify-end space-x-4 pt-4 border-t-2 border-gray-200">
                      <button
                        onClick={handleCancel}
                        className="px-6 py-2 border-2 border-gray-400 text-gray-700 font-serif tracking-wide hover:bg-gray-100 transition-colors duration-200 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-black text-white font-serif tracking-wide hover:bg-gray-800 transition-colors duration-200 rounded border-2 border-black"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Actions */}
              <div className="mt-8 bg-white border-2 border-black rounded-lg shadow-xl">
                <div className="border-b-2 border-black p-4">
                  <h3 className="text-xl font-serif tracking-wide">Account Actions</h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Change Password', desc: 'Update your security credentials', icon: '🔐' },
                      { label: 'Privacy Settings', desc: 'Manage your privacy preferences', icon: '🛡️' },
                      { label: 'Download Data', desc: 'Export your account information', icon: '📄' },
                      { label: 'Delete Account', desc: 'Permanently remove your account', icon: '🗑️' }
                    ].map((action, index) => (
                      <button
                        key={index}
                        className="p-4 border-2 border-gray-300 rounded-lg hover:border-black hover:bg-gray-50 transition-all duration-200 text-left group"
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-2xl">{action.icon}</span>
                          <div>
                            <h4 className="font-serif text-lg tracking-wide text-black group-hover:text-gray-800">
                              {action.label}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">{action.desc}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;