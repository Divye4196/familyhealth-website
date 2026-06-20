export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface FamilyMember {
  _id: string;
  name: string;
  relationship: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  primaryDoctor?: string;
  avatar?: string;
}

export interface HealthRecord {
  _id: string;
  memberId: string;
  type: 'bp' | 'sugar' | 'weight' | 'heart_rate' | 'spo2' | 'temperature';
  values: {
    systolic?: number;
    diastolic?: number;
    sugarValue?: number;
    sugarType?: string;
    weight?: number;
    height?: number;
    bmi?: number;
    heartRate?: number;
    spo2?: number;
    temperature?: number;
  };
  alert: {
    status: string;
    message: string;
    color: string;
  };
  suddenChange?: string;
  notes?: string;
  recordedAt: string;
}

export interface Medicine {
  _id: string;
  memberId: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: string[];
  startDate: string;
  endDate?: string;
  isLongTerm: boolean;
  prescribedBy?: string;
  isActive: boolean;
  refillDate?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  phone: string;
  hospital: string;
  address?: string;
  availableDays?: string;
  availableTime?: string;
  assignedMembers: string[];
  notes?: string;
}

export interface Appointment {
  _id: string;
  memberId: any;
  doctorId: any;
  date: string;
  time: string;
  reason: string;
  location?: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  doctorNotes?: string;
  prescription?: string;
}

export interface Report {
  _id: string;
  memberId: string;
  title: string;
  type: string;
  fileUrl: string;
  fileType: string;
  reportDate: string;
}

export interface Vaccination {
  _id: string;
  memberId: string;
  vaccineName: string;
  dateTaken: string;
  nextDueDate?: string;
  hospital?: string;
  status: string;
}