import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { RegistrationDto } from '../models/registration.model';
import { environment } from '../../environments/environment';
import {UserRegisterDto} from '../models/userRegister.model';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  private API_URL = environment.API_URL;
  webAPIUrl: string;
  public registrationDto: RegistrationDto;
  public userRegisterDto: UserRegisterDto;
  // private token = localStorage.getItem('jwt');
  private httpOptions = {
    headers: new HttpHeaders(
      {
        // Authorization: 'Bearer ' + this.token ,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
  };

  constructor(private _httpClient: HttpClient) {
    this.registrationDto = new RegistrationDto();
    this.userRegisterDto = new UserRegisterDto();
    this.webAPIUrl = this.API_URL + '/api/BrandProduct/';
    // this.webAPIUrl = 'https://dmsapi20210529232937.azurewebsites.net/api/BrandProduct/';
  }

  saveUserRegistrationDetails(registrationDto: RegistrationDto): Observable<any> {
    // console.log( JSON.stringify(registrationDto));
    return this._httpClient.post<any>(this.webAPIUrl + 'SaveUserRegistrationDetails/', JSON.stringify(registrationDto), this.httpOptions);
  }


  saveUserDetails(userRegisterDto: UserRegisterDto): Observable<any> {
    // console.log(userRegisterDto)
    return this._httpClient.post<any>(this.webAPIUrl + 'SaveUserData/', JSON.stringify(userRegisterDto), this.httpOptions);
  }
}
