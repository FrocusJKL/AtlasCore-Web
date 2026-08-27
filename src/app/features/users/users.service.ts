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

  private loadUsers(): User[] {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY);
      return storedUsers ? (JSON.parse(storedUsers) as User[]) : DEFAULT_USERS;
    } catch {
      return DEFAULT_USERS;
    }
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