import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Login } from 'src/app/models/login.model';
import { LoginService } from 'src/app/services/login.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: any;
  isLoggedIn: boolean = false;
  loginForm: FormGroup;
  submitted = false;
  @Output() closePopupEvent = new EventEmitter<any>();

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _loginService: LoginService,
    public dialog: MatDialog
  ) { }


  ngOnInit(): void {
    this.loginForm = this._formBuilder.group({
      username: [, [Validators.required]],
      password: [, [Validators.required]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    const user: Login = { username: this.loginForm.get('username').value, password: this.loginForm.get('password').value };
    this._loginService.login(user).subscribe((result) => {
      sessionStorage.setItem('user', JSON.stringify(result) );
      this.cancelRequest(result);
    }, (error) => {
      this.isLoggedIn = error.status === 404;
    });
  }

  cancelRequest(user: any): void {
    this.closePop(user);
  }

  registerUser(): void {
    this.closePop(null);
    this._router.navigate(['register']);
  }

  closePop(user: any): any {
    return this.closePopupEvent.emit(user);
  }

  forgotPassword(): void{
    this.closePop(null);
    this._router.navigate(['forgotpassword']);
  }

  openDialog(componentName): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: componentName !== 'login' ? '750px' : '550px',
      data: componentName,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.user = result;
      // console.log('The dialog was closed');
    });
  }
}
