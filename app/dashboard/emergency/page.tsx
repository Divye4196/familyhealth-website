'use client';

import { useEffect, useState } from 'react';
import { emergencyAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function EmergencyPage() {
  const [overview, setOverview] = useState<any>({ members: [], doctors: [], contacts: [] });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({ name: '', relationship: '', phone: '', isPrimary: false });

  const fetchData = async () => {
    try {
      const res = await emergencyAPI.getOverview();
      setOverview(res.data.overview);
    } catch (error) {
      toast.error('Failed to load emergency data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await emergencyAPI.addContact(formData);
      toast.success('Emergency contact added!');
      setShowModal(false);
      setFormData({ name: '', relationship: '', phone: '', isPrimary: false });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add contact');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this contact?')) return;
    try {
      await emergencyAPI.deleteContact(id);
      toast.success('Contact deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-medium text-gray-900">Emergency center</h1>
        <p className="text-xs text-gray-500">Critical info — always accessible</p>
      </div>

      <div className="bg-red-700 rounded-lg p-4 flex items-center gap-3 mb-4">
        <span className="text-2xl">🚑</span>
        <div className="text-red-50 flex-1">
          <div className="text-sm font-medium">In case of emergency</div>
          <div className="text-xs opacity-90">Show this screen to any doctor or paramedic</div>
        </div>
        <a href="tel:112" className="bg-white text-red-700 px-3 py-1.5 rounded-md text-xs font-medium">Call 112</a>
      </div>

      <div className="grid md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h2 className="text-sm font-medium text-red-700 mb-3">🩸 Blood groups</h2>
          {overview.members.map((m: any) => (
            <div key={m._id} className="flex items-center justify-between py-1.5">
              <span className="text-xs text-gray-700">{m.name}</span>
              <span className="text-sm font-medium text-red-700">{m.bloodGroup}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h2 className="text-sm font-medium text-amber-700 mb-3">⚠️ Allergies</h2>
          {overview.members.map((m: any) => (
            <div key={m._id} className="py-1.5">
              <div className="text-xs text-gray-700 mb-1">{m.name}</div>
              <div className="flex flex-wrap gap-1">
                {m.allergies?.length > 0 ? m.allergies.map((a: string) => (
                  <span key={a} className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded-full">{a}</span>
                )) : <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">None known</span>}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h2 className="text-sm font-medium text-blue-700 mb-3">🩺 Medical conditions</h2>
          {overview.members.map((m: any) => (
            <div key={m._id} className="py-1.5">
              <div className="text-xs text-gray-700 mb-1">{m.name}</div>
              <div className="flex flex-wrap gap-1">
                {m.medicalConditions?.length > 0 ? m.medicalConditions.map((c: string) => (
                  <span key={c} className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">{c}</span>
                )) : <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Healthy</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">Emergency contacts</h2>
            <button onClick={() => setShowModal(true)} className="text-xs text-[#185FA5]">+ Add</button>
          </div>
          {overview.contacts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No emergency contacts added</p>
          ) : (
            overview.contacts.map((c: any) => (
              <div key={c._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs">👤</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{c.name} {c.isPrimary && '⭐'}</div>
                  <div className="text-xs text-gray-500">{c.relationship} • {c.phone}</div>
                </div>
                <a href={`tel:${c.phone}`} className="text-xs bg-[#0F6E56] text-white px-2.5 py-1 rounded-md">Call</a>
                <button onClick={() => handleDelete(c._id)} className="text-xs text-red-600">✕</button>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Emergency doctors</h2>
          {overview.doctors.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No doctors added</p>
          ) : (
            overview.doctors.map((d: any) => (
              <div key={d._id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-[#EEEDFE] flex items-center justify-center text-xs">🩺</div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.specialization} • {d.phone}</div>
                </div>
                <a href={`tel:${d.phone}`} className="text-xs bg-[#0F6E56] text-white px-2.5 py-1 rounded-md">Call</a>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Add emergency contact</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Name</label>
                <input name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Neha Kumar" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Relationship</label>
                <input name="relationship" required value={formData.relationship} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Daughter" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Phone</label>
                <input name="phone" required value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 9876500002" />
              </div>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" name="isPrimary" checked={formData.isPrimary} onChange={handleChange} />
                Primary contact
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">{saving ? 'Adding...' : 'Add contact'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}