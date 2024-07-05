import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  private tokenKey = 'auth-token';
  private dataUser = new BehaviorSubject<any>(null);
  

  userData: any;

  constructor(
    private storage: Storage,
    private http: HttpClient
  ) {
    this.initStorage();
  }

  //create storage
  async initStorage() {
    await this.storage.create();
  }

  //set token
  async setToken(token: string) {
    await this.storage.set(this.tokenKey, token)
    this.getToken()
  }

  //get token
  async getToken() {
    const token = await this.storage.get(this.tokenKey);
    if (token) {
      const decodedToken = await this.decodeToken(token);
      return this.fetchDataUser(decodedToken.email);
    }
  }

  async clearToken() {
    await this.storage.remove(this.tokenKey);
  }

  //decode token
  decodeToken(token: string): any {
    if (token) {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        return JSON.parse(atob(tokenParts[1]));
      }
      return null;
    } 
  }

  //fetch data user
  async fetchDataUser(email: string) {
    if (email) {
      try {
        const response = await lastValueFrom(
          this.http.get<any>(`${environment.url_domain}/api/user`, { params: { email } })
        );
        if (response) {
          this.setUser(response);
        }
        return response;
      } catch (e) {
        throw e;
      }
    } else {
      return null
    }

  }

  //set user
  setUser(data: any) {
    this.dataUser.next(data);
  }

  //get user
  getUser() {
    return this.dataUser.asObservable();
  }

  async isUserDataComplete(): Promise<boolean> {
    const userData = this.dataUser.getValue();
    return !!userData && !!userData.address && !!userData.phone_number;
  }

}
