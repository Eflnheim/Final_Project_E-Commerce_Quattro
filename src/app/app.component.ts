import { Component, OnInit, OnDestroy } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { AuthService } from './services/auth/auth.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { UserDataService } from './services/userData/user-data.service';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  public appPages = [
    { title: 'Home', url: '/home', icon: 'home-outline' },
    { title: 'Profile', url: '/profile', icon: 'person-outline' },
    { title: 'Cart', url: '/cart', icon: 'cart-outline' },
    { title: 'History', url: '/history', icon: 'file-tray-full-outline' },
    { title: 'Logout', url: '/folder/trash', icon: 'log-out-outline', action: 'logout' },
  ];

  private userSubscription: Subscription | null = null;

  dataUser: any;

  constructor(
    private alertCtrl: AlertController,
    private userDataService: UserDataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserData();
    this.userSubscription = this.userDataService.getUser().subscribe(data => {
      this.dataUser = data;
    });
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  async loadUserData() {
    try {
      this.userDataService.getToken();
      console.log('fungsi ini dipanggil');
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async presentLogoutConfirm() {
    const alert = await this.alertCtrl.create({
      header: 'Confirm Logout',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        }, {
          text: 'Logout',
          handler: () => {
            this.authService.logout()
          }
        }
      ],
      cssClass: 'custom-alert'
    });
    await alert.present();
  }

}
