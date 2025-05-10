import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private serverUrl = 'http://api.kreatedev.com/api';
  private authStateSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<any>(null);
  
  public authState$ = this.authStateSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  constructor(
    private http: HttpClient,
    private platform: Platform,
    private storage: Storage
  ) {
    this.initStorage();
    this.checkToken();
  }

  /**
   * Initialize storage
   */
  async initStorage() {
    await this.storage.create();
  }

  /**
   * Check token on app initialization
   */
  async checkToken() {
    await this.platform.ready();
    const token = await this.storage.get(this.tokenKey);
    const user = await this.storage.get(this.userKey);
    
    if (token) {
      this.authStateSubject.next(true);
      this.currentUserSubject.next(user);
    }
  }

  /**
   * Login user with email/password
   * @param credentials User credentials
   * @returns Observable of login response
   */
  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            this.storage.set(this.tokenKey, response.token);
            this.storage.set(this.userKey, response.user);
            this.authStateSubject.next(true);
            this.currentUserSubject.next(response.user);
          }
        }),
        catchError(error => {
          console.error('Login error', error);
          return of({ error: error.error.message || 'Login failed' });
        })
      );
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Observable of registration response
   */
  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/auth/register`, userData)
      .pipe(
        catchError(error => {
          console.error('Registration error', error);
          return of({ error: error.error.message || 'Registration failed' });
        })
      );
  }

  /**
   * Logout the current user
   */
  async logout() {
    await this.storage.remove(this.tokenKey);
    await this.storage.remove(this.userKey);
    this.authStateSubject.next(false);
    this.currentUserSubject.next(null);
  }

  /**
   * Get the current authentication token
   * @returns Promise with the token string
   */
  async getToken(): Promise<string | null> {
    return this.storage.get(this.tokenKey);
  }

  /**
   * Check if user is authenticated
   * @returns Observable boolean of authentication state
   */
  isAuthenticated(): Observable<boolean> {
    return this.authState$;
  }

  /**
   * Get the current user profile
   * @returns Observable with user profile
   */
  getUserProfile(): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/auth/profile`)
      .pipe(
        map(user => {
          this.currentUserSubject.next(user);
          return user;
        }),
        catchError(error => {
          console.error('Profile error', error);
          return of(null);
        })
      );
  }
}