import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="auth-box">
      <!-- Login Wireframe -->
      <section>
        <h2>Login</h2>
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" />
            <span class="error-msg" *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid">Enter a valid email</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" />
            <span class="error-msg" *ngIf="loginForm.get('password')?.touched && loginForm.get('password')?.invalid">Password required</span>
          </div>
          <button type="submit" [disabled]="loginForm.invalid">Login</button>
        </form>
      </section>

      <hr />

      <!-- Register Wireframe -->
      <section>
        <h2>Register</h2>
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Name</label>
            <input type="text" formControlName="name" />
            <span class="error-msg" *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid">Name required</span>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" formControlName="email" />
            <span class="error-msg" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">Enter a valid email</span>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" formControlName="password" />
            <span class="error-msg" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">Min 4 characters</span>
          </div>
          <button type="submit" [disabled]="registerForm.invalid">Register</button>
        </form>
      </section>
    </div>
  `,
  styles: [`
    .auth-box { max-width: 480px; margin: 20px auto; border: 2px solid #000; padding: 24px; }
    h2 { margin: 0 0 12px 0; font-size: 22px; font-weight: 700; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 12px; }
    .form-group label { font-size: 13px; margin-bottom: 4px; font-weight: 600; }
    .form-group input { border: 1px solid #000; padding: 8px; font-size: 14px; }
    .error-msg { color: red; font-size: 11px; margin-top: 2px; }
    button { border: 1px solid #000; background: #eee; padding: 6px 16px; cursor: pointer; font-weight: 600; }
    hr { border: 0; border-top: 1px solid #ccc; margin: 24px 0; }
  `]
})
export class AuthComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  onLogin(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password);
      this.router.navigate(['/home']);
    }
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const { name, email, password } = this.registerForm.value;
      this.authService.register(name, email, password);
      this.router.navigate(['/home']);
    }
  }
}