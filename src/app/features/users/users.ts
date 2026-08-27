import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { User, UserDraft, UserRole, UserType } from './user.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, ReactiveFormsModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly usersService = inject(UsersService);
  readonly dialog = inject(MatDialog);

  @ViewChild('userFormDialog') userFormDialog!: TemplateRef<unknown>;
  @ViewChild('disableDialog') disableDialog!: TemplateRef<unknown>;
  private formDialogRef: MatDialogRef<unknown> | null = null;
  private disableDialogRef: MatDialogRef<unknown> | null = null;

  readonly users = this.usersService.users;
  readonly searchTerm = signal('');
  readonly selectedRole = signal<'all' | UserRole>('all');
  readonly selectedStatus = signal<'all' | 'active' | 'inactive'>('all');
  readonly editingUserId = signal<string | null>(null);
  readonly userToDisable = signal<User | null>(null);
  readonly deactivationReason = signal('');
  readonly disableSubmitted = signal(false);
  readonly submitted = signal(false);

  readonly userForm = this.formBuilder.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    apellidoPaterno: ['', [Validators.required, Validators.maxLength(200)]],
    apellidoMaterno: ['', [Validators.required, Validators.maxLength(200)]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    username: ['', [Validators.required, Validators.maxLength(80)]],
    password: [''],
    role: this.formBuilder.control<UserRole>('Consulta', Validators.required),
    specialty: [''],
    birthDate: [''],
    position: [''],
    gender: [''],
    curp: ['', Validators.maxLength(18)],
    civilStatus: [''],
    workEmail: ['', Validators.email],
    company: [''],
    workArea: [''],
    entryDate: [''],
    limitCompany: false,
    userType: this.formBuilder.control<UserType>('Interno', Validators.required),
    client: [''],
    active: true,
  });

  readonly filteredUsers = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const role = this.selectedRole();
    const status = this.selectedStatus();

    return this.users().filter((user) => {
      const matchesTerm = !term || `${this.fullName(user)} ${user.email} ${user.username}`.toLowerCase().includes(term);
      const matchesRole = role === 'all' || user.role === role;
      const matchesStatus = status === 'all' || (status === 'active' ? user.active : !user.active);
      return matchesTerm && matchesRole && matchesStatus;
    });
  });

  openCreate(): void {
    this.editingUserId.set(null);
    this.userForm.reset({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', telefono: '', email: '', username: '', password: '', role: 'Consulta', specialty: '', birthDate: '', position: '', gender: '', curp: '', civilStatus: '', workEmail: '', company: '', workArea: '', entryDate: '', limitCompany: false, userType: 'Interno', client: '', active: true });
    this.submitted.set(false);
    this.formDialogRef = this.dialog.open(this.userFormDialog, {
      width: '920px', maxWidth: 'calc(100vw - 2rem)', maxHeight: '92vh', panelClass: 'users-dialog-panel',
      ariaLabelledBy: 'user-form-title', autoFocus: 'first-tabbable',
    });
  }

  openEdit(user: User): void {
    this.editingUserId.set(user.id);
    this.userForm.patchValue({ ...user, password: '' });
    this.submitted.set(false);
    this.formDialogRef = this.dialog.open(this.userFormDialog, {
      width: '920px', maxWidth: 'calc(100vw - 2rem)', maxHeight: '92vh', panelClass: 'users-dialog-panel',
      ariaLabelledBy: 'user-form-title', autoFocus: 'first-tabbable',
    });
  }

  closeForm(): void {
    this.formDialogRef?.close();
    this.formDialogRef = null;
    this.submitted.set(false);
  }

  saveUser(): void {
    this.submitted.set(true);
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const draft: UserDraft = this.userForm.getRawValue();
    const editingUserId = this.editingUserId();
    if (editingUserId) {
      this.usersService.update(editingUserId, draft);
    } else {
      this.usersService.create(draft);
    }

    this.closeForm();
  }

  openDisable(user: User): void {
    this.userToDisable.set(user);
    this.deactivationReason.set('');
    this.disableSubmitted.set(false);
    this.disableDialogRef = this.dialog.open(this.disableDialog, {
      width: '520px', maxWidth: 'calc(100vw - 2rem)', panelClass: 'users-dialog-panel',
      ariaLabelledBy: 'disable-title', autoFocus: 'first-tabbable',
    });
  }

  closeDisable(): void {
    this.userToDisable.set(null);
    this.disableSubmitted.set(false);
    this.disableDialogRef?.close();
    this.disableDialogRef = null;
  }

  disableUser(): void {
    this.disableSubmitted.set(true);
    const reason = this.deactivationReason().trim();
    const user = this.userToDisable();
    if (!user || !reason) {
      return;
    }

    this.usersService.deactivate(user.id, reason);
    this.closeDisable();
  }

  setSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }

  setRole(value: string): void {
    this.selectedRole.set(value as 'all' | UserRole);
  }

  setStatus(value: string): void {
    this.selectedStatus.set(value as 'all' | 'active' | 'inactive');
  }

  setDeactivationReason(value: string): void {
    this.deactivationReason.set(value);
  }

  fullName(user: User): string {
    return `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`.trim();
  }

  hasError(controlName: 'nombre' | 'apellidoPaterno' | 'apellidoMaterno' | 'telefono' | 'email' | 'username' | 'role' | 'workEmail'): boolean {
    const control = this.userForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }
}
