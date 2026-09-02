import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApartmentService } from '../../core/services/apartment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './details.component.html',
  styles: [`
    .details-container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 2rem;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
    }
    .back-link:hover { text-decoration: underline; }
    
    .carousel-container {
      position: relative;
      width: 100%;
      height: 420px;
      background: #1e293b;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .carousel-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .carousel-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(0,0,0,0.6);
      color: #ffffff;
      border: none;
      padding: 0.8rem 1.2rem;
      font-size: 1.2rem;
      cursor: pointer;
      border-radius: 50%;
      transition: background 0.2s;
    }
    .carousel-btn:hover { background: rgba(0,0,0,0.9); }
    .carousel-btn.prev { left: 1rem; }
    .carousel-btn.next { right: 1rem; }
    .carousel-counter {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .price-tag {
      font-size: 1.8rem;
      font-weight: 700;
      color: #10b981;
    }
    .fav-btn {
      background: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }
    .fav-btn:hover { background: #fee2e2; }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      background: #f8fafc;
      padding: 1.2rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 0.85rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
    .meta-value { font-size: 1.1rem; color: #0f172a; font-weight: 600; margin-top: 2px; }

    .amenities-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
      margin: 1rem 0 2rem 0;
    }
    .amenity-chip {
      background: #e0f2fe;
      color: #0369a1;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .inquiry-card {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      padding: 1.5rem;
      border-radius: 10px;
      margin: 2rem 0;
    }
    .inquiry-card h3 { margin-top: 0; color: #166534; font-size: 1.2rem; }
    
    .comment-box-input {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-family: inherit;
      font-size: 0.95rem;
      box-sizing: border-box;
      margin-bottom: 0.8rem;
      resize: vertical;
    }
    .comment-box-input:focus {
      outline: none;
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37,99,235,0.15);
    }
    .btn-action {
      background: #2563eb;
      color: white;
      border: none;
      padding: 0.7rem 1.4rem;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-action:hover { background: #1d4ed8; }
    .btn-inquiry {
      background: #16a34a;
    }
    .btn-inquiry:hover { background: #15803d; }
    
    .success-badge {
      display: inline-block;
      margin-left: 1rem;
      color: #166534;
      font-weight: 600;
      font-size: 0.95rem;
    }

    .comments-section {
      margin-top: 2.5rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1.5rem;
    }
    .comment-item {
      background: #f8fafc;
      border-left: 4px solid #3b82f6;
      padding: 1rem;
      border-radius: 0 8px 8px 0;
      margin-bottom: 1rem;
    }
    .comment-author { font-weight: 700; color: #1e293b; margin-bottom: 4px; font-size: 0.95rem; }
    .comment-text { color: #475569; line-height: 1.4; margin: 0; }
  `]
})
export class DetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apartmentService = inject(ApartmentService);
  private authService = inject(AuthService);

  apartment = signal<any>(null);
  activePhotoIndex = signal<number>(0);
  newCommentText = signal<string>('');
  inquiryMessage = '';
  inquirySent = signal<boolean>(false);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const found = this.apartmentService.getApartmentById(id);
      if (found) {
        this.apartment.set(found);
      } else {
        this.router.navigate(['/home']);
      }
    }
  }

  nextPhoto(): void {
    const apt = this.apartment();
    if (apt && apt.photos && apt.photos.length > 0) {
      this.activePhotoIndex.update(idx => (idx + 1) % apt.photos.length);
    }
  }

  prevPhoto(): void {
    const apt = this.apartment();
    if (apt && apt.photos && apt.photos.length > 0) {
      this.activePhotoIndex.update(idx => (idx - 1 + apt.photos.length) % apt.photos.length);
    }
  }

  toggleFavorite(): void {
    if (!this.authService.currentUser()) {
      if (confirm('Please log in to save properties to your favorites list. Would you like to log in now?')) {
        this.router.navigate(['/auth']);
      }
      return;
    }
    const apt = this.apartment();
    if (apt) {
      this.apartmentService.toggleFavorite(apt.id);
      this.apartment.update(current => current ? { ...current, isFavorite: !current.isFavorite } : null);
    }
  }

  submitComment(): void {
    const text = this.newCommentText().trim();
    const apt = this.apartment();
    if (text && apt) {
      const author = this.authService.currentUser()?.name || 'Guest User';
      this.apartmentService.addComment(apt.id, text, author);
      const updated = this.apartmentService.getApartmentById(apt.id);
      if (updated) {
        this.apartment.set(updated);
      }
      this.newCommentText.set('');
    }
  }

  sendInquiry(): void {
    const text = this.inquiryMessage.trim();
    if (!text) return;

    const apt = this.apartment();
    const existing = JSON.parse(localStorage.getItem('renthub_inquiries') || '[]');
    const newEntry = {
      id: 'inq_' + Date.now(),
      apartmentId: apt ? apt.id : '1',
      senderEmail: this.authService.currentUser()?.email || 'guest@renthub.com',
      message: text,
      sentAt: new Date().toLocaleString()
    };

    existing.push(newEntry);
    localStorage.setItem('renthub_inquiries', JSON.stringify(existing));

    this.inquirySent.set(true);
    this.inquiryMessage = '';
    setTimeout(() => this.inquirySent.set(false), 3000);
  }
}
