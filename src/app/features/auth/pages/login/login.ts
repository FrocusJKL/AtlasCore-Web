import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);

  readonly submitted = signal(false);
  readonly isSubmitting = signal(false);
  readonly loginError = signal('');

  readonly loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: false,
  });

  login(): void {
    this.submitted.set(true);
    this.loginError.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { username, password, rememberMe } = this.loginForm.getRawValue();

    this.isSubmitting.set(true);

    window.setTimeout(() => {
      this.isSubmitting.set(false);

      if (username !== 'atlas' || password !== 'atlascore') {
        this.loginError.set('Credenciales incorrectas. Usa atlas / atlascore para continuar.');
        return;
      }

      const session = {
        username,
        rememberMe,
        loggedInAt: new Date().toISOString(),
      };

      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('atlascore-session', JSON.stringify(session));

      this.router.navigate(['/dashboard']);
    }, 350);
  }

  hasError(controlName: 'username' | 'password'): boolean {
    const control = this.loginForm.controls[controlName];
    return control.invalid && (control.touched || this.submitted());
  }
}