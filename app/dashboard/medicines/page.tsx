'use client';

import { useEffect, useState } from 'react';
import { familyAPI, medicineAPI } from '@/lib/api';
import { FamilyMember, Medicine } from '@/lib/types';
import toast from 'react-hot-toast';

export default function MedicinesPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    name: '',
    dosage: '',
    frequency: 'once_daily',
    timing: '',
    startDate: '',
    endDate: '',
    isLongTerm: false,
    prescribedBy: '',
    refillDate: '',
    notes: ''
  });

  const fetchData = async () => {
    try {
      const [membersRes, medRes] = await Promise.all([
        familyAPI.getAll(),
        medicineAPI.getToday()
      ]);
      setMembers(membersRes.data.members);
      setMedicines(medRes.data.medicines);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await medicineAPI.add({
        ...formData,
        timing: formData.timing ? formData.timing.split(',').map(s => s.trim()) : []
      });
      toast.success('Medicine added!');
      setShowModal(false);
      setFormData({ memberId: '', name: '', dosage: '', frequency: 'once_daily', timing: '', startDate: '', endDate: '', isLongTerm: false, prescribedBy: '', refillDate: '', notes: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add medicine');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this medicine?')) return;
    try {
      await medicineAPI.delete(id);
      toast.success('Medicine deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const getMemberName = (memberId: any) => {
    if (typeof memberId === 'object') return memberId?.name;
    const m = members.find(m => m._id === memberId);
    return m?.name || 'Unknown';
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading medicines...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Medicines</h1>
          <p className="text-xs text-gray-500">{medicines.length} active medicines</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0F6E56] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0c5a47] transition">
          + Add medicine
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 divide-y divide-gray-50">
        {medicines.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10">No medicines added yet</p>
        ) : (
          medicines.map((med) => (
            <div key={med._id} className="flex items-center gap-3 p-4">
              <div className="w-9 h-9 bg-[#EEEDFE] rounded-md flex items-center justify-center flex-shrink-0">💊</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{med.name}</div>
                <div className="text-xs text-gray-500">{med.dosage} • {med.frequency.replace('_', ' ')} • {getMemberName(med.memberId)}</div>
                {med.timing?.length > 0 && (
                  <div className="text-xs text-[#534AB7] mt-0.5">{med.timing.join(', ')}</div>
                )}
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${med.isActive ? 'bg-[#E1F5EE] text-[#085041]' : 'bg-gray-100 text-gray-500'}`}>
                {med.isActive ? 'Active' : 'Inactive'}
              </span>
              <button onClick={() => handleDelete(med._id)} className="text-xs text-red-600 hover:underline">
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add medicine</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Family member</label>
                <select name="memberId" required value={formData.memberId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                  <option value="">Select member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.relationship})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Medicine name</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Metformin 500mg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Dosage</label>
                  <input name="dosage" required value={formData.dosage} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 1 tablet" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Frequency</label>
                  <select name="frequency" value={formData.frequency} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                    <option value="once_daily">Once daily</option>
                    <option value="twice_daily">Twice daily</option>
                    <option value="thrice_daily">Thrice daily</option>
                    <option value="as_needed">As needed</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Timing (comma separated)</label>
                <input name="timing" value={formData.timing} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 8:00 AM, 8:00 PM" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start date</label>
                  <input name="startDate" type="date" required value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Refill date</label>
                  <input name="refillDate" type="date" value={formData.refillDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Prescribed by</label>
                <input name="prescribedBy" value={formData.prescribedBy} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Dr. Sharma" />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" name="isLongTerm" checked={formData.isLongTerm} onChange={handleChange} />
                Long term medicine
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">{saving ? 'Adding...' : 'Add medicine'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}