import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../models/user/user.interface';
import { ResponseObj } from '../../models/http-response/http-response.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly url = environment.beUrl + '/api/users';
  readonly httpClient = inject(HttpClient);

  getAuthenticatedUser(): Observable<ResponseObj<User>> {
    return this.httpClient.get<ResponseObj<User>>(this.url + '/current-user');
  }
}
