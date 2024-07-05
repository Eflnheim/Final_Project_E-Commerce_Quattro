import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from 'src/app/app.component';
import { UserDataService } from 'src/app/services/userData/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userDataService: UserDataService,
    private storage: Storage,
    private router: Router,
    private app: AppComponent
  ) { }

  ngOnInit() {
    this.userDataService.getUser().subscribe(data => {
      this.userData = data;
    });
    this.initForm();
    this.initStorage();
  }

  form!: FormGroup;
  userData: any;

  async initStorage() {
    await this.storage.create();
  }

  initForm() {
    this.form = new FormGroup({
      username: new FormControl(this.userData?.username || null, {validators: [Validators.required]}),
      email: new FormControl(this.userData?.email || null, {validators: [Validators.required, Validators.email]}),
      phone_number: new FormControl(this.userData?.phone_number || null, {validators: [Validators.required]}),
      address: new FormControl(this.userData?.address || null, {validators: [Validators.required]})
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.updateProfile();
  };

  async updateProfile() {
    try {
      const data = await this.userService.updateUser(this.form.value, this.userData.user_id);
      if (data['success'] === 1) {
        this.userDataService.setToken(data['token']);
        this.router.navigateByUrl('/home', { replaceUrl : true });
        this.form.reset(); 
      } else {
        this.authService.showAlert(data['message']); 
      }
    } catch (error) {
      this.authService.showAlert('An error occurred while updating profile.'); 
      console.error('Error updating profile:', error);
    }
  }

}
