import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { Inject } from '@angular/core';

export interface Language {
  code: string;
  name: string;
  isRTL: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  // Available languages
  availableLanguages: Language[] = [
    { code: 'ar', name: 'العربية', isRTL: true },
    { code: 'en', name: 'English', isRTL: false },
    { code: 'ku', name: 'کوردی', isRTL: true }
  ];

  // Default language (Arabic)
  private defaultLanguage = 'ar';
  
  // Language storage key
  private languageKey = 'selected_language';
  
  // Current language subject
  private languageSubject = new BehaviorSubject<string>(this.defaultLanguage);
  public language$ = this.languageSubject.asObservable();
  
  // Current direction subject
  private directionSubject = new BehaviorSubject<string>('rtl');
  public direction$ = this.directionSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private storage: Storage,
    @Inject(DOCUMENT) private document: Document
  ) { }

  /**
   * Initialize the language service
   */
  async initialize(): Promise<void> {
    // Initialize storage
    await this.storage.create();
    
    // Set available languages
    this.translate.addLangs(this.availableLanguages.map(lang => lang.code));
    
    // Set fallback language
    this.translate.setDefaultLang(this.defaultLanguage);
    
    // Get saved language or use default
    const savedLang = await this.storage.get(this.languageKey) || this.defaultLanguage;
    
    // Set the initial language
    this.setLanguage(savedLang);
  }

  /**
   * Get the current language code
   */
  getCurrentLanguage(): string {
    return this.languageSubject.value;
  }

  /**
   * Get language object by code
   * @param code Language code
   */
  getLanguageByCode(code: string): Language | undefined {
    return this.availableLanguages.find(lang => lang.code === code);
  }

  /**
   * Get the current language direction (ltr or rtl)
   */
  getCurrentDirection(): string {
    const currentLang = this.getLanguageByCode(this.getCurrentLanguage());
    return currentLang?.isRTL ? 'rtl' : 'ltr';
  }

  /**
   * Set the app language
   * @param langCode Language code to set
   */
  async setLanguage(langCode: string): Promise<void> {
    // Validate language code
    if (!this.translate.getLangs().includes(langCode)) {
      langCode = this.defaultLanguage;
    }
    
    // Get language object
    const language = this.getLanguageByCode(langCode);
    
    if (language) {
      // Update language
      this.translate.use(langCode);
      this.languageSubject.next(langCode);
      
      // Update direction
      const direction = language.isRTL ? 'rtl' : 'ltr';
      this.directionSubject.next(direction);
      
      // Update document direction
      this.document.documentElement.dir = direction;
      this.document.documentElement.lang = langCode;
      
      // Add RTL class if needed
      if (language.isRTL) {
        this.document.body.classList.add('rtl');
      } else {
        this.document.body.classList.remove('rtl');
      }
      
      // Save to storage
      await this.storage.set(this.languageKey, langCode);
    }
  }
}