import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '../../pages/service/auth.service';

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
    constructor(private authService: AuthService) {}
    ngOnInit() {
        const user = this.authService.currentUserValue;
        this.model = [
            {
                label: 'Forum',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Discussion Forum', icon: 'pi pi-comments', routerLink: ['/pages/post'] },
                    ...(user != null ? [{ label: 'Own Posts', icon: 'pi pi-user-edit', routerLink: ['/pages/userPosts'] }] : []),
                    // { label: 'News', icon: 'pi pi-globe', routerLink: ['/pages/hackerNews'] },
                    // { label: 'Statistics', icon: 'pi pi-chart-bar', routerLink: ['/pages/userStatistics'] },
                    ...(user == null
                        ? [
                            //   {
                            //       label: 'Login',
                            //       icon: 'pi pi-fw pi-sign-in',
                            //       routerLink: ['/auth/login']
                            //   }
                          ]
                        : [])
                ]
            },
            {
                label: 'PFE Management',
                items: [
                    { label: 'Search PFEs', icon: 'pi pi-fw pi-search', routerLink: ['/pfe'] },
                    { label: 'Add PFE', icon: 'pi pi-fw pi-file-plus', routerLink: ['/pfe/add'] },
                    // { label: 'Internship Offers', icon: 'pi pi-fw pi-briefcase', routerLink: ['/internship-offers'] },
                    { label: 'Proposals', icon: 'pi pi-fw pi-list-check', routerLink: ['/proposals'] },
                    { label: 'Manage Proposals', icon: 'pi pi-fw pi-th-large', routerLink: ['/manage-proposals'] },
                    { label: 'Technical Tests', icon: 'pi pi-fw pi-file-edit', routerLink: ['/technical-tests'] },
                    { label: 'Saved PFEs', icon: 'pi pi-fw pi-bookmark', routerLink: ['/saved-pfes'] },
                    { label: 'Student Interests', icon: 'pi pi-fw pi-heart', routerLink: ['/student-interests'] }
                ]
            },
            {
                label: 'Learning',
                items: [
                    {
                        label: 'My Courses',
                        icon: 'pi pi-book',
                        routerLink: ['/courses']
                    },
                    {
                        label: 'My Notes',
                        icon: 'pi pi-file-edit',
                        routerLink: ['/notes']
                    }
                ]
            },
            {
                label: '',
                items: [
                    {
                        label: 'create course',
                        icon: 'pi pi-book',
                        routerLink: ['/courses/create']
                    },
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
                ]
            }
            // Other commented menu items...
        ];
    }
}
