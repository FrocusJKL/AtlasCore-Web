import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
})
export class LayoutSidebar {
  readonly themeService = inject(ThemeService);
  readonly collapsedChange = output<boolean>();
  collapsed = false;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
    },
    {
      label: 'Usuarios',
      icon: 'group',
      route: '/users',
    },
  ];

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
