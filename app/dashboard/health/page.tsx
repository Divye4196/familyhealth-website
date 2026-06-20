'use client';

import { useEffect, useState } from 'react';
import { familyAPI, healthAPI } from '@/lib/api';
import { FamilyMember, HealthRecord } from '@/lib/types';
import toast from 'react-hot-toast';

export default function HealthPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<string>('');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [latestVitals, setLatestVitals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    type: 'bp',
    systolic: '',
    diastolic: '',
    sugarValue: '',
    sugarType: 'fasting',
    weight: '',
    height: '',
    heartRate: '',
    spo2: '',
    temperature: '',
    notes: ''
  });

  const fetchMembers = async () => {
    try {
      const res = await familyAPI.getAll();
      setMembers(res.data.members);
      if (res.data.members.length > 0) {
        setSelectedMember(res.data.members[0]._id);
      }
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthData = async (memberId: string) => {
    if (!memberId) return;
    try {
      const [recordsRes, vitalsRes] = await Promise.all([
        healthAPI.getByMember(memberId, 'bp'),
        healthAPI.getLatest(memberId)
      ]);
      setRecords(recordsRes.data.records);
      setLatestVitals(vitalsRes.data.vitals);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (selectedMember) fetchHealthData(selectedMember);
  }, [selectedMember]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) {
      toast.error('Please select a family member first');
      return;
    }
    setSaving(true);
    try {
      const values: any = {};
      if (formData.type === 'bp') {
        values.systolic = Number(formData.systolic);
        values.diastolic = Number(formData.diastolic);
      } else if (formData.type === 'sugar') {
        values.sugarValue = Number(formData.sugarValue);
        values.sugarType = formData.sugarType;
      } else if (formData.type === 'weight') {
        values.weight = Number(formData.weight);
        values.height = Number(formData.height);
      } else if (formData.type === 'heart_rate') {
        values.heartRate = Number(formData.heartRate);
      } else if (formData.type === 'spo2') {
        values.spo2 = Number(formData.spo2);
      } else if (formData.type === 'temperature') {
        values.temperature = Number(formData.temperature);
        values.temperatureUnit = 'F';
      }

      const res = await healthAPI.add({
        memberId: selectedMember,
        type: formData.type,
        values,
        notes: formData.notes
      });

      toast.success(`Reading saved — ${res.data.alert.status}`);
      if (res.data.suddenChange) {
        toast.error(res.data.suddenChange, { duration: 6000 });
      }
      fetchHealthData(selectedMember);
      setFormData({ ...formData, systolic: '', diastolic: '', sugarValue: '', weight: '', height: '', heartRate: '', spo2: '', temperature: '', notes: '' });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save reading');
    } finally {
      setSaving(false);
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'bg-[#E1F5EE] text-[#085041]';
      case 'Monitor': return 'bg-[#FAEEDA] text-[#633806]';
      case 'Consult Doctor': return 'bg-[#FCEBEB] text-[#791F1F]';
      case 'Urgent': return 'bg-red-600 text-white';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-medium text-gray-900">Health tracking</h1>
        <p className="text-xs text-gray-500">Monitor vitals for all family members</p>
      </div>

      {/* Member tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {members.map((m) => (
          <button
            key={m._id}
            onClick={() => setSelectedMember(m._id)}
            className={`px-3 py-1.5 rounded-full text-xs border transition ${
              selectedMember === m._id
                ? 'bg-[#0C447C] text-white border-[#0C447C]'
                : 'bg-white text-gray-600 border-gray-300'
            }`}
          >
            {m.name} ({m.relationship})
          </button>
        ))}
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">Add a family member first to track health records</p>
      ) : (
        <>
          {/* Latest vitals */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            {['bp', 'sugar', 'weight', 'heart_rate', 'spo2', 'temperature'].map((type) => {
              const record = latestVitals[type];
              const labels: any = { bp: 'Blood pressure', sugar: 'Blood sugar', weight: 'Weight & BMI', heart_rate: 'Heart rate', spo2: 'SpO2', temperature: 'Temperature' };
              return (
                <div key={type} className="bg-white rounded-lg p-3 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-500">{labels[type]}</div>
                    {record && <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(record.alert.status)}`}>{record.alert.status}</span>}
                  </div>
                  {record ? (
                    <div>
                      <div className="text-lg font-medium text-gray-900">
                        {type === 'bp' && `${record.values.systolic}/${record.values.diastolic}`}
                        {type === 'sugar' && record.values.sugarValue}
                        {type === 'weight' && record.values.weight}
                        {type === 'heart_rate' && record.values.heartRate}
                        {type === 'spo2' && record.values.spo2}
                        {type === 'temperature' && record.values.temperature}
                      </div>
                      <div className="text-[10px] text-gray-400">{record.alert.message}</div>
                    </div>
                  ) : (
                    <div className="text-xs text-gray-300">No data yet</div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {/* History */}
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h2 className="text-sm font-medium text-gray-900 mb-3">BP reading history</h2>
              {records.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No BP readings yet</p>
              ) : (
                records.slice(0, 8).map((r) => (
                  <div key={r._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500">{new Date(r.recordedAt).toLocaleString('en-US', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
                    <span className="text-xs font-medium text-gray-900">{r.values.systolic}/{r.values.diastolic} mmHg</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColor(r.alert.status)}`}>{r.alert.status}</span>
                  </div>
                ))
              )}
            </div>

            {/* Log new reading */}
            <div className="bg-white rounded-lg p-4 border border-gray-100">
              <h2 className="text-sm font-medium text-gray-900 mb-3">Log new reading</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Type</label>
                  <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                    <option value="bp">Blood pressure</option>
                    <option value="sugar">Blood sugar</option>
                    <option value="weight">Weight & BMI</option>
                    <option value="heart_rate">Heart rate</option>
                    <option value="spo2">SpO2</option>
                    <option value="temperature">Temperature</option>
                  </select>
                </div>

                {formData.type === 'bp' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Systolic</label>
                      <input name="systolic" type="number" required value={formData.systolic} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="120" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Diastolic</label>
                      <input name="diastolic" type="number" required value={formData.diastolic} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="80" />
                    </div>
                  </div>
                )}

                {formData.type === 'sugar' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Value (mg/dL)</label>
                      <input name="sugarValue" type="number" required value={formData.sugarValue} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="95" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Type</label>
                      <select name="sugarType" value={formData.sugarType} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900">
                        <option value="fasting">Fasting</option>
                        <option value="post_meal">Post-meal</option>
                      </select>
                    </div>
                  </div>
                )}

                {formData.type === 'weight' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                      <input name="weight" type="number" required value={formData.weight} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="70" />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Height (cm)</label>
                      <input name="height" type="number" required value={formData.height} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="170" />
                    </div>
                  </div>
                )}

                {formData.type === 'heart_rate' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Heart rate (bpm)</label>
                    <input name="heartRate" type="number" required value={formData.heartRate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="75" />
                  </div>
                )}

                {formData.type === 'spo2' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">SpO2 (%)</label>
                    <input name="spo2" type="number" required value={formData.spo2} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="98" />
                  </div>
                )}

                {formData.type === 'temperature' && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Temperature (°F)</label>
                    <input name="temperature" type="number" required value={formData.temperature} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="98.6" />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-gray-600 mb-1">Notes (optional)</label>
                  <input name="notes" value={formData.notes} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900" placeholder="After morning walk" />
                </div>

                <button type="submit" disabled={saving} className="w-full bg-[#0C447C] text-white py-2 rounded-md text-sm disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save reading'}
                </button>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}