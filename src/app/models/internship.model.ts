export interface InternshipOffer {
    id?: number;
    title: string;
    description: string;
    company: string;
    location: string;
    duration: number; // in months
    technologies: string[];
    requirements: string;
    salary?: number;
    contactEmail: string;
    applicationDeadline: Date;
    startDate: Date;
    isRemote: boolean;
    createdAt?: Date;
    updatedAt?: Date;
} 