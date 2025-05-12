import { Injectable } from '@angular/core';

export interface User {
    id?: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    status?: string;
    createdAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    getUsers() {
        return Promise.resolve([
            {
                id: '1001',
                username: 'johndoe',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'Student',
                status: 'Active',
                createdAt: '2023-01-15'
            },
            // Add more mock data here
        ]);
    }
}