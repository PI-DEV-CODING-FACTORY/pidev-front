import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../../layout/component/app.topbar';
import { Post } from '../../interfaces/Post';
import { User } from './auth.service';
import { CommentNotificationRequest } from '../../interfaces/CommentNotificationRequest';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = 'http://localhost:8081/notification';

    constructor(private http: HttpClient) { }

    getUserNotifications(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/user/${userId}`);
    }

    getUnreadNotifications(userId: number): Observable<Notification[]> {
        return this.http.get<Notification[]>(`${this.apiUrl}/user/unread/${userId}`);
    }

    markAsRead(notificationId: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/mark-read/${notificationId}`, {});
    }

    markAllAsRead(userId: number): Observable<void> {
        return this.http.put<void>(`${this.apiUrl}/mark-all-read/${userId}`, {});
    }

    createMentionNotification(user: User, post: Post, mentionedBy: string): Observable<Notification> {
        const request: CommentNotificationRequest = {
            user: user,
            post: post,
            commenterName: mentionedBy
        };
        return this.http.post<Notification>(`${this.apiUrl}/mention`, request);
    }

    createCommentNotification(user: User, post: Post, mentionedBy: string): Observable<any> {
        const request: CommentNotificationRequest = {
            user: user,
            post: post,
            commenterName: mentionedBy
        };
        console.log('Sending request with:', request);
        return this.http.post<Notification>(`${this.apiUrl}/comment`, request);
    }
}