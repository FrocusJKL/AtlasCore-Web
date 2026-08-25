import { Component, inject, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationNode } from '../../../core/config/navigation.config';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
})
export class LayoutSidebar {
  readonly themeService = inject(ThemeService);
  readonly navigationService = inject(NavigationService);
  readonly collapsedChange = output<boolean>();
  collapsed = false;

  menuItems: NavigationNode[] = [];
  activeGroupId: string | null = null;
  private readonly currentRoles = ['admin', 'manager', 'seller', 'user'];

  constructor() {
    this.navigationService.getNavigation().subscribe((items) => {
      this.menuItems = this.filterNavigation(items);
      this.activeGroupId = this.menuItems.find((item) => this.hasChildren(item))?.id ?? null;
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  toggleGroup(item: NavigationNode): void {
    if (!this.hasChildren(item)) {
      return;
    }

    item.expanded = !(item.expanded ?? true);
    if (item.expanded) {
      this.activeGroupId = item.id;
    }
  }

  selectRailItem(item: NavigationNode): void {
    if (this.hasChildren(item)) {
      this.activeGroupId = item.id;
      item.expanded = !(item.expanded ?? true);
      return;
    }

    this.activeGroupId = item.id;
  }

  hasChildren(item: NavigationNode): boolean {
    return Boolean((item.children ?? item.modules ?? []).length);
  }

  private filterNavigation(items: NavigationNode[]): NavigationNode[] {
    return items
      .filter((item) => item.visible !== false && this.hasAccess(item))
      .map((item) => {
        const nestedItems = item.children ?? item.modules ?? [];
        const children = nestedItems.length > 0 ? this.filterNavigation(nestedItems) : [];

        return {
          ...item,
          expanded: item.expanded ?? true,
          children: children.length > 0 ? children : undefined,
          modules: children.length > 0 ? children : undefined,
        };
      })
      .filter((item) => (item.children?.length ?? item.modules?.length ?? 0) > 0 || !!item.route)
      .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
  }

  private hasAccess(item: NavigationNode): boolean {
    const allowedRoles = item.roles ?? [];
    if (allowedRoles.length === 0) {
      return true;
    }

    return allowedRoles.some((role: string) => this.currentRoles.includes(role));
  }
}
