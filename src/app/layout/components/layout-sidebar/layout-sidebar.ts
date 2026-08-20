import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, MatListModule, MatIconModule],
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
