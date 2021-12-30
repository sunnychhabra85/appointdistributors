import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public ForgotPassword: FormGroup;
  public displayConfirmMessage = false;
  public displayEmailNotFound = false;
  @Output() closePopupEvent = new EventEmitter<any>();
  constructor(
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    private _toastService: ToastrService) { }

  // corresponding form control
  formErrors = {
    email: ''
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    email: {
      required: 'Email is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      pattern: 'Please provide valid email address.'
    }
  };


  ngOnInit(): void {
    this.ForgotPassword = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  closePop(user: any): any {
    return this.closePopupEvent.emit(user);
  }

  cancelRequest(user: any): void {
    this.closePop(user);
  }

  onSubmit(): void {
    if (this.ForgotPassword.invalid)
    {
      return;
    }
    const email = this.ForgotPassword.get('email').value;
    this._loginService.forgotPassword(email).subscribe((result) => {
      if (result){
        this._toastService.success('An email is sent to your registered email id. To reset the password please click on it and change the passowrd.');
      }else{
        this._toastService.error('This email id is not registered with us. Kindly check and try again');
      }
    }, (error) => {
    });
  }

  logValidationErrors(group: FormGroup = this.ForgotPassword): void {
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

}
