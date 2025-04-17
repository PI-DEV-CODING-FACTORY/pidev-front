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
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }]
            },
            {
                label: 'Pfe',
                items: [
                    { label: 'Add a Pfe', icon: 'pi pi-fw pi-file-plus', routerLink: ['/pfe/add'] },
                    { label: 'Internships', icon: 'pi pi-fw pi-briefcase', routerLink: ['/pfe/Internships'] },
                    { label: 'Proposals', icon: 'pi pi-fw pi-list-check', routerLink: ['/pfe/Proposals'] }
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
