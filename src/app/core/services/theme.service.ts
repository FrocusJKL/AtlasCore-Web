import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'atlascore-theme';
  readonly theme = signal<Theme>(this.getInitialTheme());

  constructor() {
    this.applyTheme(this.theme());
  }

  toggle(): void {
    this.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme): void {
    this.theme.set(theme);
    this.applyTheme(theme);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private getInitialTheme(): Theme {
    if (!isPlatformBrowser(this.platformId)) {
      return 'light';
    }

    const savedTheme = localStorage.getItem(this.storageKey);
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }

    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    this.document.documentElement.classList.toggle('dark-theme', theme === 'dark');
    this.document.documentElement.classList.toggle('light-theme', theme === 'light');
  }
}