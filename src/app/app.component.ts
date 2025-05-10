import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private themeService: ThemeService,
    private languageService: LanguageService,
    private translate: TranslateService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();
    
    // Initialize theme service
    await this.themeService.initialize();
    
    // Initialize language service (sets Arabic as default)
    await this.languageService.initialize();
    
    // Setup RTL based on current language
    this.setupRTL();
    
    
    // Update StatusBar based on current theme
    this.themeService.darkMode$.subscribe(isDark => {
      if (this.platform.is('cordova')) {
        if (isDark) {
          this.statusBar.styleLightContent();
          this.statusBar.backgroundColorByHexString('#121212');
        } else {
          this.statusBar.styleDefault();
          this.statusBar.backgroundColorByHexString('#ffffff');
        }
      }
    });
    

    // Configure the StatusBar if on Android
    if (this.platform.is('android')) {
      // Configure StatusBar based on config.xml preferences
      this.statusBar.backgroundColorByHexString('#00C48C');
      this.statusBar.styleLightContent();
      this.statusBar.overlaysWebView(false);
    }
  }
  
  /**
   * Setup RTL configuration based on the selected language
   */
  private setupRTL() {
    // Subscribe to language changes to update RTL direction
    this.languageService.direction$.subscribe(direction => {
      // Update the HTML dir attribute
      document.documentElement.dir = direction;
    });
  }
}
