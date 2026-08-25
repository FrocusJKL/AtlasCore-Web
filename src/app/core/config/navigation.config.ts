export type NavigationNode = {
  id: string;
  moduleId?: string | number;
  categoryId?: string | number;
  label: string;
  title?: string;
  name?: string;
  icon?: string;
  route?: string;
  path?: string;
  roles?: string[];
  visible?: boolean;
  active?: boolean;
  order?: number;
  expanded?: boolean;
  children?: NavigationNode[];
  modules?: NavigationNode[];
};

export const NAVIGATION: NavigationNode[] = [
  {
    id: 'administration',
    categoryId: 1,
    label: 'Administración',
    title: 'Administración',
    icon: 'settings',
    order: 1,
    modules: [
      {
        id: 'users',
        moduleId: 1,
        categoryId: 1,
        label: 'Usuarios',
        title: 'Usuarios',
        icon: 'group',
        route: '/users',
        roles: ['admin'],
        visible: true,
        active: true,
      },
      {
        id: 'roles',
        moduleId: 2,
        categoryId: 1,
        label: 'Roles',
        title: 'Roles',
        icon: 'security',
        route: '/roles',
        roles: ['admin'],
        visible: true,
        active: true,
      },
      {
        id: 'audit',
        moduleId: 3,
        categoryId: 1,
        label: 'Auditoría',
        title: 'Auditoría',
        icon: 'history',
        route: '/audit',
        roles: ['admin', 'manager'],
        visible: true,
        active: true,
      },
    ],
  },
  {
    id: 'sales',
    categoryId: 2,
    label: 'Ventas',
    title: 'Ventas',
    icon: 'sell',
    order: 2,
    modules: [
      {
        id: 'orders',
        moduleId: 4,
        categoryId: 2,
        label: 'Pedidos',
        title: 'Pedidos',
        icon: 'receipt_long',
        route: '/orders',
        roles: ['admin', 'seller'],
        visible: true,
        active: true,
      },
      {
        id: 'customers',
        moduleId: 5,
        categoryId: 2,
        label: 'Clientes',
        title: 'Clientes',
        icon: 'people',
        route: '/customers',
        roles: ['admin', 'seller'],
        visible: true,
        active: true,
      },
    ],
  },
  {
    id: 'config',
    categoryId: 3,
    label: 'Configuración',
    title: 'Configuración',
    icon: 'tune',
    order: 3,
    modules: [
      {
        id: 'company',
        moduleId: 6,
        categoryId: 3,
        label: 'Empresa',
        title: 'Empresa',
        icon: 'business',
        route: '/company',
        roles: ['admin'],
        visible: true,
        active: true,
      },
      {
        id: 'preferences',
        moduleId: 7,
        categoryId: 3,
        label: 'Preferencias',
        title: 'Preferencias',
        icon: 'settings_applications',
        route: '/preferences',
        roles: ['admin', 'manager'],
        visible: true,
        active: true,
      },
    ],
  },
];
