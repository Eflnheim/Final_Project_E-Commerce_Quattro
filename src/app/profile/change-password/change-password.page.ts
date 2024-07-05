import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserDataService } from 'src/app/services/userData/user-data.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private userDataService: UserDataService
  ) { }

  ngOnInit() {
    this.userDataService.getUser().subscribe(data => {
      this.userData = data;
      console.log(this.userData);
    });
    this.initForm();
  }

  form!: FormGroup;
  userData: any;

  initForm() {
    this.form = new FormGroup({
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      confirm_password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
    });
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.updatePassword();
  };

  async updatePassword() {
    const data = await this.userService.updatePassword(this.form.value, this.userData.user_id)
    if (data['success'] === 1) {
      this.authService.showAlert(data['message']); 
    } else if (data['success'] === 0 || data['success'] === null) {
      this.authService.showAlert(data['message']); 
    }
  }

}
