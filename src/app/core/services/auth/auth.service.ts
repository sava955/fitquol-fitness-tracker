import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { LoginParams } from '../../models/auth';
import { Router } from '@angular/router';
import { User } from '../../../features/user/models/user.interface';
import { HttpBaseService } from '../http-base.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpBaseService<LoginParams | string | User> {
  private readonly router = inject(Router);
  
  private token!: string;

  protected override getHost(): string {
    return environment.beUrl;
  }

  protected override getBaseResourceEndpoint(): string {
    return '/api/auth';
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
