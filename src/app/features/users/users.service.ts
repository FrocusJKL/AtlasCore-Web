import { Injectable, signal } from '@angular/core';

import { User, UserDraft } from './user.model';

const STORAGE_KEY = 'atlascore.users';

const DEFAULT_USERS: User[] = [
  {
    id: 'usr-001',
    nombre: 'María',
    apellidoPaterno: 'González',
    apellidoMaterno: 'López',
    telefono: '5551234567',
    email: 'maria.gonzalez@atlascore.com',
    username: 'mgonzalez',
    role: 'Administrador',
    specialty: '', birthDate: '1988-04-12', position: 'Administradora', gender: 'Femenino', curp: '', civilStatus: 'Casada',
    workEmail: 'maria.gonzalez@atlascore.com', company: 'AtlasCore', workArea: 'Tecnología', entryDate: '2025-04-12', limitCompany: false, userType: 'Interno', client: '',
    active: true,
    createdAt: '2025-04-12T10:00:00.000Z',
  },
  {
    id: 'usr-002',
    nombre: 'Carlos', apellidoPaterno: 'Rodríguez', apellidoMaterno: 'Santos', telefono: '5551234568',
    email: 'carlos.rodriguez@atlascore.com',
    username: 'crodriguez',
    role: 'Operador',
    specialty: '', birthDate: '', position: 'Editor', gender: 'Masculino', curp: '', civilStatus: '', workEmail: '', company: 'AtlasCore', workArea: 'Operaciones', entryDate: '2025-05-03', limitCompany: false, userType: 'Interno', client: '',
    active: true,
    createdAt: '2025-05-03T10:00:00.000Z',
  },
  {
    id: 'usr-003',
    nombre: 'Ana', apellidoPaterno: 'Martínez', apellidoMaterno: 'Díaz', telefono: '5551234569',
    email: 'ana.martinez@atlascore.com',
    username: 'amartinez',
    role: 'Consulta',
    specialty: '', birthDate: '', position: 'Consulta', gender: '', curp: '', civilStatus: '', workEmail: '', company: 'AtlasCore', workArea: '', entryDate: '2025-05-18', limitCompany: false, userType: 'Interno', client: '',
    active: false,
    createdAt: '2025-05-18T10:00:00.000Z',
  },
];

@Injectable({ providedIn: 'root' })
export class UsersService {
  private readonly usersState = signal<User[]>(this.loadUsers());

  readonly users = this.usersState.asReadonly();

  create(draft: UserDraft): User {
    const { password: _password, ...userData } = draft;
    const user: User = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    this.saveUsers([...this.usersState(), user]);
    return user;
  }

  update(id: string, draft: Partial<UserDraft>): User | undefined {
    let updatedUser: User | undefined;
    const users = this.usersState().map((user) => {
      if (user.id !== id) {
        return user;
      }

      const { password: _password, ...userData } = draft;
      updatedUser = { ...user, ...userData };
      return updatedUser;
    });

    this.saveUsers(users);
    return updatedUser;
  }

  delete(id: string): void {
    this.saveUsers(this.usersState().filter((user) => user.id !== id));
  }

  deactivate(id: string, reason: string): User | undefined {
    return this.update(id, { active: false, deactivationReason: reason });
  }

  activate(id: string): User | undefined {
    return this.update(id, { active: true, deactivationReason: undefined });
  }

  private loadUsers(): User[] {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      if (!storedUsers) {
        return DEFAULT_USERS;
      }

      const parsedUsers = JSON.parse(storedUsers);
      return Array.isArray(parsedUsers) ? parsedUsers.map((user) => this.normalizeUser(user)) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
  }

  private normalizeUser(value: Partial<Omit<User, 'role'>> & { name?: string; role?: string }): User {
    const legacyName = value.name?.trim().split(/\s+/) ?? [];
    const role = value.role === 'Editor' ? 'Operador' : value.role;

    return {
      id: value.id ?? crypto.randomUUID(),
      nombre: value.nombre ?? legacyName.shift() ?? 'Sin nombre',
      apellidoPaterno: value.apellidoPaterno ?? legacyName.shift() ?? '',
      apellidoMaterno: value.apellidoMaterno ?? legacyName.join(' '),
      telefono: value.telefono ?? '',
      email: value.email ?? '',
      username: value.username ?? '',
      role: role === 'Administrador' || role === 'Operador' || role === 'Consulta' ? role : 'Consulta',
      specialty: value.specialty ?? '',
      birthDate: value.birthDate ?? '',
      position: value.position ?? '',
      gender: value.gender ?? '',
      curp: value.curp ?? '',
      civilStatus: value.civilStatus ?? '',
      workEmail: value.workEmail ?? '',
      company: value.company ?? '',
      workArea: value.workArea ?? '',
      entryDate: value.entryDate ?? '',
      limitCompany: value.limitCompany ?? false,
      userType: value.userType === 'Externo' ? 'Externo' : 'Interno',
      client: value.client ?? '',
      active: value.active ?? true,
      createdAt: value.createdAt ?? new Date().toISOString(),
      deactivationReason: value.deactivationReason,
    };
  }

  private saveUsers(users: User[]): void {
    this.usersState.set(users);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      // The in-memory state remains usable when storage is unavailable.
    }
  }
}