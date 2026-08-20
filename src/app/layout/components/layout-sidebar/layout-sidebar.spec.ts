import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { LayoutSidebar } from './layout-sidebar';

describe('LayoutSidebar', () => {
  let component: LayoutSidebar;
  let fixture: ComponentFixture<LayoutSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutSidebar],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
