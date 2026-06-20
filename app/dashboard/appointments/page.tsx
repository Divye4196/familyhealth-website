'use client';

import { useEffect, useState } from 'react';
import { appointmentAPI, familyAPI, doctorAPI } from '@/lib/api';
import { Appointment, FamilyMember, Doctor } from '@/lib/types';
import toast from 'react-hot-toast';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '', doctorId: '', date: '', time: '', reason: '', location: ''
  });

  const fetchData = async () => {
    try {
      const [apptRes, memRes, docRes] = await Promise.all([
        appointmentAPI.getAll(), familyAPI.getAll(), doctorAPI.getAll()
      ]);
      setAppointments(apptRes.data.appointments);
      setMembers(memRes.data.members);
      setDoctors(docRes.data.doctors);
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await appointmentAPI.add(formData);
      toast.success('Appointment booked!');
      setShowModal(false);
      setFormData({ memberId: '', doctorId: '', date: '', time: '', reason: '', location: '' });
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.delete(id);
      toast.success('Appointment deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const upcoming = appointments.filter(a => a.status === 'upcoming');
  const past = appointments.filter(a => a.status !== 'upcoming');

  if (loading) return <div className="text-center py-20 text-gray-400">Loading appointments...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Appointments</h1>
          <p className="text-xs text-gray-500">{upcoming.length} upcoming appointments</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0F6E56] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0c5a47] transition">
          + Book appointment
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-4">
        <h2 className="text-sm font-medium text-gray-900 mb-3">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No upcoming appointments</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((appt) => (
              <div key={appt._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-11 h-11 bg-[#E6F1FB] rounded-md flex flex-col items-center justify-center flex-shrink-0">
                  <div className="text-sm font-medium text-[#0C447C]">{new Date(appt.date).getDate()}</div>
                  <div className="text-[9px] text-[#185FA5]">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{appt.reason}</div>
                  <div className="text-xs text-gray-500">{(appt.doctorId as any)?.name} • {appt.time}</div>
                  <div className="text-xs text-[#185FA5] mt-0.5">{(appt.memberId as any)?.name}</div>
                </div>
                <button onClick={() => handleDelete(appt._id)} className="text-xs text-red-600 hover:underline">Cancel</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {past.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <h2 className="text-sm font-medium text-gray-900 mb-3">Past</h2>
          <div className="space-y-3 opacity-70">
            {past.map((appt) => (
              <div key={appt._id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg">
                <div className="w-11 h-11 bg-gray-50 rounded-md flex flex-col items-center justify-center flex-shrink-0">
                  <div className="text-sm font-medium text-gray-600">{new Date(appt.date).getDate()}</div>
                  <div className="text-[9px] text-gray-400">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{appt.reason}</div>
                  <div className="text-xs text-gray-500">{(appt.doctorId as any)?.name} • {appt.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Book appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Family member</label>
                <select name="memberId" required value={formData.memberId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                  <option value="">Select member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.relationship})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Doctor</label>
                <select name="doctorId" required value={formData.doctorId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                  <option value="">Select doctor</option>
                  {doctors.map(d => <option key={d._id} value={d._id}>{d.name} ({d.specialization})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Date</label>
                  <input name="date" type="date" required value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Time</label>
                  <input name="time" required value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. 11:00 AM" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Reason</label>
                <input name="reason" required value={formData.reason} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Cardiology checkup" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Fortis Hospital" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">{saving ? 'Booking...' : 'Book appointment'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}