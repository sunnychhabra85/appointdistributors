import { Component, OnInit } from '@angular/core';
import {Title, Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  constructor( private titleService:Title,
    private meta:Meta) { }

  ngOnInit(): void {
    this.titleService.setTitle("About Us - Appointdistributors");
    this.meta.updateTag({name: 'keywords', content: ""});
    this.meta.updateTag({name: 'description', content: "Appointdistributors is a unique platform for connecting distributors, Suppliers, and wholesalers with relevant companies and products"});
  }

}
