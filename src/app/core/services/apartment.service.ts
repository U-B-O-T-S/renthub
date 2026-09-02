import { Injectable, signal } from '@angular/core';
import { Apartment, Comment } from '../models/apartment.model';

@Injectable({ providedIn: 'root' })
export class ApartmentService {
  private defaultApartments: Apartment[] = [
    {
      id: '1',
      title: 'Modern 2BHK in Downtown',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla ac enim consectetur.',
      buildingType: 'Apartment',
      propertyName: 'Skyline Heights',
      isShared: false,
      address: '123 Main St, City, State',
      squareFeet: 1200,
      leaseType: 'long-term',
      rent: 1800,
      isNegotiable: true,
      priceMode: 'per-month',
      isFurnished: true,
      amenities: ['Gym/Fitness Center', 'Swimming Pool', 'Car Park', 'Elevator'],
      photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600'],
      isFeatured: true,
      isFavorite: false,
      comments: [
        { id: 'c1', userName: 'User 1', text: 'Is the parking spot included in rent?', createdAt: '2026-02-15' },
        { id: 'c2', userName: 'User 2', text: 'Yes, 1 covered parking spot is included.', createdAt: '2026-02-16' }
      ],
      contactEmail: 'demo@renthub.com'
    },
    {
      id: '2',
      title: 'Cozy Studio near Tech Park',
      description: 'A well-lit studio unit perfect for working professionals. Close to public transit.',
      buildingType: 'Studio',
      propertyName: 'Green Valley',
      isShared: true,
      address: '456 Tech Ave, Silicon District',
      squareFeet: 650,
      leaseType: 'both',
      rent: 950,
      isNegotiable: false,
      priceMode: 'utilities-included',
      isFurnished: true,
      amenities: ['Power Backup', 'Water Heater', 'Laundry Service'],
      photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600'],
      isFeatured: true,
      isFavorite: false,
      comments: [],
      contactEmail: 'landlord2@renthub.com'
    },
    {
      id: '3',
      title: 'Luxury 3BHK Penthouse',
      description: 'Spacious penthouse with scenic skyline views and dedicated private lawn.',
      buildingType: 'Penthouse',
      propertyName: 'The Pinnacle',
      isShared: false,
      address: '789 High St, Uptown',
      squareFeet: 2400,
      leaseType: 'long-term',
      rent: 3200,
      isNegotiable: true,
      priceMode: 'per-month',
      isFurnished: false,
      amenities: ['Gym/Fitness Center', 'Private Lawn', 'Club House', 'Plant Security System'],
      photos: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'],
      isFeatured: false,
      isFavorite: true,
      comments: [],
      contactEmail: 'pinnacle@renthub.com'
    }
  ];

  private apartmentsSignal = signal<Apartment[]>(this.loadApartments());
  apartments = this.apartmentsSignal.asReadonly();

  private loadApartments(): Apartment[] {
    const data = localStorage.getItem('renthub_apartments');
    return data ? JSON.parse(data) : this.defaultApartments;
  }

  private saveApartments(items: Apartment[]): void {
    localStorage.setItem('renthub_apartments', JSON.stringify(items));
    this.apartmentsSignal.set(items);
  }

  getApartmentById(id: string): Apartment | undefined {
    return this.apartmentsSignal().find(a => a.id === id);
  }

  toggleFavorite(id: string): void {
    const updated = this.apartmentsSignal().map(item =>
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    this.saveApartments(updated);
  }

  addComment(apartmentId: string, commentText: string, userName: string): void {
    const newComment: Comment = {
      id: 'c_' + Date.now(),
      userName,
      text: commentText,
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = this.apartmentsSignal().map(item =>
      item.id === apartmentId ? { ...item, comments: [...item.comments, newComment] } : item
    );
    this.saveApartments(updated);
  }

  createApartment(data: Omit<Apartment, 'id' | 'comments' | 'isFavorite'>): void {
    const newPost: Apartment = {
      ...data,
      id: 'apt_' + Date.now(),
      comments: [],
      isFavorite: false
    };
    this.saveApartments([newPost, ...this.apartmentsSignal()]);
  }

  updateApartment(id: string, updatedData: Partial<Apartment>): void {
    const updated = this.apartmentsSignal().map(item =>
      item.id === id ? { ...item, ...updatedData } : item
    );
    this.saveApartments(updated);
  }

  deleteApartment(id: string): void {
    const updated = this.apartmentsSignal().filter(item => item.id !== id);
    this.saveApartments(updated);
  }

  sendInquiry(apartmentId: string, senderName: string, senderEmail: string, message: string) {
    const inquiries = JSON.parse(localStorage.getItem('renthub_inquiries') || '[]');
    const newInquiry = {
      id: 'inq_' + Date.now(),
      apartmentId,
      senderName: senderName || 'Demo User',
      senderEmail: senderEmail || 'demo@renthub.com',
      message,
      sentAt: new Date().toLocaleString()
    };
    inquiries.push(newInquiry);
    localStorage.setItem('renthub_inquiries', JSON.stringify(inquiries));
    console.log('📬 Inquiry Dispatched and Stored:', newInquiry);
    return newInquiry;
  }

}