import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from './app.configurator';
import { LayoutService } from '../service/layout.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService } from '../../pages/service/auth.service';



interface Notification {
    id: number;
    message: string;
    timestamp: Date;
    read: boolean;
    type: 'comment' | 'mention';
    postId?: number;
    userId?: number;
    avatar?: string;
    userName?: string;
}


@Component({
    selector: 'app-topbar',
    standalone: true,
    imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
    template: `
    
     <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M17.1637 19.2467C17.1566 19.4033 17.1529 19.561 17.1529 19.7194C17.1529 25.3503 21.7203 29.915 27.3546 29.915C32.9887 29.915 37.5561 25.3503 37.5561 19.7194C37.5561 19.5572 37.5524 19.3959 37.5449 19.2355C38.5617 19.0801 39.5759 18.9013 40.5867 18.6994L40.6926 18.6782C40.7191 19.0218 40.7326 19.369 40.7326 19.7194C40.7326 27.1036 34.743 33.0896 27.3546 33.0896C19.966 33.0896 13.9765 27.1036 13.9765 19.7194C13.9765 19.374 13.9896 19.0316 14.0154 18.6927L14.0486 18.6994C15.0837 18.9062 16.1223 19.0886 17.1637 19.2467ZM33.3284 11.4538C31.6493 10.2396 29.5855 9.52381 27.3546 9.52381C25.1195 9.52381 23.0524 10.2421 21.3717 11.4603C20.0078 11.3232 18.6475 11.1387 17.2933 10.907C19.7453 8.11308 23.3438 6.34921 27.3546 6.34921C31.36 6.34921 34.9543 8.10844 37.4061 10.896C36.0521 11.1292 34.692 11.3152 33.3284 11.4538ZM43.826 18.0518C43.881 18.6003 43.9091 19.1566 43.9091 19.7194C43.9091 28.8568 36.4973 36.2642 27.3546 36.2642C18.2117 36.2642 10.8 28.8568 10.8 19.7194C10.8 19.1615 10.8276 18.61 10.8816 18.0663L7.75383 17.4411C7.66775 18.1886 7.62354 18.9488 7.62354 19.7194C7.62354 30.6102 16.4574 39.4388 27.3546 39.4388C38.2517 39.4388 47.0855 30.6102 47.0855 19.7194C47.0855 18.9439 47.0407 18.1789 46.9536 17.4267L43.826 18.0518ZM44.2613 9.54743L40.9084 10.2176C37.9134 5.95821 32.9593 3.1746 27.3546 3.1746C21.7442 3.1746 16.7856 5.96385 13.7915 10.2305L10.4399 9.56057C13.892 3.83178 20.1756 0 27.3546 0C34.5281 0 40.8075 3.82591 44.2613 9.54743Z"
                        fill="var(--primary-color)"
                    />
                    <mask id="mask0_1413_1551" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="0" y="8" width="54" height="11">
                        <path d="M27 18.3652C10.5114 19.1944 0 8.88892 0 8.88892C0 8.88892 16.5176 14.5866 27 14.5866C37.4824 14.5866 54 8.88892 54 8.88892C54 8.88892 43.4886 17.5361 27 18.3652Z" fill="var(--primary-color)" />
                    </mask>
                    <g mask="url(#mask0_1413_1551)">
                        <path
                            d="M-4.673e-05 8.88887L3.73084 -1.91434L-8.00806 17.0473L-4.673e-05 8.88887ZM27 18.3652L26.4253 6.95109L27 18.3652ZM54 8.88887L61.2673 17.7127L50.2691 -1.91434L54 8.88887ZM-4.673e-05 8.88887C-8.00806 17.0473 -8.00469 17.0505 -8.00132 17.0538C-8.00018 17.055 -7.99675 17.0583 -7.9944 17.0607C-7.98963 17.0653 -7.98474 17.0701 -7.97966 17.075C-7.96949 17.0849 -7.95863 17.0955 -7.94707 17.1066C-7.92401 17.129 -7.89809 17.1539 -7.86944 17.1812C-7.8122 17.236 -7.74377 17.3005 -7.66436 17.3743C-7.50567 17.5218 -7.30269 17.7063 -7.05645 17.9221C-6.56467 18.3532 -5.89662 18.9125 -5.06089 19.5534C-3.39603 20.83 -1.02575 22.4605 1.98012 24.0457C7.97874 27.2091 16.7723 30.3226 27.5746 29.7793L26.4253 6.95109C20.7391 7.23699 16.0326 5.61231 12.6534 3.83024C10.9703 2.94267 9.68222 2.04866 8.86091 1.41888C8.45356 1.10653 8.17155 0.867278 8.0241 0.738027C7.95072 0.673671 7.91178 0.637576 7.90841 0.634492C7.90682 0.63298 7.91419 0.639805 7.93071 0.65557C7.93897 0.663455 7.94952 0.673589 7.96235 0.686039C7.96883 0.692262 7.97582 0.699075 7.98338 0.706471C7.98719 0.710167 7.99113 0.714014 7.99526 0.718014C7.99729 0.720008 8.00047 0.723119 8.00148 0.724116C8.00466 0.727265 8.00796 0.730446 -4.673e-05 8.88887ZM27.5746 29.7793C37.6904 29.2706 45.9416 26.3684 51.6602 23.6054C54.5296 22.2191 56.8064 20.8465 58.4186 19.7784C59.2265 19.2431 59.873 18.7805 60.3494 18.4257C60.5878 18.2482 60.7841 18.0971 60.9374 17.977C61.014 17.9169 61.0799 17.8645 61.1349 17.8203C61.1624 17.7981 61.1872 17.7781 61.2093 17.7602C61.2203 17.7512 61.2307 17.7427 61.2403 17.7348C61.2452 17.7308 61.2499 17.727 61.2544 17.7233C61.2566 17.7215 61.2598 17.7188 61.261 17.7179C61.2642 17.7153 61.2673 17.7127 54 8.88887C46.7326 0.0650536 46.7357 0.0625219 46.7387 0.0600241C46.7397 0.0592345 46.7427 0.0567658 46.7446 0.0551857C46.7485 0.0520238 46.7521 0.0489887 46.7557 0.0460799C46.7628 0.0402623 46.7694 0.0349487 46.7753 0.0301318C46.7871 0.0204986 46.7966 0.0128495 46.8037 0.00712562C46.818 -0.00431848 46.8228 -0.00808311 46.8184 -0.00463784C46.8096 0.00228345 46.764 0.0378652 46.6828 0.0983779C46.5199 0.219675 46.2165 0.439161 45.7812 0.727519C44.9072 1.30663 43.5257 2.14765 41.7061 3.02677C38.0469 4.79468 32.7981 6.63058 26.4253 6.95109L27.5746 29.7793ZM54 8.88887C50.2691 -1.91433 50.27 -1.91467 50.271 -1.91498C50.2712 -1.91506 50.272 -1.91535 50.2724 -1.9155C50.2733 -1.91581 50.274 -1.91602 50.2743 -1.91616C50.2752 -1.91643 50.275 -1.91636 50.2738 -1.91595C50.2714 -1.91515 50.2652 -1.91302 50.2552 -1.9096C50.2351 -1.90276 50.1999 -1.89078 50.1503 -1.874C50.0509 -1.84043 49.8938 -1.78773 49.6844 -1.71863C49.2652 -1.58031 48.6387 -1.377 47.8481 -1.13035C46.2609 -0.635237 44.0427 0.0249875 41.5325 0.6823C36.215 2.07471 30.6736 3.15796 27 3.15796V26.0151C33.8087 26.0151 41.7672 24.2495 47.3292 22.7931C50.2586 22.026 52.825 21.2618 54.6625 20.6886C55.5842 20.4011 56.33 20.1593 56.8551 19.986C57.1178 19.8993 57.3258 19.8296 57.4735 19.7797C57.5474 19.7548 57.6062 19.7348 57.6493 19.72C57.6709 19.7127 57.6885 19.7066 57.7021 19.7019C57.7089 19.6996 57.7147 19.6976 57.7195 19.696C57.7219 19.6952 57.7241 19.6944 57.726 19.6938C57.7269 19.6934 57.7281 19.693 57.7286 19.6929C57.7298 19.6924 57.7309 19.692 54 8.88887ZM27 3.15796C23.3263 3.15796 17.7849 2.07471 12.4674 0.6823C9.95717 0.0249875 7.73904 -0.635237 6.15184 -1.13035C5.36118 -1.377 4.73467 -1.58031 4.3155 -1.71863C4.10609 -1.78773 3.94899 -1.84043 3.84961 -1.874C3.79994 -1.89078 3.76474 -1.90276 3.74471 -1.9096C3.73469 -1.91302 3.72848 -1.91515 3.72613 -1.91595C3.72496 -1.91636 3.72476 -1.91643 3.72554 -1.91616C3.72593 -1.91602 3.72657 -1.91581 3.72745 -1.9155C3.72789 -1.91535 3.72874 -1.91506 3.72896 -1.91498C3.72987 -1.91467 3.73084 -1.91433 -4.673e-05 8.88887C-3.73093 19.692 -3.72983 19.6924 -3.72868 19.6929C-3.72821 19.693 -3.72698 19.6934 -3.72603 19.6938C-3.72415 19.6944 -3.72201 19.6952 -3.71961 19.696C-3.71482 19.6976 -3.70901 19.6996 -3.7022 19.7019C-3.68858 19.7066 -3.67095 19.7127 -3.6494 19.72C-3.60629 19.7348 -3.54745 19.7548 -3.47359 19.7797C-3.32589 19.8296 -3.11788 19.8993 -2.85516 19.986C-2.33008 20.1593 -1.58425 20.4011 -0.662589 20.6886C1.17485 21.2618 3.74125 22.026 6.67073 22.7931C12.2327 24.2495 20.1913 26.0151 27 26.0151V3.15796Z"
                            fill="var(--primary-color)"
                        />
                    </g>
                </svg>
                <span>Coding Factory</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
        <div class="notifications-container">
      <button 
        class="layout-topbar-action" 
        pStyleClass="@next" 
        enterFromClass="hidden" 
        enterActiveClass="animate-scalein" 
        leaveToClass="hidden" 
        leaveActiveClass="animate-fadeout" 
        [hideOnOutsideClick]="true"
        pTooltip="Notifications"
        tooltipPosition="bottom"
      >
        <i class="pi pi-bell"></i>
        <span *ngIf="unreadCount > 0" class="p-badge p-badge-danger">{{ unreadCount }}</span>
      </button>

      <div class="notifications-panel hidden">
        <div class="notifications-header">
          <h5>Notifications</h5>
          <button *ngIf="hasUnread" class="mark-all-read" (click)="markAllAsRead()">
            Tout marquer comme lu
          </button>
        </div>
        
        <div class="notifications-tabs">
          <button 
            [class.active]="activeTab === 'all'" 
            (click)="setActiveTab('all')"
          >
            Tous
          </button>
          <button 
            [class.active]="activeTab === 'comments'" 
            (click)="setActiveTab('comments')"
          >
            Commentaires
          </button>
          <button 
            [class.active]="activeTab === 'mentions'" 
            (click)="setActiveTab('mentions')"
          >
            Mentions
          </button>
        </div>

        <div class="notifications-list" *ngIf="filteredNotifications.length > 0; else emptyState">
          <div 
            *ngFor="let notification of filteredNotifications" 
            class="notification-item" 
            [class.unread]="!notification.read"
            [@notificationAnimation]
            (click)="readNotification(notification)"
          >
            <div class="notification-avatar" *ngIf="notification.avatar">
              <img [src]="notification.avatar" alt="User avatar">
            </div>
            <div class="notification-content">
              <div class="notification-message" [innerHTML]="notification.message"></div>
              <div class="notification-time">{{ getTimeAgo(notification.timestamp) }}</div>
            </div>
            <div class="notification-icon">
              <i class="pi" [ngClass]="{'pi-comments': notification.type === 'comment', 'pi-at': notification.type === 'mention'}"></i>
            </div>
          </div>
        </div>
        
        <ng-template #emptyState>
          <div class="empty-state">
            <i class="pi pi-bell-slash"></i>
            <p>Aucune notification pour le moment</p>
          </div>
        </ng-template>
        
        <!-- <div class="notifications-footer">
          <a routerLink="/notifications">Voir toutes les notifications</a>
        </div> -->
      </div>
    </div>
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                <div class="relative">
                    <button
                        class="layout-topbar-action layout-topbar-action-highlight"
                        pStyleClass="@next"
                        enterFromClass="hidden"
                        enterActiveClass="animate-scalein"
                        leaveToClass="hidden"
                        leaveActiveClass="animate-fadeout"
                        [hideOnOutsideClick]="true"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <app-configurator />
                </div>
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content">
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="logout()">
                        <i class="pi pi-sign-out"></i>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>
        </div>
    </div>`
    ,
    styles: [`
      .notifications-container {
        position: relative;
      }
      
      .notifications-panel {
        position: absolute;
        right: 0;
        top: 100%;
        width: 350px;
        background: var(--surface-card);
        border-radius: 6px;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        z-index: 1000;
        overflow: hidden;
        margin-top: 0.5rem;
        border: 1px solid var(--surface-border);
      }
      
      .notifications-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        border-bottom: 1px solid var(--surface-border);
      }
      
      .notifications-header h5 {
        margin: 0;
        font-weight: 600;
      }
      
      .mark-all-read {
        background: transparent;
        border: none;
        color: var(--primary-color);
        font-size: 0.875rem;
        cursor: pointer;
        transition: opacity 0.2s;
      }
      
      .mark-all-read:hover {
        opacity: 0.8;
      }
      
      .notifications-tabs {
        display: flex;
        border-bottom: 1px solid var(--surface-border);
      }
      
      .notifications-tabs button {
        flex: 1;
        padding: 0.75rem;
        background: transparent;
        border: none;
        cursor: pointer;
        font-weight: 500;
        color: var(--text-color-secondary);
        transition: all 0.2s;
      }
      
      .notifications-tabs button.active {
        color: var(--primary-color);
        border-bottom: 2px solid var(--primary-color);
      }
      
      .notifications-list {
        max-height: 350px;
        overflow-y: auto;
      }
      
      .notification-item {
        padding: 1rem;
        display: flex;
        align-items: center;
        border-bottom: 1px solid var(--surface-border);
        cursor: pointer;
        transition: background-color 0.2s;
      }
      
      .notification-item:hover {
        background-color: var(--surface-hover);
      }
      
      .notification-item.unread {
        background-color: var(--surface-hover);
      }
      
      .notification-item.unread::before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        width: 4px;
        height: 100%;
        background-color: var(--primary-color);
      }
      
      .notification-avatar {
        margin-right: 1rem;
      }
      
      .notification-avatar img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      
      .notification-content {
        flex: 1;
        min-width: 0;
      }
      
      .notification-message {
        margin-bottom: 0.25rem;
        white-space: normal;
        word-break: break-word;
      }
      
      .notification-message b {
        font-weight: 600;
      }
      
      .notification-time {
        font-size: 0.75rem;
        color: var(--text-color-secondary);
      }
      
      .notification-icon {
        margin-left: 0.5rem;
        color: var(--text-color-secondary);
      }
      
      .empty-state {
        padding: 2rem;
        text-align: center;
        color: var(--text-color-secondary);
      }
      
      .empty-state i {
        font-size: 2rem;
        margin-bottom: 1rem;
      }
      
      .notifications-footer {
        padding: 0.75rem;
        text-align: center;
        border-top: 1px solid var(--surface-border);
      }
      
      .notifications-footer a {
        color: var(--primary-color);
        text-decoration: none;
        font-size: 0.875rem;
      }
      
      .p-badge {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(25%, -25%);
        font-size: 0.75rem;
        min-width: 1.25rem;
        height: 1.25rem;
        line-height: 1.25rem;
      }
    `],
    animations: [
        trigger('notificationAnimation', [
            transition(':enter', [
                style({ transform: 'translateX(100%)', opacity: 0 }),
                animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
            ])
        ])
    ]
})
export class AppTopbar {
    items!: MenuItem[];
    notifications: Notification[] = [];
    filteredNotifications: Notification[] = [];
    unreadCount: number = 0;
    activeTab: 'all' | 'comments' | 'mentions' = 'all';
    private destroy$ = new Subject<void>();
    private refreshSubscription: Subscription | null = null;
    constructor(public layoutService: LayoutService,    private authService: AuthService) { }

    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
    }


    logout(): void {
      this.authService.logout();
      // Redirect to login page or home page after logout
      window.location.href = '/';
    }
    get hasUnread(): boolean {
        return this.notifications.some(notification => !notification.read);
    }

    ngOnInit() {
        // Simuler la récupération des notifications depuis le serveur
        this.loadNotifications();

        // Mettre en place une actualisation périodique
        this.refreshSubscription = interval(30000) // 30 secondes
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.checkForNewNotifications();
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();

        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    loadNotifications() {
        // Simuler des données - à remplacer par votre appel API
        this.notifications = [
            {
                id: 1,
                message: '<b>Ahmed Kaddour</b> a commenté sur votre post "Mise à jour Spring 3.0"',
                timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                read: false,
                type: 'comment',
                postId: 123,
                userId: 456,
                avatar: 'assets/images/avatar1.jpg',
                userName: 'Ahmed Kaddour'
            },
            {
                id: 2,
                message: '<b>Sophia Benali</b> vous a mentionné dans un commentaire: "Je pense que @votreNom a raison concernant..."',
                timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
                read: false,
                type: 'mention',
                postId: 124,
                userId: 457,
                avatar: 'assets/images/avatar2.jpg',
                userName: 'Sophia Benali'
            },
            {
                id: 3,
                message: '<b>Karim Halim</b> a commenté sur votre post "Les meilleures pratiques avec Angular"',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
                read: true,
                type: 'comment',
                postId: 125,
                userId: 458,
                avatar: 'assets/images/avatar3.jpg',
                userName: 'Karim Halim'
            }
        ];

        this.updateFilteredNotifications();
        this.updateUnreadCount();
    }

    checkForNewNotifications() {
        // Simuler la vérification des nouvelles notifications - à remplacer par votre appel API
        const randomChance = Math.random();

        if (randomChance > 0.7) {
            const newNotification: Notification = {
                id: this.notifications.length + 1,
                message: '<b>Nouvel utilisateur</b> a commenté sur votre post récent',
                timestamp: new Date(),
                read: false,
                type: Math.random() > 0.5 ? 'comment' : 'mention',
                postId: 126,
                userId: 459,
                avatar: 'assets/images/avatar4.jpg',
                userName: 'Nouvel utilisateur'
            };

            this.notifications.unshift(newNotification);
            this.updateFilteredNotifications();
            this.updateUnreadCount();

            // Ajouter une notification système
            // Cette partie serait intégrée avec votre service de notifications système
        }
    }

    setActiveTab(tab: 'all' | 'comments' | 'mentions') {
        this.activeTab = tab;
        this.updateFilteredNotifications();
    }

    updateFilteredNotifications() {
        switch (this.activeTab) {
            case 'comments':
                this.filteredNotifications = this.notifications.filter(n => n.type === 'comment');
                break;
            case 'mentions':
                this.filteredNotifications = this.notifications.filter(n => n.type === 'mention');
                break;
            default:
                this.filteredNotifications = [...this.notifications];
        }
    }

    updateUnreadCount() {
        this.unreadCount = this.notifications.filter(n => !n.read).length;
    }

    readNotification(notification: Notification) {
        // Dans un cas réel, vous appelleriez votre API ici
        notification.read = true;
        this.updateUnreadCount();

        // Naviguer vers le post ou autre action
        console.log(`Navigating to post ${notification.postId}`);
        // this.router.navigate(['/posts', notification.postId]);
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateUnreadCount();

        // Dans un cas réel, vous appelleriez votre API ici
    }

    getTimeAgo(date: Date): string {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diff < 60) {
            return 'À l\'instant';
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
        } else {
            const days = Math.floor(diff / 86400);
            return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
        }
    }

}
