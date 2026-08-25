import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';

import { NAVIGATION, type NavigationNode } from '../config/navigation.config';

export type NavigationResponse =
  | NavigationNode[]
  | { items?: NavigationNode[]; categories?: NavigationNode[]; data?: NavigationNode[] }
  | null
  | undefined;

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = '/api/navigation';

  getNavigation(): Observable<NavigationNode[]> {
    const fallback = this.normalize(NAVIGATION);

    return this.http.get<NavigationResponse>(this.endpoint).pipe(
      startWith(fallback),
      map((response) => this.normalize(response)),
      catchError(() => of(fallback))
    );
  }

  private normalize(response: NavigationResponse): NavigationNode[] {
    const items = Array.isArray(response)
      ? response
      : response?.items ?? response?.categories ?? response?.data ?? NAVIGATION;

    return items.map((item) => this.mapNode(item)).filter(Boolean) as NavigationNode[];
  }

  private mapNode(item: NavigationNode | any): NavigationNode | null {
    if (!item) {
      return null;
    }

    const children = this.normalizeChildren(item.children ?? item.modules ?? []);
    const label = this.getValue(item, ['label', 'title', 'name', 'nombreCategoria', 'nombre']) ?? 'Sin nombre';

    return {
      id: String(this.getIdValue(item, ['categoryId', 'idCategoria', 'categoriaId']) ?? label),
      categoryId: this.getIdValue(item, ['categoryId', 'idCategoria', 'categoriaId']) ?? undefined,
      moduleId: this.getIdValue(item, ['moduleId', 'idModulo', 'module_id']) ?? undefined,
      label: String(label),
      title: this.getValue(item, ['title', 'name', 'nombreCategoria', 'nombre'])?.toString() ?? String(label),
      name: this.getValue(item, ['name', 'nombreCategoria', 'nombre'])?.toString() ?? String(label),
      icon: this.getValue(item, ['icon', 'icono'])?.toString() ?? 'folder',
      route: this.getValue(item, ['route', 'path', 'ruta', 'url'])?.toString(),
      path: this.getValue(item, ['path', 'ruta'])?.toString() ?? this.getValue(item, ['route', 'url'])?.toString(),
      roles: Array.isArray(item.roles) ? item.roles : [],
      visible: this.toBoolean(this.getValue(item, ['visible', 'activo'])) ?? true,
      active: this.toBoolean(this.getValue(item, ['active', 'activo'])) ?? true,
      order: Number(this.getValue(item, ['order', 'orden']) ?? 0),
      modules: children.length > 0 ? children : undefined,
      children: children.length > 0 ? children : undefined,
    };
  }

  private normalizeChildren(items: NavigationNode[] = []): NavigationNode[] {
    return items
      .map((item) => this.mapNode(item))
      .filter((item): item is NavigationNode => Boolean(item));
  }

  private getValue<T>(source: T, keys: string[]): string | number | boolean | undefined {
    for (const key of keys) {
      const value = (source as Record<string, unknown>)[key];
      if (value !== undefined && value !== null && typeof value !== 'object') {
        return value as string | number | boolean;
      }
    }

    return undefined;
  }

  private getIdValue<T>(source: T, keys: string[]): string | number | undefined {
    const value = this.getValue(source, keys);
    return typeof value === 'boolean' ? undefined : value;
  }

  private toBoolean(value: string | number | boolean | undefined): boolean | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    return ['1', 'true', 'yes', 'y', 'on'].includes(String(value).toLowerCase());
  }
}
