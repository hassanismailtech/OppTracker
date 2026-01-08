import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User, FileText, Link as LinkIcon, Hash } from 'lucide-react';

interface ProfileProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
}

const Profile: React.FC<ProfileProps> = ({ profile, onSave }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [interestInput, setInterestInput] = useState('');

  const handleInterestAdd = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && interestInput.trim()) {
      e.preventDefault();
      if (!formData.interests.includes(interestInput.trim())) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, interestInput.trim()]
        }));
      }
      setInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    // Simple visual feedback
    const btn = document.getElementById('save-btn');
    if(btn) {
        const originalText = btn.innerText;
        btn.innerText = 'Saved!';
        setTimeout(() => btn.innerText = originalText, 2000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-8 pb-24">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">User Profile</h2>
        <p className="text-slate-500 mt-1">
          This data powers the logic engine to vet and match opportunities for you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
            <User className="text-brand-600" size={20} />
            <h3>Identity</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn URL</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="url"
                  className="w-full pl-10 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Experience Ingestion */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
            <FileText className="text-brand-600" size={20} />
            <h3>Resume / CV Summary</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Paste your Resume Text</label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all text-sm"
              placeholder="Paste the raw text of your CV here. The AI will use this to match you with jobs."
              value={formData.cvText}
              onChange={(e) => setFormData({ ...formData, cvText: e.target.value })}
            />
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold">
            <Hash className="text-brand-600" size={20} />
            <h3>Interests & Keywords</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Add Tags (Press Enter)</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="e.g. Remote, Python, Product Management"
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleInterestAdd}
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.interests.map((interest) => (
                <span key={interest} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-50 text-brand-700 border border-brand-100">
                  {interest}
                  <button
                    type="button"
                    onClick={() => removeInterest(interest)}
                    className="ml-2 hover:text-brand-900"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <button
          id="save-btn"
          type="submit"
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Profile
        </button>

      </form>
    </div>
  );
};

export default Profile;