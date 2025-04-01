import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Login } from '../../models/auth/login.interface';
import { map, Observable, tap } from 'rxjs';
import { ResponseObj } from '../../models/http-response/http-response.interface';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { User } from '../../models/user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly url = environment.beUrl + '/api/auth';
  
  private token!: string;

  constructor() { }

  registerUser(params: User): Observable<ResponseObj<any>> {
    return this.httpClient.post<ResponseObj<any>>(`${this.url}/register`, params);
  }

  login(params: Login): Observable<ResponseObj<string>> {
    return this.httpClient.post<ResponseObj<any>>(`${this.url}/login`, params);
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('access_token', this.token);
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigateByUrl('login');
  }
}
