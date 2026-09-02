import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { ApartmentService } from '../../core/services/apartment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styles: [`
    .home-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1.5rem;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .hero-section {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .hero-title {
      font-size: 2.4rem;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 0.5rem;
    }
    .hero-subtitle {
      font-size: 1.1rem;
      color: #64748b;
      margin: 0;
    }
    .filter-panel {
      background: #ffffff;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      align-items: end;
      margin-bottom: 2.5rem;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
    }
    .filter-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #475569;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }
    .form-input, .form-select {
      width: 100%;
      padding: 0.65rem 0.8rem;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      font-size: 0.95rem;
      box-sizing: border-box;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-input:focus, .form-select:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
    }
    .grid-listings {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 2rem;
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
      display: flex;
      flex-direction: column;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }
    .card-thumb-container {
      position: relative;
      height: 200px;
      background: #f1f5f9;
    }
    .card-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .card-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: rgba(15, 23, 42, 0.75);
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: capitalize;
    }
    .card-fav-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #ffffff;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }
    .card-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 0.4rem 0;
    }
    .card-address {
      font-size: 0.9rem;
      color: #64748b;
      margin: 0 0 1rem 0;
    }
    .card-specs {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #f1f5f9;
      border-bottom: 1px solid #f1f5f9;
      padding: 0.75rem 0;
      margin-bottom: 1rem;
      font-size: 0.85rem;
      color: #475569;
    }
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: auto;
    }
    .card-price {
      font-size: 1.35rem;
      font-weight: 700;
      color: #10b981;
    }
    .view-btn {
      background: #2563eb;
      color: #ffffff;
      padding: 0.55rem 1.1rem;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: background 0.2s;
    }
    .view-btn:hover {
      background: #1d4ed8;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 1rem;
      color: #64748b;
    }
  `]
})
export class HomeComponent {
  private apartmentService = inject(ApartmentService);
  private authService = inject(AuthService);
  private router = inject(Router);

  searchQuery = signal<string>('');
  selectedType = signal<string>('all');
  selectedSort = signal<string>('default');

  filteredApartments = computed(() => {
    let list: any[] = [];
    if (typeof this.apartmentService.apartments === 'function') {
      list = this.apartmentService.apartments() || [];
    } else if (Array.isArray((this.apartmentService as any).apartments)) {
      list = (this.apartmentService as any).apartments;
    }

    const q = this.searchQuery().toLowerCase().trim();
    const type = this.selectedType();

    if (q) {
      list = list.filter(a =>
        (a.title && a.title.toLowerCase().includes(q)) ||
        (a.address && a.address.toLowerCase().includes(q)) ||
        (a.description && a.description.toLowerCase().includes(q))
      );
    }

    if (type !== 'all') {
      list = list.filter(a => a.buildingType && a.buildingType.toLowerCase() === type.toLowerCase());
    }

    if (this.selectedSort() === 'price-asc') {
      list = [...list].sort((a, b) => a.rent - b.rent);
    } else if (this.selectedSort() === 'price-desc') {
      list = [...list].sort((a, b) => b.rent - a.rent);
    }

    return list;
  });

  toggleFavorite(id: string, event: MouseEvent): void {
    event.stopPropagation();
    event.preventDefault();
    if (!this.authService.currentUser()) {
      if (confirm('Please log in to save properties to your favorites list. Would you like to log in now?')) {
        this.router.navigate(['/auth']);
      }
      return;
    }
    this.apartmentService.toggleFavorite(id);
  }
}
