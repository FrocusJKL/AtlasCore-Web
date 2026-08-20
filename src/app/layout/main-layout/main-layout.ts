import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutSidebar } from '../components/layout-sidebar/layout-sidebar';
import { LayoutFooter } from '../components/layout-footer/layout-footer';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    LayoutSidebar,
    LayoutFooter,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
