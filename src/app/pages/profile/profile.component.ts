import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApartmentService } from '../../core/services/apartment.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styles: [`
    .profile-container {
      max-width: 1100px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .profile-header-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.04);
      margin-bottom: 2.5rem;
    }
    .profile-avatar-large {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #eff6ff;
      color: #2563eb;
      font-size: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #bfdbfe;
    }
    .profile-info h2 {
      margin: 0 0 0.3rem 0;
      font-size: 1.4rem;
      color: #0f172a;
    }
    .profile-info p {
      margin: 0;
      color: #64748b;
      font-size: 0.95rem;
    }

    .section-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: #0f172a;
      margin: 2rem 0 1rem 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge-count {
      background: #eff6ff;
      color: #2563eb;
      font-size: 0.85rem;
      padding: 2px 8px;
      border-radius: 12px;
      font-weight: 600;
    }

    .listing-row {
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      margin-bottom: 2rem;
    }
    .compact-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      display: flex;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .compact-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.08);
    }
    .card-img-thumb {
      width: 180px;
      min-width: 180px;
      height: 120px;
      object-fit: cover;
      background: #f1f5f9;
    }
    .card-details {
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-grow: 1;
    }
    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.3rem 0;
    }
    .card-subtext {
      font-size: 0.88rem;
      color: #64748b;
      margin: 0;
    }
    .card-price {
      font-size: 1.15rem;
      font-weight: 700;
      color: #10b981;
    }
    .card-actions {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.6rem;
    }
    .btn-sm {
      padding: 0.4rem 0.85rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: 1px solid transparent;
      transition: all 0.2s;
    }
    .btn-view {
      background: #eff6ff;
      color: #2563eb;
      border-color: #bfdbfe;
    }
    .btn-view:hover {
      background: #2563eb;
      color: #ffffff;
    }
    .btn-edit {
      background: #f8fafc;
      color: #0284c7;
      border-color: #bae6fd;
    }
    .btn-edit:hover {
      background: #0284c7;
      color: white;
    }
    .btn-delete {
      background: #fef2f2;
      color: #ef4444;
      border-color: #fecaca;
    }
    .btn-delete:hover {
      background: #ef4444;
      color: white;
    }
    .empty-block {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      color: #64748b;
      font-size: 0.95rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private apartmentService = inject(ApartmentService);

  currentUser = this.authService.currentUser;

  favoriteApartments = computed(() => {
    let list: any[] = [];
    if (typeof this.apartmentService.apartments === 'function') {
      list = this.apartmentService.apartments() || [];
    } else if (Array.isArray((this.apartmentService as any).apartments)) {
      list = (this.apartmentService as any).apartments;
    }
    return list.filter(a => a.isFavorite);
  });

  myListings = computed(() => {
    let list: any[] = [];
    if (typeof this.apartmentService.apartments === 'function') {
      list = this.apartmentService.apartments() || [];
    } else if (Array.isArray((this.apartmentService as any).apartments)) {
      list = (this.apartmentService as any).apartments;
    }
    const userEmail = this.currentUser()?.email || 'demo@renthub.com';
    return list.filter(a => a.contactEmail === userEmail || a.userId === this.currentUser()?.id);
  });

  ngOnInit(): void {}

  removeFavorite(id: string): void {
    this.apartmentService.toggleFavorite(id);
  }

  deleteListing(id: string): void {
    if (confirm('Are you sure you want to delete this listing?')) {
      if (typeof (this.apartmentService as any).deleteApartment === 'function') {
        (this.apartmentService as any).deleteApartment(id);
      }
    }
  }
}
