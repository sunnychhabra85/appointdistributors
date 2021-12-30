import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { DistributorService } from 'src/app/services/distributor.service';
import { GetbranddataService } from 'src/app/services/getbranddata.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import {Title, Meta} from "@angular/platform-browser";
import { Location } from '@angular/common';
import { filter, map } from 'rxjs/operators'; 

@Component({
  selector: 'app-search-result-category',
  templateUrl: './search-result-category.component.html',
  styleUrls: ['./search-result-category.component.scss']
})
export class SearchResultCategoryComponent implements OnInit {

  @Input() catagories: any[] = [];

  public collection: any[] = [];
  public loaderMessage: string = 'Please wait ...';
  public displaySpinner: boolean = false;
  public premiumCollection: any[] = [];
  public standardCollection: any[] = [];
  public normalCollection: any[] = [];
  public randomNormalCollection:any[] = [];
  id:any;
  employeeId: string;
  params:any;
  urlTree:any;
  title:any;
  constructor(
    config: NgbCarouselConfig,
    private router: Router,
    private SpinnerService: NgxSpinnerService,
    private distributorService: DistributorService,
    private _activatedRoute: ActivatedRoute,
    private getBrandData: GetbranddataService,
    public dialog: MatDialog,
    private titleService:Title,
    private meta:Meta, private location: Location) {
    config.interval = 5000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = false;
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('catagories')) {
      this.catagories = JSON.parse(sessionStorage.getItem('catagories'));
    }
    
    
    
    this.SpinnerService.show();
    this.displaySpinner = true;

    this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd), map(() => this.router)
    )
    .subscribe((event) => {
        // const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
        this.titleService.setTitle(this.title);
      }
    );

    this._activatedRoute.params.subscribe(parameter => {
      this.displaySpinner = false;
      this.params = parameter;
      this.id = parameter.id;
      this.catagories.forEach(element=>{
        element.forEach(item => {
          
          if(item.id == parameter.id){
              // this.titleService.setTitle(item.title);
              this.title = item.title;
            this.meta.updateTag({name: 'keywords', content: item.meta_Keywords});
            this.meta.updateTag({name: 'description', content: item.meta_Description});
            this.urlTree = this.router.createUrlTree(["/searchresultcategory/"+item.url],{
              relativeTo: this._activatedRoute,
              queryParams: this.params,
              queryParamsHandling: 'preserve'
            });
        
        // //Update the URL       
        // this.location.go(urlTree.toString());
        this.router.navigateByUrl(this.urlTree, {
          replaceUrl: true
        });
          }
         
        });
      })

      if (parameter.id && parameter.key) {
        this.distributorService.getBrandsByCategoryAndProductsKeyword(parameter.id, parameter.key).subscribe((result) => {
          this.collection = result;
          this.loaderMessage = this.collection.length + ' Results found';
          this.getBrandData.setOption('BrandDataByCatagory', result);
          // console.log(result);

          result.forEach(element => {
            if((element.premiumCategory).toLowerCase() == "premium"){
              this.premiumCollection.push(element);
            }
            else if((element.premiumCategory).toLowerCase() == "standard"){
              this.standardCollection.push(element);
            }
            else if((element.premiumCategory).toLowerCase() == "normal"){
              this.normalCollection.push(element);
            }
            else{
              
            }

           
        });
        
        this.setData(this.normalCollection);
        
        // this.randomNormalCollection = this.shuffleArray(this.normalCollection);
      
        });
      } else {
        this.distributorService.GetBrandsByCategoryId(parameter.id).subscribe((result) => {
          this.collection = result;
          this.loaderMessage = ''; // this.collection.length + ' Results found';
          this.getBrandData.setOption('BrandDataByCatagory', result);
          // console.log(result);

          result.forEach(element => {
              if(((element.premiumCategory).toLowerCase()) == "premium"){
                this.premiumCollection.push(element);
              }
              else if(((element.premiumCategory).toLowerCase()) == "standard"){
                this.standardCollection.push(element);
              }
              else if((element.premiumCategory).toLowerCase() == "normal"){
                this.normalCollection.push(element);
              }
              else{
                
              }
          });
          
          this.setData(this.normalCollection);
          // this.randomNormalCollection = this.shuffleArray(this.normalCollection);
          
        });
      }

      this.SpinnerService.hide();
    });


  }


  openKnowMore(id: number): void {
    this.router.navigate(['./knowmore', id]);
  }


  setData(data){
    // console.log(data)
    this.randomNormalCollection = data;    
  }

  

  shuffleArray(array) {
    var temp = [];
    var len=array.length;
    while(len){
       temp.push(array.splice(Math.floor(Math.random()*array.length),1)[0]);
       len--;
    }
    return temp;
 }
 
  openDialog(componentName, enquiryTo): void {
    // console.log(enquiryTo);
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: '750px',
      data: [componentName, enquiryTo],
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  onScrollDown() {
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

}
