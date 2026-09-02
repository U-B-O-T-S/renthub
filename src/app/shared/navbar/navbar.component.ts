import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar-wrapper">
      <div class="navbar-container">
        <a routerLink="/home" class="brand-logo">
          <span class="brand-icon">&#127968;</span> Rent<span class="brand-accent">Hub</span>
        </a>

        <nav class="nav-links">
          <a routerLink="/home" routerLinkActive="active-link" class="nav-item">Home</a>
          <button (click)="handlePostProperty()" class="btn-post">+ Post Property</button>

          <div class="auth-group" *ngIf="currentUser(); else guestBlock">
            <a routerLink="/profile" routerLinkActive="active-badge" class="user-badge" title="View Profile">
              <span class="avatar">&#128100;</span>
              <span class="user-name">Profile ({{ currentUser()?.name || 'demo' }})</span>
            </a>
            <button class="btn-logout" (click)="logout()">Logout</button>
          </div>

          <ng-template #guestBlock>
            <a routerLink="/auth" routerLinkActive="active-link" class="nav-item">Login</a>
          </ng-template>
        </nav>
      </div>
    </header>

    <!-- Modal Popup for Guest Actions -->
    <div class="modal-overlay" *ngIf="showAuthModal" (click)="showAuthModal = false">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-icon">&#128274;</div>
        <h3>Authentication Required</h3>
        <p>Please log in or create an account to post a property listing.</p>
        <div class="modal-actions">
          <button class="btn-modal-cancel" (click)="showAuthModal = false">Cancel</button>
          <button class="btn-modal-login" (click)="goToAuth()">Go to Login / Register</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .navbar-wrapper {
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
      position: sticky;
      top: 0;
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
    }
    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 1.4rem;
      font-weight: 800;
      color: #0f172a;
      text-decoration: none;
      letter-spacing: -0.5px;
      cursor: pointer;
    }
    .brand-icon { font-size: 1.3rem; }
    .brand-accent { color: #2563eb; }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .nav-item {
      color: #475569;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.95rem;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      transition: color 0.2s;
    }
    .nav-item:hover, .active-link {
      color: #2563eb;
    }
    .btn-post {
      background: #eff6ff;
      color: #2563eb;
      border: 1px solid #bfdbfe;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-post:hover {
      background: #2563eb;
      color: #ffffff;
      border-color: #2563eb;
    }
    .auth-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      padding: 0.4rem 0.85rem;
      border-radius: 20px;
      border: 1px solid #e2e8f0;
      text-decoration: none;
      color: #334155;
      cursor: pointer;
      transition: all 0.2s;
    }
    .user-badge:hover, .active-badge {
      background: #e2e8f0;
      border-color: #cbd5e1;
      color: #0f172a;
    }
    .avatar { font-size: 1rem; }
    .user-name {
      font-weight: 600;
      font-size: 0.88rem;
    }
    .btn-logout {
      background: transparent;
      border: none;
      color: #ef4444;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
      transition: background 0.2s;
    }
    .btn-logout:hover {
      background: #fee2e2;
    }

    /* Auth Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }
    .modal-card {
      background: #ffffff;
      padding: 2rem;
      border-radius: 12px;
      max-width: 420px;
      width: 90%;
      text-align: center;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
    }
    .modal-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .modal-card h3 { margin: 0 0 0.5rem 0; color: #0f172a; font-size: 1.3rem; }
    .modal-card p { color: #64748b; font-size: 0.95rem; margin: 0 0 1.5rem 0; line-height: 1.5; }
    .modal-actions { display: flex; gap: 0.8rem; justify-content: center; }
    .btn-modal-cancel {
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      border: 1px solid #cbd5e1;
      background: #ffffff;
      color: #475569;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-modal-login {
      padding: 0.6rem 1.2rem;
      border-radius: 6px;
      border: none;
      background: #2563eb;
      color: #ffffff;
      font-weight: 600;
      cursor: pointer;
    }
  `]
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  showAuthModal = false;

  handlePostProperty(): void {
    if (this.currentUser()) {
      this.router.navigate(['/create-post']);
    } else {
      this.showAuthModal = true;
    }
  }

  goToAuth(): void {
    this.showAuthModal = false;
    this.router.navigate(['/auth']);
  }

  logout(): void {
    if (typeof (this.authService as any).logout === 'function') {
      (this.authService as any).logout();
    }
    this.router.navigate(['/auth']);
  }
}
