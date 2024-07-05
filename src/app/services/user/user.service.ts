import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private tokenKey = 'auth-token'; 

  constructor(
    private http: HttpClient,
    private storage: Storage
  ) { }

  async updateUser(data: any, id: number) {
    try{
      const response = await lastValueFrom(
        this.http.put<any>(`${environment.url_domain}/api/user/${id}`, data)
      );
      return response
    } catch(e) {
      throw(e);
    }
  }

  async updatePassword(formValue: any, id: number) {
    try {
      const response = await lastValueFrom(
        this.http.put<any>(`${environment.url_domain}/api/userpw/${id}`, formValue)
      );
      return response
    } catch(e) {
      throw(e);
    }
  }
}
