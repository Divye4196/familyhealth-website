'use client';

import { useEffect, useState } from 'react';
import { doctorAPI, familyAPI } from '@/lib/api';
import { Doctor, FamilyMember } from '@/lib/types';
import toast from 'react-hot-toast';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '', specialization: '', phone: '', hospital: '', address: '',
    availableDays: '', availableTime: '', assignedMembers: [] as string[], notes: ''
  });

  const fetchData = async () => {
    try {
      const [docRes, memRes] = await Promise.all([doctorAPI.getAll(), familyAPI.getAll()]);
      setDoctors(docRes.data.doctors);
      setMembers(memRes.data.members);
    } catch (error) {
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      assignedMembers: prev.assignedMembers.includes(id)
        ? prev.assignedMembers.filter(m => m !== id)
        : [...prev.assignedMembers, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await doctorAPI.add(formData);
      toast.success('Doctor added!');
      setShowModal(false);
      setFormData({ name: '', specialization: '', phone: '', hospital: '', address: '', availableDays: '', availableTime: '', assignedMembers: [], notes: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this doctor?')) return;
    try {
      await doctorAPI.delete(id);
      toast.success('Doctor deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading doctors...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Doctors</h1>
          <p className="text-xs text-gray-500">{doctors.length} doctors saved</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0F6E56] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0c5a47] transition">
          + Add doctor
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {doctors.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10 col-span-3">No doctors added yet</p>
        ) : (
          doctors.map((doc) => (
            <div key={doc._id} className="bg-white rounded-lg p-4 border border-gray-100">
              <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#0C447C]">
                  {doc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                  <div className="text-xs text-[#185FA5]">{doc.specialization}</div>
                </div>
              </div>
              <div className="space-y-1 text-xs text-gray-500 mb-3">
                <div>🏥 {doc.hospital}</div>
                <div>📞 {doc.phone}</div>
                {doc.availableDays && <div>🕐 {doc.availableDays}, {doc.availableTime}</div>}
              </div>
              {doc.assignedMembers?.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.assignedMembers.map((m: any) => (
                    <span key={m._id || m} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {m.name || m}
                    </span>
                  ))}
                </div>
              )}
              <button onClick={() => handleDelete(doc._id)} className="w-full text-xs text-red-600 border border-red-200 rounded-md py-1.5 hover:bg-red-50 transition">
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add doctor</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Doctor name</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Dr. R. Sharma" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Specialization</label>
                  <input name="specialization" required value={formData.specialization} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Cardiologist" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Phone</label>
                  <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Hospital</label>
                <input name="hospital" required value={formData.hospital} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Fortis Hospital, Ludhiana" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Address</label>
                <input name="address" value={formData.address} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Ludhiana, Punjab" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Available days</label>
                  <input name="availableDays" value={formData.availableDays} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Mon-Sat" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Available time</label>
                  <input name="availableTime" value={formData.availableTime} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 10AM-2PM" />
                </div>
              </div>
              {members.length > 0 && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Assign to family members</label>
                  <div className="flex flex-wrap gap-2">
                    {members.map(m => (
                      <button
                        type="button"
                        key={m._id}
                        onClick={() => toggleMember(m._id)}
                        className={`text-xs px-2.5 py-1 rounded-full border ${
                          formData.assignedMembers.includes(m._id)
                            ? 'bg-[#0C447C] text-white border-[#0C447C]'
                            : 'bg-white text-gray-600 border-gray-300'
                        }`}
                      >
                        {m.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">{saving ? 'Adding...' : 'Add doctor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}