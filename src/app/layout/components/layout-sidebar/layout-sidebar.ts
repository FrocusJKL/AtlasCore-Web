import { Component, inject, output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../../core/services/theme.service';
import { NavigationNode } from '../../../core/config/navigation.config';
import { NavigationService } from '../../../core/services/navigation.service';

@Component({
  selector: 'layout-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './layout-sidebar.html',
  styleUrl: './layout-sidebar.scss',
})
export class LayoutSidebar {
  readonly themeService = inject(ThemeService);
  readonly dialog = inject(MatDialog);
  readonly navigationService = inject(NavigationService);
  readonly router = inject(Router);
  readonly collapsedChange = output<boolean>();
  @ViewChild('settingsDialog') settingsDialog!: TemplateRef<unknown>;
  collapsed = false;

  menuItems: NavigationNode[] = [];
  activeGroupId: string | null = null;
  openGroupId: string | null = null;
  private readonly currentRoles = ['admin', 'manager', 'seller', 'user'];

  constructor() {
    this.navigationService.getNavigation().subscribe((items) => {
      this.menuItems = this.filterNavigation(items);
      this.setActiveGroupFromUrl(this.router.url);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.setActiveGroupFromUrl(event.urlAfterRedirects);
      }
    });
  }

  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }

  openSettings(): void {
    this.dialog.open(this.settingsDialog, {
      width: '360px',
      maxWidth: 'calc(100vw - 2rem)',
      panelClass: 'settings-dialog-panel',
      ariaLabelledBy: 'settings-title',
      autoFocus: 'first-tabbable',
    });
  }

  toggleGroup(item: NavigationNode): void {
    if (!this.hasChildren(item)) {
      return;
    }

    item.expanded = !(item.expanded ?? true);
    if (item.expanded) {
      this.openGroupId = item.id;
    }
  }

  selectRailItem(item: NavigationNode): void {
    if (this.hasChildren(item)) {
      this.openGroupId = item.id;
      item.expanded = true;
      if (this.collapsed) {
        this.toggleCollapsed();
      }
      return;
    }

    this.activeGroupId = item.id;
  }

  hasChildren(item: NavigationNode): boolean {
    return Boolean((item.children ?? item.modules ?? []).length);
  }

  get activeMenuItem(): NavigationNode | null {
    return this.menuItems.find((item) => item.id === this.openGroupId) ?? null;
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

  private setActiveGroupFromUrl(url: string): void {
    const activeGroup = this.menuItems.find((item) =>
      (item.children ?? item.modules ?? []).some((child) => child.route && url.startsWith(child.route)),
    );

    this.activeGroupId = activeGroup?.id ?? this.activeGroupId ?? this.menuItems.find((item) => this.hasChildren(item))?.id ?? null;
    this.openGroupId = this.activeGroupId;
  }
}
