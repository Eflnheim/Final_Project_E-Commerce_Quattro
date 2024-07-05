import { Component, OnInit } from '@angular/core';
import { UserDataService } from 'src/app/services/userData/user-data.service';

@Component({
  selector: 'app-profile-detail',
  templateUrl: './profile-detail.page.html',
  styleUrls: ['./profile-detail.page.scss'],
})
export class ProfileDetailPage implements OnInit {

  constructor(
    private userDataService: UserDataService
  ) { }

  dataUser: any;

  ngOnInit() {
    this.userDataService.getUser().subscribe(data => {
      this.dataUser = data;
    });
  }

}
