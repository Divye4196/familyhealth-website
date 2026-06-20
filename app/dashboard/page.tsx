'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { familyAPI, appointmentAPI, medicineAPI } from '@/lib/api';
import { FamilyMember, Appointment, Medicine } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [membersRes, apptRes, medRes] = await Promise.all([
          familyAPI.getAll(),
          appointmentAPI.getUpcoming(),
          medicineAPI.getToday()
        ]);
        setMembers(membersRes.data.members);
        setAppointments(apptRes.data.appointments);
        setMedicines(medRes.data.medicines);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-medium text-gray-900">Good day, {user?.name?.split(' ')[0]}</h1>
        <p className="text-xs text-gray-500">{today} — {members.length} family members tracked</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Family members</div>
          <div className="text-xl font-medium text-gray-900">{members.length}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Appointments</div>
          <div className="text-xl font-medium text-gray-900">{appointments.length}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Medicines</div>
          <div className="text-xl font-medium text-gray-900">{medicines.length}</div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-gray-100">
          <div className="text-xs text-gray-500 mb-1">Alerts</div>
          <div className="text-xl font-medium text-red-600">0</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">Family members</h2>
            <Link href="/dashboard/family" className="text-xs text-[#185FA5]">View all</Link>
          </div>
          {members.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No family members added yet</p>
          ) : (
            members.slice(0, 4).map((member) => (
              <div key={member._id} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className="w-8 h-8 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#0C447C]">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0,2)}
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{member.name}</div>
                  <div className="text-xs text-gray-500">{member.relationship} • {member.age} yrs</div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-gray-900">Upcoming appointments</h2>
            <Link href="/dashboard/appointments" className="text-xs text-[#185FA5]">View all</Link>
          </div>
          {appointments.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">No upcoming appointments</p>
          ) : (
            appointments.slice(0, 3).map((appt) => (
              <div key={appt._id} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className="w-9 h-9 bg-[#E6F1FB] rounded-md flex flex-col items-center justify-center flex-shrink-0">
                  <div className="text-sm font-medium text-[#0C447C]">{new Date(appt.date).getDate()}</div>
                  <div className="text-[9px] text-[#185FA5]">{new Date(appt.date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs font-medium text-gray-900">{appt.reason}</div>
                  <div className="text-xs text-gray-500">{(appt.doctorId as any)?.name} • {appt.time}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-900">Today's medicines</h2>
          <Link href="/dashboard/medicines" className="text-xs text-[#185FA5]">View all</Link>
        </div>
        {medicines.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">No medicines scheduled</p>
        ) : (
          medicines.slice(0, 5).map((med) => (
            <div key={med._id} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="w-8 h-8 bg-[#EEEDFE] rounded-md flex items-center justify-center flex-shrink-0">💊</div>
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900">{med.name}</div>
                <div className="text-xs text-gray-500">{med.dosage} • {(med.memberId as any)?.name}</div>
              </div>
              <div className="text-xs text-[#534AB7] font-medium">{med.timing?.[0]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}