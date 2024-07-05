import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service'
import { UserDataService } from 'src/app/services/userData/user-data.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  
  form!: FormGroup;

  constructor(
    private authService: AuthService,
    private userDataService: UserDataService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)]
      }),
    })
  }
  
  onSubmit() {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }
    this.signIn();
  };

  async signIn() {
    this.authService.login(this.form.value).then(data => {
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
