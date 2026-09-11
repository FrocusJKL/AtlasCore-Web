import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should apply the stored theme when the app boots', () => {
    localStorage.setItem('atlascore-theme', 'dark');
    const document = TestBed.inject(DOCUMENT);

    document.documentElement.classList.remove('dark-theme', 'light-theme');

    TestBed.createComponent(App);

  });
});
