import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Storage } from '@ionic/storage-angular';
import { Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  public darkMode$ = this.darkMode.asObservable();
  private themeKey = 'selected_theme';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private storage: Storage,
    private platform: Platform
  ) {
    this.initialize();
  }

  async initialize(): Promise<void> {
    try {
      // Wait for storage to be ready
      await this.storage.create();
      
      // Get the user's preference from storage if available
      const savedTheme = await this.storage.get(this.themeKey);
      
      if (savedTheme !== null) {
        // Use the saved preference
        this.setTheme(savedTheme === 'dark');
      } else {
        // Start with light theme by default instead of using system preference
        // This ensures consistent behavior across devices
        this.setTheme(false);
      }

      // Force apply initial theme (important for Android/iOS)
      this.applyThemeToBody(this.darkMode.value);
    } catch (error) {
      console.error('Theme initialization error:', error);
      // Default to light theme if there's an error
      this.setTheme(false);
    }
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    this.setTheme(!this.darkMode.value);
  }

  /**
   * Apply theme to body element and ensure all necessary CSS is applied
   */
  private applyThemeToBody(dark: boolean): void {
    // First remove any existing theme classes to ensure clean state
    this.document.body.classList.remove('dark-theme');
    
    if (dark) {
      this.document.body.classList.add('dark-theme');
    }
    
    // Force a repaint to ensure theme is applied
    // This helps with theme bugs in some mobile WebViews
    this.document.body.style.display = 'none';
    // Trigger a reflow
    void this.document.body.offsetHeight;
    this.document.body.style.display = '';
  }

  /**
   * Set the theme to dark or light
   * @param dark Whether to enable dark mode
   */
  async setTheme(dark: boolean): Promise<void> {
    try {
      // Update the BehaviorSubject
      this.darkMode.next(dark);
      
      // Apply theme to DOM
      this.applyThemeToBody(dark);
      
      // Save the user's preference to storage
      await this.storage.set(this.themeKey, dark ? 'dark' : 'light');
      
      console.log('Theme set to:', dark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  }
}