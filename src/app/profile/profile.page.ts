import { Component, OnInit } from '@angular/core';
import { UserDataService } from '../services/userData/user-data.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private userDataService: UserDataService
  ) { }

  dataUser: any;

  ngOnInit() {
    this.userDataService.getUser().subscribe(data => {
      this.dataUser = data;
    });
  }

  isUserDataComplete(): boolean {
    return this.dataUser.address && this.dataUser.phone_number
  }

  public profileItemList = [
    {label: 'Profile Detail', icon: 'person', url: 'profile-detail'},
    {label: 'History', icon: 'cart'},
    {label: 'Change password', icon: 'key', url:'change-password'},
    {label: 'Logout', icon: 'log-out'}
  ];
}
