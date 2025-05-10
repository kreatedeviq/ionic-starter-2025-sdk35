import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private serverUrl = 'http://api.kreatedev.com/api';
  private isConnected = true;

  constructor(
    private http: HttpClient,
    private platform: Platform
  ) {
    this.monitorNetworkStatus();
  }

  /**
   * Monitor network connection status
   */
  private monitorNetworkStatus() {
    this.platform.ready().then(() => {
      // Initial connection status
      this.isConnected = navigator.onLine;

      // Monitor for online/offline events
      window.addEventListener('online', () => {
        this.isConnected = true;
        console.log('Network connected!');
      });

      window.addEventListener('offline', () => {
        this.isConnected = false;
        console.log('Network disconnected!');
      });
    });
  }

  /**
   * Get all items from a specific endpoint
   * @param endpoint API endpoint path
   * @returns Observable of items
   */
  getAll(endpoint: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.serverUrl}/${endpoint}`);
  }

  /**
   * Get a single item by ID
   * @param endpoint API endpoint path
   * @param id Item ID
   * @returns Observable of the item
   */
  getById(endpoint: string, id: string | number): Observable<any> {
    return this.http.get<any>(`${this.serverUrl}/${endpoint}/${id}`);
  }

  /**
   * Create a new item
   * @param endpoint API endpoint path
   * @param data Item data
   * @returns Observable of the created item
   */
  create(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${this.serverUrl}/${endpoint}`, data);
  }

  /**
   * Update an existing item
   * @param endpoint API endpoint path
   * @param id Item ID
   * @param data Updated item data
   * @returns Observable of the updated item
   */
  update(endpoint: string, id: string | number, data: any): Observable<any> {
    return this.http.put<any>(`${this.serverUrl}/${endpoint}/${id}`, data);
  }

  /**
   * Delete an item
   * @param endpoint API endpoint path
   * @param id Item ID
   * @returns Observable of the operation result
   */
  delete(endpoint: string, id: string | number): Observable<any> {
    return this.http.delete<any>(`${this.serverUrl}/${endpoint}/${id}`);
  }

  /**
   * Check if network is connected
   * @returns boolean indicating connection status
   */
  isNetworkConnected(): boolean {
    return this.isConnected;
  }
}