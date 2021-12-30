import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToggleAllCatagoriesService } from 'src/app/services/toggle-all-catagories.service';
import { MasterDataDto } from 'src/app/models/master-data.model';
import { MasterDataService } from 'src/app/services/master-data.service';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {

  @Input() catagories: any[] = [];

  public displayAll = false;
  allCategories: MasterDataDto[] = [];
  showAll = false;

  public imagePath: SafeResourceUrl;
  constructor(private _sanitizer: DomSanitizer, private _masterDataService: MasterDataService, private toggleAllCatagoriesService: ToggleAllCatagoriesService) {

    this.imagePath = ''; // this._sanitizer.bypassSecurityTrustResourceUrl(this.catagories[0][0].image);
  }


  ngOnInit(): void {
    if (sessionStorage.getItem('catagories')) {
      this.catagories = JSON.parse(sessionStorage.getItem('catagories'));
    }
    this.toggleAllCatagoriesService.currentApprovalStageMessage.subscribe(msg => this.displayAll = msg);

    this._masterDataService.getAllCategoriesMasterData().subscribe((data: MasterDataDto[]) => {
      this.allCategories = data;
      console.log(data);
    });
  }

  get data(): boolean{
    // console.log(this.toggleAllCatagoriesService.displayAll);
    return this.toggleAllCatagoriesService.displayAll;
  }


  toggleDisplayAll(): void {
    this.displayAll = !this.displayAll;
    this.toggleAllCatagoriesService.updateDisplayAllCatagoriesFlag(this.displayAll);
  }

  toggleCategories() {
    this.showAll = !this.showAll;
  }

}
