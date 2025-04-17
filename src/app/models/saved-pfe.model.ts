import { Pfe } from './pfe.model';

export interface SavedPfe {
    id: number;
    pfe: Pfe;
    companyId: string;
    savedAt: string;
} 