export interface Pfe {
    id?: number;
    title: string;
    description: string;
    technologies: string[];
    startDate: Date;
    endDate: Date;
    supervisor: string;
    company: string;
    status: PfeStatus;
    studentId?: number;
    reportUrl?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum PfeStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED'
} 