import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { GetbranddataService } from 'src/app/services/getbranddata.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { DistributorService } from 'src/app/services/distributor.service';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Lightbox, LightboxConfig } from 'ngx-lightbox';
@Component({
  selector: 'app-know-more',
  templateUrl: './know-more.component.html',
  styleUrls: ['./know-more.component.scss']
})
export class KnowMoreComponent implements OnInit {

  public imagesArr: any[] = [];
  public imagesData:any[]=[];
  public BrandData: any;
  public BrandDataCollection: any;
  sizeMessage: any[] = [];
  _album: any[] = [];
  distributorLoation:any;
  distributorsState:any[] = [];

  public centralZone:any[] = ['Bihar', 'Chhatisgarh','Madhya Pradesh'];
  public westZone:any[] = ['Maharashtra', 'Goa','Rajasthan','Gujrat'];
  public eastZone:any[] = ['Arunachal Pradesh', 'Mizoram','Nagaland','Manipur','Tripura','West Bengal','Assam','Meghalaya','Odisha','Sikkim'];
  public northZone:any[] = ['Uttar Pradesh', 'Uttarakhand','Delhi',"Jammu & Kashmir","Haryana","Punjab","Himachal Pradesh"];
  public southZone:any[] = ['Karnataka', 'Andhra Pradesh','Kerala',"Tamil Nadu"];
  public UTZone:any[] = ['Lakshadweep', 'Dadar and Nagar Havelli','Penducherry','Andaman and Nicobar Islands','Chandigarh', 'Daman and Diu'];


  public centralState:any[] = [];
  public westState:any[] = [];
  public eastState:any[] = [];
  public northState:any[] = [];
  public southState:any[] = [];
  public UTState:any[] = [];



  viewportSizes = [
    Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge
  ];
  constructor(
    config: NgbCarouselConfig,
    private getBrandData: GetbranddataService,
    private _activatedRoute: ActivatedRoute,
    private SpinnerService: NgxSpinnerService,
    private distributorService: DistributorService,
    public dialog: MatDialog, public breakpointObserver: BreakpointObserver, 
    public mediaMatcher: MediaMatcher, private _lightbox: Lightbox, private _lightboxConfig: LightboxConfig) {
    config.interval = 53000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = false;
    config.showNavigationIndicators = true;
    this.viewportSizes.forEach((s) => {
      this.sizeMessage.push(
        mediaMatcher.matchMedia(s)
      );
    });
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 100,
    autoplayTimeout:3000,
    autoplayHoverPause:true,
    navText: ['&#8249', '&#8250;'],
    autoplay:true,
    responsive: {
      0: {
        items: 1 
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: true
  }

  ngOnInit(): void {
    this.SpinnerService.show();
    this._activatedRoute.params.subscribe(parameter => {

      if (parameter.brandId) {
        this.distributorService.GetBrandDataForKnowMore(parameter.brandId).subscribe((result) => {
          // console.log(result);
          if (result) {    
            console.log(result);        
            this.BrandData = result[0];            
            if(this.BrandData.distributorshipLocations.length>0){
            this.distributorLoation = this.BrandData.distributorshipLocations.split('-')[1];
            // console.log(this.BrandData.distributorshipLocations.split('-')[0].trim());
            this.distributorsState = this.distributorLoation.split(',');
            this.distributorsState = this.distributorsState.map(function (el) {
              return el.trim();
            });
          }
           

            this.centralState = this.getDistributorState(this.distributorsState, this.centralState, this.centralZone);
            this.westState = this.getDistributorState(this.distributorsState, this.westState, this.westZone);
            this.eastState = this.getDistributorState(this.distributorsState, this.eastState, this.eastZone);
            this.northState = this.getDistributorState(this.distributorsState, this.northState, this.northZone);
            this.southState = this.getDistributorState(this.distributorsState, this.southState, this.southZone);
            this.UTState = this.getDistributorState(this.distributorsState, this.UTState, this.UTZone);
                         
          }
          if (this.BrandData) {
            this.imagesData = this.BrandData.brandImages
            this.carouselImageAdjustment(this.BrandData.brandImages);

            this.imagesData.forEach( (element) => {
              const src = element;
              // const caption = 'Image ' + element + ' caption here';
              const thumb = element;
              const album = {
                 src: src,
                //  caption: caption,
                 thumb: thumb
              };
        
              this._album.push(album);        
          });
          console.log(this._album)
          }
        });
      }
      this.SpinnerService.hide();
    });
  }

  getDistributorState(fromArray, newArray, checkArray ){
    for (var i = 0; i < checkArray.length; i++) {
      if (fromArray.indexOf(checkArray[i]) > -1) {
          newArray.push(checkArray[i]);
      }
    }
    return newArray;
  }
  open(index: number): void {
    // open lightbox
    // this._lightbox.open(this._album, index);

    this._lightbox.open(this._album, index, {
      // showImageNumberLabel: true,
      // positionFromTop:0
      showZoom:true,
      centerVertically:true
   });
  }

  close(): void {
    // close lightbox programmatically
    this._lightbox.close();
  }

  // openDialog(componentName): void {
  //   const dialogRef = this.dialog.open(DialogComponent, {
  //     disableClose: true,
  //     width: '750px',
  //     data: componentName,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed');
  //   });
  // }

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
  scroll(el: HTMLElement): void {
    // el.scrollTo({behavior: 'smooth', top: 20});
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  carouselImageAdjustment(imageData: any[]): void {
    this.breakpointObserver.observe([Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (imageData?.length > 0) {
          if (state.breakpoints['(max-width: 599.98px)'] == true) {
            this.imagesArr = this.chunk(imageData, 1);
          } else if (state.breakpoints['(min-width: 600px) and (max-width: 959.98px)'] == true) {
            this.imagesArr = this.chunk(imageData, 2);

          } else {
            this.imagesArr = this.chunk(imageData, 4);
          }
        }
      });

  }

  chunk(arr, size) {
    let result = arr.reduce((rows, key, index) => (index % size == 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows, []);
    return result;
  }

}
