import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service'
import { UserDataService } from 'src/app/services/userData/user-data.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  form!: FormGroup;

  initForm() {
    this.form = new FormGroup({
      username: new FormControl(null, {validators: [Validators.required]}),
      email: new FormControl(null, {validators: [Validators.required, Validators.email]}),
      password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]}),
      confirm_password: new FormControl(null, {validators: [Validators.required, Validators.minLength(8)]})
    })
  }

  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.signUp();
  };

  async signUp() {
    this.authService.register(this.form.value).then(data => {
      if(data['success']) {
        this.userDataService.setToken(data['token']);
        this.router.navigateByUrl('/home', { replaceUrl : true });
        this.form.reset();
      } else {
        this.authService.showAlert(data['message']);
      }
    })
  }

}
