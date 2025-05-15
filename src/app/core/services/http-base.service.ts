import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseObj } from '../models/http-response.interface';

export abstract class HttpBaseService<T> {
  protected readonly httpClient = inject(HttpClient);

  protected abstract getHost(): string;
  protected abstract getBaseResourceEndpoint(): string;

  protected getFullUrl(): string {
    return `${this.getHost()}${this.getBaseResourceEndpoint()}`;
  }

  getOne(params?: any, path = ''): Observable<ResponseObj<T>> {
    const httpParams = new HttpParams({
      fromObject: params,
    });
    return this.httpClient.get<ResponseObj<T>>(this.getUrl(path), {
      params: httpParams,
    });
  }

  getById(id: number | string): Observable<ResponseObj<T>> {
    return this.httpClient.get<ResponseObj<T>>(`${this.getFullUrl()}/${id}`);
  }

  getAll(params: any, path = ''): Observable<ResponseObj<T[]>> {
    const httpParams = new HttpParams({
      fromObject: params,
    });

    return this.httpClient.get<ResponseObj<T[]>>(this.getUrl(path), {
      params: httpParams,
    });
  }

  save(entity: T, path = ''): Observable<ResponseObj<T>> {
    return this.httpClient.post<ResponseObj<T>>(this.getUrl(path), entity);
  }

  saveWithFile(entity: T, path = ''): Observable<ResponseObj<T>> {
    const formData = this.setFormData(entity);

    return this.httpClient.post<ResponseObj<T>>(this.getUrl(path), formData);
  }

  update(id: string, entity: T, path = ''): Observable<ResponseObj<T>> {
    return this.httpClient.patch<ResponseObj<T>>(
      `${this.getUrl(path)}/${id}`,
      entity
    );
  }

  updateWithFile(id: string, entity: T, path = ''): Observable<ResponseObj<T>> {
    const formData = this.setFormData(entity);

    return this.httpClient.patch<ResponseObj<T>>(
      `${this.getUrl(path)}/${id}`,
      formData
    );
  }

  delete(id: string, path = ''): Observable<ResponseObj<T>> {
    return this.httpClient.delete<ResponseObj<T>>(`${this.getUrl(path)}/${id}`);
  }

  private setFormData(entity: T): FormData {
    const formData = new FormData();

    for (const key in entity) {
      if (entity[key] !== undefined && entity[key] !== null) {
        if (entity[key] instanceof File) {
          formData.append(key, entity[key]);
        } else if (typeof entity[key] === 'object' && entity[key] !== null) {
          formData.append(key, JSON.stringify(entity[key]));
        } else {
          formData.append(key, entity[key].toString());
        }
      }
    }

    return formData;
  }

  private getUrl(path: string): string {
    const url = path ? `${this.getFullUrl()}/${path}` : this.getFullUrl();
    return url;
  }
}
