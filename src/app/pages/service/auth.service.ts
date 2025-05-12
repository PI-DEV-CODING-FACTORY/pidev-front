import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
import { AuthenticationResponse } from '../../models/AuthenticationResponse';
import { AuthenticationRequest } from '../../models/AuthenticationRequest';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';



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

  constructor(private http: HttpClient, private router: Router) {
    // Initialize from localStorage if available
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }
  // ngOnInit() {
  //   const storedUser = localStorage.getItem('currentUser');
  //   this.currentUserSubject = new BehaviorSubject<User | null>(
  //     storedUser ? JSON.parse(storedUser) : null
  //   );
  //   this.currentUser = this.currentUserSubject.asObservable();
  // }
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
  // loading = false;

  login(request: AuthenticationRequest): Observable<AuthenticationResponse> {
    return this.http.post<AuthenticationResponse>('http://localhost:8083/api/auth/login', request)
      .pipe(map(response => {
        if (response) {
          localStorage.setItem('token', response.jwt);
          localStorage.setItem('user', JSON.stringify({
            email: response.email,
            firstname: response.firstname,
            lastname: response.lastname,
            role: response.role,
            profilePicture: response.profilePicture
          }));
          const user: User = {
            id: response.email,
            firstname: response.firstname,
            lastname: response.lastname,
            email: response.email,
            role: response.role,
            profileImage: response.profilePicture
          }
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return response; // Ensure the response is returned
        }
        throw new Error('Invalid login response'); // Handle undefined response
      }));

    // .subscribe({
    //   next: (response) => {
    //     console.log('Auth Response:', response);

    //     // if (!response.jwt) {
    //     //   console.error('No token in response:', response);
    //     //   this.messageService.add({
    //     //     severity: 'error',
    //     //     summary: 'Erreur',
    //     //     detail: 'Erreur d\'authentification: Token manquant'
    //     //   });
    //     //   this.loading = false;

    //     // }

    //     localStorage.setItem('token', response.jwt);
    //     localStorage.setItem('user', JSON.stringify({
    //       email: response.email,
    //       firstname: response.firstname,
    //       lastname: response.lastname,
    //       role: response.role,
    //       profilePicture: response.profilePicture
    //     }));
    //     const user: User = {
    //       id: response.email,
    //       firstname: response.firstname,
    //       lastname: response.lastname,
    //       email: response.email,
    //       role: response.role,
    //       profileImage: response.profilePicture
    //     }
    //     localStorage.setItem('currentUser', JSON.stringify(user));
    //     this.currentUserSubject.next(user);
    //     // this.messageService.add({
    //     //   severity: 'success',
    //     //   summary: 'Succès',
    //     //   detail: 'Connexion réussie'
    //     // });

    //     setTimeout(() => {
    //    //   this.loading = false;
    //       this.router.navigate(['/admin/dashboard']);
    //     }, 2500);
    //   },
    //   error: (error) => {
    //     console.error('Login error:', error);
    //    // this.loading = false;

    //     // this.messageService.add({
    //     //   severity: 'error',
    //     //   summary: 'Erreur',
    //     //   detail: error.error?.message || 'Email ou mot de passe incorrect'
    //     // });
    //   }
    // });


  }
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