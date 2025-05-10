import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../services/theme.service';
import { LanguageService, Language } from '../services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: false,
})
export class Tab1Page implements OnInit {
  // Properties for the template
  isDarkMode = false;
  currentLanguage = 'ar'; // Default language is Arabic
  availableLanguages: Language[] = [];

  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    // Get available languages
    this.availableLanguages = this.languageService.availableLanguages;
    
    // Subscribe to dark mode changes
    this.themeService.darkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    // Subscribe to language changes
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme() {
    this.themeService.toggleTheme();
  }

  /**
   * Change the app language
   * @param langCode Language code to switch to
   */
  changeLanguage(langCode: string) {
    this.languageService.setLanguage(langCode);
  }

  /**
   * Get the current direction (RTL or LTR)
   */
  getCurrentDirection() {
    return this.languageService.getCurrentDirection();
  }
}
