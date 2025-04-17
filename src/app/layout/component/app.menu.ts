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
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Discussion Forum', icon: 'pi pi-comments', routerLink: ['/pages/post'] },
                    ...(user != null ? [{ label: 'Own Posts', icon: 'pi pi-user-edit', routerLink: ['/pages/userPosts'] }] : []),
                    // { label: 'News', icon: 'pi pi-globe', routerLink: ['/pages/hackerNews'] },
                    // { label: 'Statistics', icon: 'pi pi-chart-bar', routerLink: ['/pages/userStatistics'] },
                    ...(user == null
                        ? [
                              {
                                  label: 'Login',
                                  icon: 'pi pi-fw pi-sign-in',
                                  routerLink: ['/auth/login']
                              }
                          ]
                        : [])
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
                    }
                ]
            }
            // Other commented menu items...
        ];
    }
}
