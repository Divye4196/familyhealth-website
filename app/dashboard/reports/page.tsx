'use client';

import { useEffect, useState } from 'react';
import { reportAPI, familyAPI } from '@/lib/api';
import { Report, FamilyMember } from '@/lib/types';
import toast from 'react-hot-toast';

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    memberId: '', title: '', type: 'blood_test', reportDate: '', notes: ''
  });

  const fetchData = async () => {
    try {
      const [repRes, memRes] = await Promise.all([reportAPI.getAll(), familyAPI.getAll()]);
      setReports(repRes.data.reports);
      setMembers(memRes.data.members);
    } catch (error) {
      toast.error('Failed to load reports');
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
    if (!file) {
      toast.error('Please select a file');
      return;
    }
    setSaving(true);
    try {
      const data = new FormData();
      data.append('memberId', formData.memberId);
      data.append('title', formData.title);
      data.append('type', formData.type);
      data.append('reportDate', formData.reportDate);
      data.append('notes', formData.notes);
      data.append('file', file);

      await reportAPI.upload(data);
      toast.success('Report uploaded!');
      setShowModal(false);
      setFormData({ memberId: '', title: '', type: 'blood_test', reportDate: '', notes: '' });
      setFile(null);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to upload report');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this report?')) return;
    try {
      await reportAPI.delete(id);
      toast.success('Report deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const typeLabels: any = { blood_test: 'Blood test', xray: 'X-ray', mri: 'MRI', ecg: 'ECG', prescription: 'Prescription', other: 'Other' };

  if (loading) return <div className="text-center py-20 text-gray-400">Loading reports...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Reports vault</h1>
          <p className="text-xs text-gray-500">{reports.length} reports stored</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-[#0F6E56] text-white px-4 py-2 rounded-md text-sm hover:bg-[#0c5a47] transition">
          + Upload report
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {reports.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-10 col-span-3">No reports uploaded yet</p>
        ) : (
          reports.map((report) => (
            <div key={report._id} className="bg-white rounded-lg p-3 border border-gray-100">
              <div className="h-20 bg-gray-50 rounded-md flex items-center justify-center mb-2 text-2xl">
                {report.fileType?.includes('image') ? '🖼️' : '📄'}
              </div>
              <div className="text-xs font-medium text-gray-900 truncate mb-1">{report.title}</div>
              <div className="text-xs text-gray-400 mb-2">{new Date(report.reportDate).toLocaleDateString()}</div>
              <div className="flex gap-1 mb-2">
                <span className="text-[10px] bg-[#E6F1FB] text-[#0C447C] px-2 py-0.5 rounded-full">{typeLabels[report.type]}</span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{(report.memberId as any)?.name || ''}</span>
              </div>
              <div className="flex gap-2">
                <a href={report.fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 text-center text-xs border border-gray-300 rounded-md py-1.5 text-gray-700 hover:bg-gray-50">View</a>
                <button onClick={() => handleDelete(report._id)} className="flex-1 text-xs border border-red-200 text-red-600 rounded-md py-1.5 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload report</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Family member</label>
                <select name="memberId" required value={formData.memberId} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                  <option value="">Select member</option>
                  {members.map(m => <option key={m._id} value={m._id}>{m.name} ({m.relationship})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Title</label>
                <input name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Blood Test Report" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                    <option value="blood_test">Blood test</option>
                    <option value="xray">X-ray</option>
                    <option value="mri">MRI</option>
                    <option value="ecg">ECG</option>
                    <option value="prescription">Prescription</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Report date</label>
                  <input name="reportDate" type="date" required value={formData.reportDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">File (PDF, PNG, JPG)</label>
                <input type="file" required accept=".pdf,.png,.jpg,.jpeg" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-gray-900" />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Notes</label>
                <input name="notes" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="e.g. Fasting blood test" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-md text-sm">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">{saving ? 'Uploading...' : 'Upload report'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}