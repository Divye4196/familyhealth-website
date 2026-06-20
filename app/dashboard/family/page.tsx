'use client';

import { useEffect, useState } from 'react';
import { familyAPI } from '@/lib/api';
import { FamilyMember } from '@/lib/types';
import toast from 'react-hot-toast';

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    age: '',
    gender: 'Male',
    bloodGroup: 'Unknown',
    allergies: '',
    medicalConditions: '',
    primaryDoctor: ''
  });

  const fetchMembers = async () => {
    try {
      const res = await familyAPI.getAll();
      setMembers(res.data.members);
    } catch (error) {
      toast.error('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await familyAPI.add({
        ...formData,
        age: Number(formData.age),
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : [],
        medicalConditions: formData.medicalConditions ? formData.medicalConditions.split(',').map(s => s.trim()) : []
      });
      toast.success('Family member added!');
      setShowModal(false);
      setFormData({ name: '', relationship: '', age: '', gender: 'Male', bloodGroup: 'Unknown', allergies: '', medicalConditions: '', primaryDoctor: '' });
      fetchMembers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this family member?')) return;
    try {
      await familyAPI.delete(id);
      toast.success('Family member deleted');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading family members...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Family members</h1>
          <p className="text-xs text-gray-500">{members.length} members tracked — unlimited members supported</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#0F6E56] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0c5a47] transition"
        >
          + Add member
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {members.map((member) => (
          <div key={member._id} className="bg-white rounded-lg p-4 border border-gray-100">
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
              <div className="w-11 h-11 rounded-full bg-[#E6F1FB] flex items-center justify-center text-sm font-medium text-[#0C447C]">
                {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">{member.name}</div>
                <div className="text-xs text-gray-500">{member.relationship} • Age {member.age} • {member.gender}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-50 rounded-md p-2">
                <div className="text-[10px] text-gray-400">Blood group</div>
                <div className="text-xs font-medium text-gray-900">{member.bloodGroup}</div>
              </div>
              <div className="bg-gray-50 rounded-md p-2">
                <div className="text-[10px] text-gray-400">Conditions</div>
                <div className="text-xs font-medium text-gray-900">{member.medicalConditions?.length ? member.medicalConditions.join(', ') : 'None'}</div>
              </div>
              <div className="bg-gray-50 rounded-md p-2">
                <div className="text-[10px] text-gray-400">Allergies</div>
                <div className="text-xs font-medium text-gray-900">{member.allergies?.length ? member.allergies.join(', ') : 'None'}</div>
              </div>
              <div className="bg-gray-50 rounded-md p-2">
                <div className="text-[10px] text-gray-400">Primary doctor</div>
                <div className="text-xs font-medium text-gray-900">{member.primaryDoctor || '—'}</div>
              </div>
            </div>

            <button
              onClick={() => handleDelete(member._id)}
              className="w-full text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition"
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2 min-h-[180px] hover:border-gray-400 transition"
        >
          <span className="text-2xl text-gray-400">+</span>
          <span className="text-sm text-gray-500">Add a family member</span>
        </button>
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add family member</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Name</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="Ramesh Kumar" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Relationship</label>
                  <input name="relationship" required value={formData.relationship} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="Father" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Age</label>
                  <input name="age" type="number" required value={formData.age} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="58" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Blood group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                    <option>Unknown</option>
                    <option>A+</option><option>A-</option>
                    <option>B+</option><option>B-</option>
                    <option>AB+</option><option>AB-</option>
                    <option>O+</option><option>O-</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Allergies (comma separated)</label>
                <input name="allergies" value={formData.allergies} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="Penicillin, Dust" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Medical conditions (comma separated)</label>
                <input name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="Diabetes, BP" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Primary doctor</label>
                <input name="primaryDoctor" value={formData.primaryDoctor} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="Dr. Sharma" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">
                  {saving ? 'Adding...' : 'Add member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}