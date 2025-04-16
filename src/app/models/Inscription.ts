export interface Inscription {
    firstName: string;
    lastName: string;
    personalEmail: string | null;
    phoneNumber: string | null;
    dateOfBirth: Date | null;
    maritalStatus: string | null;
    address: string | null;
    city: string | null;
    zipCode: number | null;
}