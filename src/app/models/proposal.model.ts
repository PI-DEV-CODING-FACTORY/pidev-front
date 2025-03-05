export interface Proposal {
    id: number;
    companyId: string;
    studentId: string;
    message: string;
    status: ProposalStatus;
    createdAt: string;
    respondedAt: string | null;
    technicalTest: any | null;
}

export enum ProposalStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    DECLINED = 'DECLINED'
}

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP'
} 