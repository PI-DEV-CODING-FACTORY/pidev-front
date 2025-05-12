export interface InscriptionRequest {
    firstName: string;
    lastName: string;
    personalEmail: string;
    phoneNumber: string;
    dateOfBirth: Date;
    maritalStatus: string;
    healthStatus: string;
    address: string;
    city: string;
    zipCode: number;
    courseId: string;
    diplomaDocument: File;
  }