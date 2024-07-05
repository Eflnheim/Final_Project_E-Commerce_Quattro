import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from '../userData/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private userDataService: UserDataService
  ) { }

  async getData() {
    const token = this.userDataService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    try {
      const response = await this.http.get<any>(`${environment.url_domain}/api/data`, { headers }).toPromise();
      return response;
    } catch (error) {
      throw error;
    }
  }

}
