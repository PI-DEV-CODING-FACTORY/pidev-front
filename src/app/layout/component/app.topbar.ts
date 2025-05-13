import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../service/layout.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { interval, Subject, Subscription, takeUntil } from 'rxjs';
import { AuthService, User } from '../../pages/service/auth.service';
import { NotificationService } from '../../pages/service/notification.service';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

export interface Notification {
  id: number;
  message: string;
  createdAt: Date;
  isRead: boolean;
  type: 'COMMENT' | 'MENTION';
  post?: {
    id: number;
    title: string;
    content: string;
  };
  user?: {
    id: number;
    name: string;
  };
}

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, DialogModule, InputTextModule, ButtonModule, FormsModule, ToastModule],
  providers: [MessageService],
  template: `
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" (click)="layoutService.onMenuToggle()">
                <i class="pi pi-bars"></i>
            </button>
            <a class="layout-topbar-logo" routerLink="/admin/dashboard">
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- SVG content remains the same -->
                </svg>
                <span>Coding Factory</span>
            </a>
        </div>

        <div class="layout-topbar-actions">
            <div class="notifications-container">
            <div class="notification-button-wrapper">
                <button 
                class="layout-topbar-action" 
      pStyleClass="#notificationPanel"
      enterFromClass="hidden" 
      enterActiveClass="animate-scalein" 
      leaveToClass="hidden" 
      leaveActiveClass="animate-fadeout" 
      [hideOnOutsideClick]="true"
      pTooltip="Notifications"
      tooltipPosition="bottom"
                >
                    <i class="pi pi-bell"></i>
                    
                </button>
                <div class="notification-badge" [class.visible]="unreadCount > 0">{{ unreadCount }}</div>
               </div>
                <div id="notificationPanel" class="hidden notifications-panel">
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
                            [class.unread]="!notification.isRead"
                            [@notificationAnimation]
                            (click)="readNotification(notification)"
                        >
                            <div class="notification-content">
                                <div class="notification-message" [innerHTML]="notification.message"></div>
                            </div>
                            <div class="notification-icon">
                                <i class="pi" [ngClass]="{'pi-comments': notification.type === 'COMMENT', 'pi-at': notification.type === 'MENTION'}"></i>
                            </div>
                        </div>
                    </div>
                    
                    <ng-template #emptyState>
                        <div class="empty-state">
                            <i class="pi pi-bell-slash"></i>
                            <p>Aucune notification pour le moment</p>
                        </div>
                    </ng-template>
                </div>
            </div>
              <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" (click)="toggleDarkMode()">
                    <i [ngClass]="{ 'pi ': true, 'pi-moon': layoutService.isDarkTheme(), 'pi-sun': !layoutService.isDarkTheme() }"></i>
                </button>
                
                <button type="button" class="layout-topbar-action" (click)="showReportDialog()" pTooltip="Submit Report" tooltipPosition="bottom">
                    <i class="pi pi-flag"></i>
                </button>
                
                <!-- <div class="relative">
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
                </div> -->
            </div>

            <button class="layout-topbar-menu-button layout-topbar-action" pStyleClass="@next" enterFromClass="hidden" enterActiveClass="animate-scalein" leaveToClass="hidden" leaveActiveClass="animate-fadeout" [hideOnOutsideClick]="true">
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="hidden layout-topbar-menu lg:block">
                <div class="layout-topbar-menu-content">
                    <!-- <button type="button" class="layout-topbar-action">
                        <i class="pi pi-calendar"></i>
                        <span>Calendar</span>
                    </button> -->
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-inbox"></i>
                        <span>Messages</span>
                    </button>
                    <button type="button" class="layout-topbar-action">
                        <i class="pi pi-user"></i>
                        <span>Profile</span>
                    </button>
                    <button type="button" class="layout-topbar-action" (click)="logout()" *ngIf="user">
                        <i class="pi pi-sign-out"></i>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>        </div>
    </div>
    
    <!-- Report Dialog -->
    <p-dialog 
        [(visible)]="reportDialogVisible" 
        [modal]="true" 
        [resizable]="false"
        [draggable]="false"
        [style]="{width: '450px'}" 
        header="Submit a Report" 
        styleClass="report-dialog"
        [closeOnEscape]="true"
        [showHeader]="true"
        [dismissableMask]="true"
    >
        <div class="report-form">
            <div class="form-field">
                <label for="reportTitle">Title</label>
                <input 
                    type="text" 
                    pInputText 
                    id="reportTitle" 
                    [(ngModel)]="reportTitle" 
                    placeholder="Enter report title" 
                    class="w-full"
                />
            </div>            <div class="form-field">
                <label for="reportContent">Description</label>                <textarea 
                    pInputTextarea
                    id="reportContent" 
                    [(ngModel)]="reportContent" 
                    placeholder="Describe your issue or suggestion in detail..." 
                    class="w-full report-content-input"
                    rows="5"
                    autoResize="false"
                ></textarea>
            </div>
        </div>
        
        <ng-template pTemplate="footer">
            <p-button 
                label="Cancel" 
                icon="pi pi-times" 
                styleClass="p-button-text" 
                (click)="reportDialogVisible = false"
            ></p-button>
            <p-button 
                label="Submit Report" 
                icon="pi pi-send" 
                [disabled]="!reportTitle || !reportContent"
                (click)="submitReport()"
                [loading]="submittingReport"
            ></p-button>
        </ng-template>
    </p-dialog>
    
    <p-toast position="top-right"></p-toast>
  `,
  styles: [`
      .notifications-container {
        position: relative;
      }
      .notification-button-wrapper {
  position: relative;
  display: inline-block;
}
      .notification-button {
        position: relative;
      }
      
      .notification-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: var(--primary-color);
  color: white;
  border-radius: 50%;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 0 5px;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s, visibility 0.2s;
}

.notification-badge.visible {
  opacity: 1;
  visibility: visible;
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
        position: relative;
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
      }      /* Report Dialog Styles */
      .report-form {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 0.5rem 0;
      }

      .form-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .form-field label {
        font-weight: 500;
        color: var(--text-color);
        font-size: 0.9rem;
      }

      :host ::ng-deep .report-dialog {
        .p-dialog-header {
          padding: 1.5rem 1.5rem 0.75rem;
          border-bottom: 1px solid var(--surface-border);
        }
        
        .p-dialog-content {
          padding: 1.5rem;
        }
        
        .p-dialog-footer {
          padding: 1rem 1.5rem 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          border-top: 1px solid var(--surface-border);
        }        .p-inputtext {
          padding: 0.75rem;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        
        .p-inputtext:focus {
          box-shadow: 0 0 0 1px var(--primary-color);
          border-color: var(--primary-color);
        }          .report-content-input {
          height: 120px;
          vertical-align: top;
          text-align: left;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          overflow-y: auto;
          word-break: break-word;
          white-space: normal;
          resize: none;
          vertical-align: text-top;
          text-align: start;
        }
        
        .report-content-input:focus {
          caret-color: var(--primary-color);
        }
        
        /* Style for placeholder positioning */
        .report-content-input::placeholder {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          line-height: 1.2;
          color: var(--text-secondary-color, #6c757d);
          opacity: 0.7;
        }
        
        .p-button {
          transition: background-color 0.2s, transform 0.1s;
        }
        
        .p-button:active:not(:disabled) {
          transform: translateY(1px);
        }
        
        .p-button-text {
          color: var(--text-color-secondary);
        }
        
        .p-button-text:hover {
          background: var(--surface-hover);
          color: var(--text-color);
        }
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
export class AppTopbar implements OnInit, OnDestroy {
  items!: MenuItem[];
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount: number = 0;
  activeTab: 'all' | 'comments' | 'mentions' = 'all';
  user: User | null = null;

  // Report dialog properties
  reportDialogVisible: boolean = false;
  reportTitle: string = '';
  reportContent: string = '';
  submittingReport: boolean = false;

  private destroy$ = new Subject<void>();
  private refreshSubscription: Subscription | null = null;
  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // Subscribe to user changes
    this.authService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((currentUser: User | null) => {
        this.user = currentUser;
        if (currentUser) {
          console.log("Current user: ", currentUser);
          // Load notifications when user is available
          this.loadNotifications();

          // Set up periodic refresh
          this.setupNotificationRefresh();
        } else {
          console.log('User is not logged in');
          this.clearNotifications();
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  toggleDarkMode() {
    this.layoutService.layoutConfig.update((state) => ({ ...state, darkTheme: !state.darkTheme }));
  }

  logout(): void {
    this.authService.logout();
    // Redirect to login page or home page after logout
    window.location.href = '/';
  }

  get hasUnread(): boolean {
    return this.notifications.some(notification => !notification.isRead);
  }

  loadNotifications() {
    if (!this.user) return;

    this.notificationService.getUserNotifications(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          console.log("Fetched notifications: ", notifications);
          this.notifications = notifications;
          this.updateFilteredNotifications();
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error("Error fetching notifications:", error);
        }
      });
  }

  setupNotificationRefresh() {
    // Clear any existing subscription
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }

    // Set up new subscription for periodic checks
    this.refreshSubscription = interval(30000) // 30 seconds
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.checkForNewNotifications();
      });
  }

  checkForNewNotifications() {
    if (!this.user) return;

    this.notificationService.getUnreadNotifications(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notifications) => {
          if (notifications.length > 0) {
            // Add new notifications at the beginning of the array
            this.notifications = [...notifications, ...this.notifications];
            this.updateFilteredNotifications();
            this.updateUnreadCount();
          }
        },
        error: (error) => {
          console.error("Error checking for new notifications:", error);
        }
      });
  }

  setActiveTab(tab: 'all' | 'comments' | 'mentions') {
    this.activeTab = tab;
    this.updateFilteredNotifications();
  }

  updateFilteredNotifications() {
    switch (this.activeTab) {
      case 'comments':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'COMMENT');
        break;
      case 'mentions':
        this.filteredNotifications = this.notifications.filter(n => n.type === 'MENTION');
        break;
      default:
        this.filteredNotifications = [...this.notifications];
    }
  }

  updateUnreadCount() {
    this.unreadCount = this.notifications.filter(n => !n.isRead).length;
    console.log(`Updated unread count: ${this.unreadCount}`);
  }

  readNotification(notification: Notification) {
    if (!notification.isRead) {
      this.notificationService.markAsRead(notification.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            notification.isRead = true;
            this.updateUnreadCount();

            // Navigate to the post if applicable
            if (notification.post?.id) {
              console.log(`Navigating to post ${notification.post.id}`);
              this.router.navigate(['/pages/postDetails', notification.post.id]);
            }
          },
          error: (error) => {
            console.error("Error marking notification as read:", error);
          }
        });
    } else {
      // If already read, just navigate
      if (notification.post?.id) {
        this.router.navigate(['/pages/postDetails', notification.post.id]);
      }
    }
  }

  markAllAsRead() {
    if (!this.user) return;

    this.notificationService.markAllAsRead(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update local notifications to be marked as read
          this.notifications.forEach(notification => {
            notification.isRead = true;
          });
          this.updateFilteredNotifications();
          this.updateUnreadCount();
        },
        error: (error) => {
          console.error("Error marking all notifications as read:", error);
        }
      });
  }

  clearNotifications() {
    this.notifications = [];
    this.filteredNotifications = [];
    this.unreadCount = 0;
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);

    if (diff < 60) {
      return 'À l\'instant';
    } else if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diff / 86400);      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  }

  /**
   * Show the report dialog
   */
  showReportDialog(): void {
    this.reportDialogVisible = true;
    this.reportTitle = '';
    this.reportContent = '';
    this.submittingReport = false;
  }

  /**
   * Submit a new report
   */
  submitReport(): void {
    if (!this.reportTitle || !this.reportContent) {
      return;
    }

    this.submittingReport = true;

    // Simulate API call with setTimeout
    setTimeout(() => {
      // In a real application, you would call a service method here
      // this.reportService.submitReport({
      //   title: this.reportTitle,
      //   content: this.reportContent,
      //   userId: this.user?.id
      // }).subscribe(...)

      this.messageService.add({
        severity: 'success',
        summary: 'Report Submitted',
        detail: 'Your report has been submitted successfully. We will review it shortly.',
        life: 5000
      });

      this.reportDialogVisible = false;
      this.submittingReport = false;
      this.reportTitle = '';
      this.reportContent = '';
    }, 1500);
  }
}