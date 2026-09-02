import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(AuthService);
  });

  it('should authenticate user on login', () => {
    const res = service.login('test@user.com', '1234');
    expect(res).toBeTrue();
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should clear data on logout', () => {
    service.login('test@user.com', '1234');
    service.logout();
    expect(service.isLoggedIn()).toBeFalse();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/auth']);
  });
});