import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutHeader } from '../components/layout-header/layout-header';
import { LayoutSidebar } from '../components/layout-sidebar/layout-sidebar';
import { LayoutFooter } from '../components/layout-footer/layout-footer';

@Component({
  standalone: true,
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    LayoutHeader,
    LayoutSidebar,
    LayoutFooter,
  ],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {}
