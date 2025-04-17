import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Admin',
                icon: 'pi pi-fw pi-cog',
                items: [
                    { 
                        label: 'Dashboard', 
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/admin/dashboard']
                    },
                    {
                        label: 'Manage Users',
                        icon: 'pi pi-fw pi-users',
                        items: [
                            {
                                label: 'All Users',
                                icon: 'pi pi-fw pi-list',
                                routerLink: ['/admin/users']
                            },
                            {
                                label: 'Admins',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/admin/users/admins']
                            },
                            {
                                label: 'Students',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/admin/users/students']
                            },
                            {
                                label: 'Teachers',
                                icon: 'pi pi-fw pi-user',
                                routerLink: ['/admin/users/teachers']
                            }
                        ]
                    },
                    {
                        label: 'Inscriptions',
                        icon: 'pi pi-fw pi-file',
                        routerLink: ['/admin/inscriptions']
                    },
                    {
                        label: 'Reports',
                        icon: 'pi pi-fw pi-chart-bar',
                        routerLink: ['/admin/reports']
                    },
                    {
                        label: 'Settings',
                        icon: 'pi pi-fw pi-cog',
                        routerLink: ['/admin/settings']
                    }
                ]
            }
        ];
    }
}
