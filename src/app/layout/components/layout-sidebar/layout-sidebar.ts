import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink],
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
      label: 'Tickets',
      icon: 'confirmation_number',
      route: '/tickets',
    },
    {
      label: 'Usuarios',
      icon: 'group',
      route: '/users',
    },
  ];
}