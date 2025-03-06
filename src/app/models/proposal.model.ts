export interface Proposal {
    id?: number;
    title: string;
    description: string;
    company: string;
    companyLogo?: string;
    location: string;
    jobType: JobType;
    technologies: string[];
    requirements: string;
    salary?: number;
    contactEmail: string;
    applicationDeadline: Date;
    isRemote: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP'
} 