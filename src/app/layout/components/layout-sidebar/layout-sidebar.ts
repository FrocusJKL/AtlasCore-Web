import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
})
export class LayoutSidebar {
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
}
