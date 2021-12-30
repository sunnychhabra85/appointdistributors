import { Component, Input, OnInit, ViewChild  } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { DistributorService } from 'src/app/services/distributor.service';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';
import { BreakpointObserver, Breakpoints, BreakpointState, MediaMatcher } from '@angular/cdk/layout';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @ViewChild('ngcarousel', { static: true }) ngCarousel: NgbCarousel;

  @Input() distributorLeads: any[] = [];
  @Input() allDistributorsLeads:any[]=[];
  showNavigationArrows = false;
  constructor(
    config: NgbCarouselConfig,
    public dialog: MatDialog,
    private distributorService: DistributorService,
    public breakpointObserver: BreakpointObserver,
    public mediaMatcher: MediaMatcher) {
    config.interval = 50000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = true;
    config.showNavigationArrows = true;
    config.showNavigationIndicators = true;
  }
  distributorLeadsNew:any[] = [];

 
  ngOnInit(): void {
    
    this.breakpointObserver.observe([Breakpoints.XSmall,
    Breakpoints.Small,
    Breakpoints.Medium,
    Breakpoints.Large,
    Breakpoints.XLarge])
      .subscribe((state: BreakpointState) => {
        if (state.breakpoints['(max-width: 599.98px)'] == true) {
          this.showNavigationArrows = true;
        } else if (state.breakpoints['(min-width: 600px) and (max-width: 959.98px)'] == true) {
          this.showNavigationArrows = true;
        } else {
          this.showNavigationArrows = false;
        }
      });    


  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 600,
    autoplayTimeout:4000,
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

 
  openDialog(componentName): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      disableClose: true,
      width: componentName !== 'login' ? '750px' : '550px',
      data: componentName,
      panelClass: 'full-width-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log(result);
    });
  }


  openDistibutorsLeadData(id: number): void {
    if (!sessionStorage.getItem('user')) {
      this.openDialog('login');
    } else {
      const distributorLeadsArr = [];
      this.distributorLeads.forEach(element => {
        element.forEach(item => {
          distributorLeadsArr.push(item);
          
        });
      });
      const lead = distributorLeadsArr.find(d => d.id === id);
      const loggedInUser = JSON.parse(sessionStorage.getItem('user'));

      this.distributorService.getBrandSubscribedCategoriesByBrandId(loggedInUser.brandId).subscribe((result) => {
        if (result) {
          if (lead?.mainCategoryId > 0 && result.includes(lead?.mainCategoryId)) {
            sessionStorage.setItem('lead', JSON.stringify(lead));
            this.openDialog('distributorLeadsData');
          } else {
            this.openDialog('paidonly');
          }
        }
      });
    }
  }

  // Move to previous slide
  getToPrev() {
    this.ngCarousel.prev();
  }

  // Move to next slide
  goToNext() {
    this.ngCarousel.next();
  }
  
}
