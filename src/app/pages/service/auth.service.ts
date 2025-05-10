import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';



export interface User {
  id: string;
  // username: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  profileImage?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8083/users';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  // Set to false to use real API instead of mock data

  constructor(private http: HttpClient) {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  ngOnInit() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  // login(email: string, password: string): Observable<User> {
  //   return this.http.post<any>(`${this.apiUrl}/login`, { email, password })
  //     .pipe(map(response => {
  //       if (response && response.id) {
  //         const user: User = {
  //           id: response.id,
  //           username: response.username,
  //           email: response.email,
  //           profileImage: response.profileImage
  //         };
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //         return user;
  //       }
  //       throw new Error('Invalid login response');
  //     }));
  // }

  // register(username: string, email: string, password: string): Observable<User> {
  //   return this.http.post<any>(`${this.apiUrl}/register`, { username, email, password }).pipe(
  //     map(response => {
  //       if (response && response.id) {
  //         const user: User = {
  //           id: response.id,
  //           username: response.username,
  //           email: response.email,
  //           profileImage: response.profileImage
  //         };
  //         localStorage.setItem('currentUser', JSON.stringify(user));
  //         this.currentUserSubject.next(user);
  //         return user;
  //       }
  //       throw new Error('Invalid registration response');
  //     })
  //   );
  // }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }


  public findAllUsers(): Observable<User[]> { return this.http.get<User[]>(`${this.apiUrl}/all`) }

  public getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/findById`, {
      params: new HttpParams().set('email', email)
    });
  }


}