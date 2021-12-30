import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';
import { CustomValidators } from '../../custom.validators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public ResetPasswordForm: FormGroup;
  public token: string;
  constructor(
    private _formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private _loginService: LoginService,
    private _toastService: ToastrService, private _router: Router) { }

  // corresponding form control
  formErrors = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    email: {
      required: 'Email is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      pattern: 'Please provide valid email address.'
    },
    password: {
      required: 'Password is required.',
      startingWithEmptySpace: 'You cannot start password text with empty spaces.',
      minlength: 'Password should have at least 4 characters.',
      maxlength: 'Password should not exceed more than 8 characters.'
    },
    confirmPassword: {
      required: 'Confirm password is required.',
      mustMatch: 'Password and confirm password must be same.'
    }
  };

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        // console.log(params);
        if (params.token == null){

        }else{
          this.token = (params.token).replaceAll(" ","+");
          // console.log((params.token).replaceAll(" ","+"));
        }
      }
    );

    this.ResetPasswordForm = this._formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(10), CustomValidators.startingWithEmptySpace()]],
        confirmPassword: ['', [Validators.required]],
    },
    {
      validator: CustomValidators.MustMatch('password', 'confirmPassword')
    });

    this.ResetPasswordForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.ResetPasswordForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  logValidationErrors(group: FormGroup = this.ResetPasswordForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  matchPasswords(group: AbstractControl): { [key: string]: any } | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
      return null;
    } else {
      return { passwordMismatch: true };
    }
  }

  resetPassword(): void{
    if (this.ResetPasswordForm.invalid || this.token === '' || this.token === null)
    {
      return;
    }

    const passwordRestDto = {email: this.ResetPasswordForm.get('email').value, password: this.ResetPasswordForm.get('password').value, token: this.token};
    this._loginService.ResetPassword(passwordRestDto).subscribe(result => {
      if (result){
        this._toastService.success('Your password is changed successfully');
        this._router.navigate(['']);
      }else{
        this._toastService.warning('Please after some time');
      }
    }, (error) => {
      this._toastService.warning('Please after some time');
    });

  }
}
