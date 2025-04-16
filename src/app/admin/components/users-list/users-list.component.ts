import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User, UserService } from '../../services/user.service';

@Component({
    selector: 'app-users-list',
    standalone: true,
    templateUrl: './users-list.component.html',
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        InputTextModule,
        DialogModule,
        DropdownModule,
        TagModule,
        ConfirmDialogModule
    ],
    providers: [MessageService, UserService, ConfirmationService]
})
export class UsersListComponent implements OnInit {
    userDialog: boolean = false;
    users = signal<User[]>([]);
    user: User = {};
    selectedUsers: User[] = [];
    submitted: boolean = false;
    statuses: any[] = ['Active', 'Inactive', 'Pending'];
    roles: any[] = ['Admin', 'Student', 'Teacher'];

    @ViewChild('dt') dt: Table | undefined;

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.loadUsers();
    }

    loadUsers() {
        this.userService.getUsers().then(data => this.users.set(data));
    }

    openNew() {
        this.user = {};
        this.submitted = false;
        this.userDialog = true;
    }

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter(val => !this.selectedUsers.includes(val)));
                this.selectedUsers = [];
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
            }
        });
    }

    editUser(user: User) {
        this.user = { ...user };
        this.userDialog = true;
    }

    deleteUser(user: User) {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete ' + user.firstName + ' ' + user.lastName + '?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter(val => val.id !== user.id));
                this.user = {};
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

    saveUser() {
        this.submitted = true;

        if (this.user.firstName?.trim() && this.user.lastName?.trim()) {
            if (this.user.id) {
                this.users.set(this.users().map(val => (val.id === this.user.id ? this.user : val)));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
            } else {
                this.user.id = this.createId();
                this.user.createdAt = new Date().toISOString().split('T')[0];
                this.users.set([...this.users(), this.user]);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
            }

            this.userDialog = false;
            this.user = {};
        }
    }

    getSeverity(status: string) {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'danger';
            case 'pending':
                return 'warn';  // Changed from 'warning' to 'warn'
            default:
                return 'info';
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    createId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}
