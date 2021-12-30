import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Enquiry } from '../models/enquiry.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnquiryService {
  private API_URL= environment.API_URL;
  webAPIUrl: string;
  msgAPI:string;
  // private token = localStorage.getItem('jwt');
  private httpOptions = {
    headers: new HttpHeaders(
      {
        // Authorization: 'Bearer ' + this.token ,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      })
  };

  private httpOptions1 = {
    headers: new HttpHeaders(
      {
        // Authorization: 'Bearer ' + this.token ,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        "Access-Control-Allow-Origin":"*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Max-Age": "1800",
        "Access-Control-Allow-Headers": "content-type",
        "Access-Control-Allow-Methods": "PUT, POST, GET, DELETE, PATCH, OPTIONS" 
      })
  };

  constructor(private _httpClient: HttpClient) {
    this.webAPIUrl = this.API_URL + '/api/Enquiry/';
    //this.webAPIUrl = 'https://dmsapi20210529232937.azurewebsites.net/api/Enquiry/';
  }

  saveEnquiry(requestDto: Enquiry): Observable<any> {
    // console.log(requestDto);
    return this._httpClient.post<any>(this.webAPIUrl, JSON.stringify(requestDto), this.httpOptions);
  }

  sendMessage(num, name): Observable<any> {
    // console.log(num)
    return this._httpClient.post<any>(`https://2factor.in/API/R1/?module=TRANS_SMS&apikey=2b5fb06c-429d-11eb-83d4-0200cd936042&to=${num}&from=APNTDR&templatename=SMStemplateInfered&var1=${name}&var2=your product`, this.httpOptions1);
  }

}
