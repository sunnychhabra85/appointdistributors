import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DistributorService } from 'src/app/services/distributor.service';
import { ToastrService } from 'ngx-toastr';
import { DialogComponent } from 'src/app/shared/components/dialog/dialog.component';

@Component({
  selector: 'app-distributor-leads-results',
  templateUrl: './distributor-leads-results.component.html',
  styleUrls: ['./distributor-leads-results.component.css']
})
export class DistributorLeadsResultsComponent implements OnInit {

  @Input() leads: any[];
  @Input() catagoryName: string;
  private skip: number;
  private loadMoreResponse: boolean;

  constructor(
    public dialog: MatDialog,
    private distributorService: DistributorService,
    private _toastr: ToastrService) {
    this.skip = 24;
    this.loadMoreResponse = true;
  }

  ngOnInit(): void {
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
      // you're at the bottom of the page
      if (this.loadMoreResponse) {
        const BrandFilterDto = JSON.parse(sessionStorage.getItem('BrandFilterDto'));
        BrandFilterDto.skip = this.skip;
        this.loadMoreResponse = false;
        this.distributorService.getDistributorsLeadsBySearchFilter(BrandFilterDto).subscribe((response) => {
          if (response) {
            if (response.length === 0) {
              this.loadMoreResponse = false;
            }
            this.loadMoreResponse = true;
            if (this.leads?.length > 0){
              this.leads = this.leads.concat(response);
            }
            this.skip = this.skip + 24;
          }
        });
      }
    }
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

  ContactNow(id: number): void {
    this.openDistibutorsLeadData(id);
  }

  openDistibutorsLeadData(id: number): void {
    if (!sessionStorage.getItem('user')) {
      this.openDialog('login');
    } else {

      const lead = this.leads.find(d => d.id === id);
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

}
