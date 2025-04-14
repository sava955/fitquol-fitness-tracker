import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { PasswordRequest, User, UserRequest } from '../../models/user/user.interface';
import { ResponseObj } from '../../models/http-response/http-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = environment.beUrl + '/api/users';
  readonly httpClient = inject(HttpClient);

  authenticatedUser = new BehaviorSubject<User | null>(null);

  getUser(): Observable<ResponseObj<User>> {
    return this.httpClient.get<ResponseObj<User>>(this.url + '/current-user');
  }

  getAuthenticatedUser(): Observable<User | null> {
    return this.authenticatedUser.asObservable();
  }

  setAuthenticatedUser(user: User): void {
    this.authenticatedUser.next(user);
  }

  updateUser(id: string, data: Partial<UserRequest>): Observable<ResponseObj<User>> {
    return this.httpClient.patch<ResponseObj<User>>(`${this.url}/${id}`, data);
  }

  updatePassword(id: string, data: PasswordRequest): Observable<ResponseObj<{}>> {
    return this.httpClient.patch<ResponseObj<{}>>(`${this.url}/password/${id}`, data);
  }
}
