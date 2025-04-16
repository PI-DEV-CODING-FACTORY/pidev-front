export interface Inscription {
    id?: number;
    firstName: string;
    lastName: string;
    personalEmail: string;
    dateOfBirth: Date;
    maritalStatus: string;
    healthStatus?: string;
    healthDescription?: string;
    lastDiploma: string;
    institution: string;
    academicDescription?: string;
    phoneNumber: string;
    city: string;
    postalCode: string;
    address: string;
    // Add any other fields that match your backend
  }