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
    DECLINED = 'DECLINED',
    PASSED = 'PASSED',
    FAILED = 'FAILED',
    MEETING_SCHEDULED = 'MEETING_SCHEDULED',
    STUDENT_ACCEPTED = 'STUDENT_ACCEPTED',
    STUDENT_REJECTED = 'STUDENT_REJECTED'
}

export enum JobType {
    FULL_TIME = 'FULL_TIME',
    PART_TIME = 'PART_TIME',
    CONTRACT = 'CONTRACT',
    INTERNSHIP = 'INTERNSHIP'
} 