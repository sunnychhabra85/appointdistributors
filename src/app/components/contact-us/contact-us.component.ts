import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {


  @Output() closePopupEvent = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
  }

  closePop(): any {
    return this.closePopupEvent.emit(null);
  }

  cancelRequest(): void {
    this.closePop();
  }

}
