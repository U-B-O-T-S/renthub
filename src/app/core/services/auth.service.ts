import { Injectable, signal } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSignal = signal<User | null>(this.getStoredUser());
  currentUser = this.currentUserSignal.asReadonly();

  constructor(private router: Router) {}

  private getStoredUser(): User | null {
    const user = localStorage.getItem('renthub_user');
    return user ? JSON.parse(user) : null;
  }

  login(email: string, password: string): boolean {
    if (email && password) {
      const user: User = { id: 'u1', name: email.split('@')[0], email, token: 'mock-jwt-token' };
      localStorage.setItem('renthub_user', JSON.stringify(user));
      this.currentUserSignal.set(user);
      return true;
    }
    return false;
  }

  register(name: string, email: string, password: string): boolean {
    if (name && email && password) {
      const user: User = { id: 'u_' + Date.now(), name, email, token: 'mock-jwt-token' };
      localStorage.setItem('renthub_user', JSON.stringify(user));
      this.currentUserSignal.set(user);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('renthub_user');
    this.currentUserSignal.set(null);
    this.router.navigate(['/auth']);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSignal();
  }
}