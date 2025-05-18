import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpBaseService } from '../../../core/services/http-base.service';
import { PasswordRequest, User, UserData, UserGoals } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService extends HttpBaseService<
  User | UserData | UserGoals | PasswordRequest
> {
  authenticatedUser = new BehaviorSubject<User | null>(null);

  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/users';
  }

  getAuthenticatedUser(): Observable<User | null> {
    return this.authenticatedUser.asObservable();
  }

  setAuthenticatedUser(user: User): void {
    this.authenticatedUser.next(user);
  }
}
