import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { UserDataService } from '../userData/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private userDataService: UserDataService,
    private router: Router
  ) { }

  async register(formValue: any) {
    try {
      const response = await lastValueFrom(
        this.http.post<any>(environment.url_domain + "/api/register", formValue)
      );
      return response
    } catch(e) {
      throw(e);
    }
  }

  async login(formValue: any) {
    try{
      const response = await lastValueFrom(
        this.http.post<any>(environment.url_domain + "/api/login", formValue)
      );
      return response
    } catch(e) {
      throw e;
    }
  }

  async logout() {
    await this.userDataService.clearToken();
    this.router.navigateByUrl('/sign-in', { replaceUrl: true });
  }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication Failed',
        message: message,
        buttons: ['Close'],
        cssClass: 'custom-alert'
      })
      .then((alertEL) => {
        alertEL.present();
        setTimeout(() => {
          alertEL.dismiss();
        }, 3000);
      });
  }

  async isLoggedIn(): Promise<Boolean> {
    try {
      const token = await this.userDataService.getToken();
      return !!token
    } catch (error) {
      console.log(error)
      return false
      
    }
  }

  

}
