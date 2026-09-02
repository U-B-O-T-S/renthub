import { Component, inject, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApartmentService } from '../../core/services/apartment.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-post.component.html',
  styles: [`
    .post-container { border: 2px solid #000; padding: 24px; max-width: 750px; margin: 0 auto; }
    h2 { font-size: 18px; margin: 16px 0 8px 0; border-bottom: 1px solid #ddd; padding-bottom: 4px; }
    .form-group { display: flex; flex-direction: column; margin-bottom: 14px; }
    .form-row { display: flex; gap: 16px; margin-bottom: 14px; }
    .form-row .form-group { flex: 1; }
    input[type="text"], input[type="number"], select, textarea { border: 1px solid #000; padding: 8px; width: 100%; box-sizing: border-box; }
    .checkbox-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin: 8px 0; font-size: 13px; }
    .error-text { color: #d32f2f; font-size: 12px; margin-top: 4px; font-weight: 500; }
    .form-actions { display: flex; align-items: center; gap: 16px; margin-top: 16px; }
    .form-status-hint { color: #d32f2f; font-size: 13px; font-weight: 600; }
    .btn { border: 1px solid #000; background: #eee; padding: 8px 20px; cursor: pointer; font-weight: bold; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; background: #ccc; }
    .preview-box { border: 2px solid #000; padding: 20px; }
    .preview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .preview-item { border: 1px solid #000; padding: 8px; }
    .preview-photos { display: flex; gap: 10px; margin-top: 12px; }
    .preview-photos img { width: 120px; height: 80px; object-fit: cover; border: 1px solid #000; }
  `]
})
export class CreatePostComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private apartmentService = inject(ApartmentService);
  private authService = inject(AuthService);

  showPreview = signal(false);
  isEditMode = signal(false);
  editApartmentId: string | null = null;

  amenitiesList = [
    'Gym/Fitness Center', 'Power Backup', 'Plant Security System',
    'Swimming Pool', 'Garbage Disposal', 'Laundry Service',
    'Car Park', 'Private Lawn', 'Elevator',
    'Visitors Parking', 'Water Heater', 'Club House'
  ];

  postForm: FormGroup = this.fb.group({
    buildingType: ['', Validators.required],
    propertyName: ['', Validators.required],
    isShared: ['No', Validators.required],
    address: ['', Validators.required],
    squareFeet: ['', [Validators.required, Validators.min(10)]],
    leaseType: ['long-term', Validators.required],
    rent: ['', [Validators.required, Validators.min(1)]],
    isNegotiable: [false],
    priceMode: ['per-month', Validators.required],
    isFurnished: ['No', Validators.required],
    amenities: this.fb.array([]),
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.maxLength(1400)]],
    photos: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600']
  });

  ngOnInit(): void {
    this.editApartmentId = this.route.snapshot.paramMap.get('id');
    if (this.editApartmentId) {
      this.isEditMode.set(true);
      const existing = this.apartmentService.getApartmentById(this.editApartmentId);
      if (existing) {
        this.postForm.patchValue({
          buildingType: existing.buildingType,
          propertyName: existing.propertyName,
          isShared: existing.isShared ? 'Yes' : 'No',
          address: existing.address,
          squareFeet: existing.squareFeet,
          leaseType: existing.leaseType,
          rent: existing.rent,
          isNegotiable: existing.isNegotiable,
          priceMode: existing.priceMode,
          isFurnished: existing.isFurnished ? 'Yes' : 'No',
          title: existing.title,
          description: existing.description,
          photos: existing.photos.join(', ')
        });

        const formArray: FormArray = this.postForm.get('amenities') as FormArray;
        formArray.clear();
        existing.amenities.forEach(amenity => formArray.push(new FormControl(amenity)));
      }
    }
  }

  isAmenitySelected(item: string): boolean {
    const formArray: FormArray = this.postForm.get('amenities') as FormArray;
    return formArray.value.includes(item);
  }

  hasError(controlName: string, errorName: string): boolean {
    const control = this.postForm.get(controlName);
    return !!control?.hasError(errorName);
  }

  isTouched(controlName: string): boolean {
    const control = this.postForm.get(controlName);
    return !!(control && (control.touched || control.dirty));
  }

  hasValue(controlName: string): boolean {
    const val = this.postForm.get(controlName)?.value;
    if (typeof val === 'number') return true;
    return typeof val === 'string' && val.trim().length > 0;
  }

  getLength(controlName: string): number {
    return this.postForm.get(controlName)?.value?.length || 0;
  }

  onCheckboxChange(event: any): void {
    const formArray: FormArray = this.postForm.get('amenities') as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      const index = formArray.controls.findIndex(x => x.value === event.target.value);
      if (index >= 0) formArray.removeAt(index);
    }
  }

  goToPreview(): void {
    if (this.postForm.valid) {
      this.showPreview.set(true);
    } else {
      this.postForm.markAllAsTouched();
    }
  }

  backToEdit(): void {
    this.showPreview.set(false);
  }

  submitPost(): void {
    const f = this.postForm.value;
    const postPayload = {
      title: f.title,
      description: f.description,
      buildingType: f.buildingType,
      propertyName: f.propertyName,
      isShared: f.isShared === 'Yes',
      address: f.address,
      squareFeet: Number(f.squareFeet),
      leaseType: f.leaseType,
      rent: Number(f.rent),
      isNegotiable: !!f.isNegotiable,
      priceMode: f.priceMode,
      isFurnished: f.isFurnished === 'Yes',
      amenities: f.amenities,
      photos: f.photos.split(',').map((s: string) => s.trim()),
      contactEmail: this.authService.currentUser()?.email || 'admin@renthub.com'
    };

    if (this.isEditMode() && this.editApartmentId) {
      this.apartmentService.updateApartment(this.editApartmentId, postPayload);
      this.router.navigate(['/details', this.editApartmentId]);
    } else {
      this.apartmentService.createApartment(postPayload);
      this.router.navigate(['/home']);
    }
  }
}