import { Component, OnInit, AfterViewInit, Input  } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { DistributorService } from 'src/app/services/distributor.service';
import { MasterDataService } from 'src/app/services/master-data.service';
import { Brand } from 'src/app/models/brand.model';
import { MasterDataDto } from 'src/app/models/master-data.model';
import { LocationDto } from 'src/app/models/location.model';
import { RequestType } from 'src/app/models/system.enums';
import { RegistrationService } from 'src/app/services/registration.service';
import { Router } from '@angular/router';
import {Title, Meta} from "@angular/platform-browser";

@Component({
  selector: 'app-become-distributor',
  templateUrl: './become-distributor.component.html',
  styleUrls: ['./become-distributor.component.css']
})
export class BecomeDistributorComponent implements OnInit {

  @Input() selectStates: [];
  @Input() selectCities:[];

  becomeDistributorForm: FormGroup;
  locationMultiSelectSettings = {};
  businessNatureMultiSelectSettings = {};
  businessNatures: MasterDataDto[] = [];
  categories: MasterDataDto[] = [];
  allLocations: LocationDto[] = [];
  // states: LocationDto[] = [];
  selectedStates: LocationDto[] = [];
  // cities: LocationDto[] = [];
  selectedCities: LocationDto[] = [];
  investmentRanges: MasterDataDto[] = [];
  // products: MasterDataDto[] = [];
  // distributorshipTypes: MasterDataDto[] = [];

  hideExperienceTextBox: boolean = false;

  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    products: '',
    businessNature: '',
    categories: '',
    investmentAmount: '',
    spaceRequired: '',
    pan: '',
    experianceType: '',
    // brandName: '',
    // distributorshipType: ''
    // minInvestmentAmount: '',
    // maxInvestmentAmount: '',
    // gstNumber: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    
    products: {
      required: 'Products for Distributorship is required.',
    },
    businessNature: {
      required: 'Business nature is required.',
    },
    categories: {
      required: 'Category is required.',
    },
    investmentAmount: {
      min: 'Please select investment range'
    },
    spaceRequired: {
      required: 'Space is required.',
      startingWithEmptySpace: 'You cannot start with empty spaces.',
    },
    pan: {
      required: 'PAN is required.',
      minlength: 'PAN should have 10 characters.',
      maxlength: 'PAN should have 10 characters.',
      pattern: 'Enter a valid PAN.'
    },
    
    experianceType: {
      required: 'Select experiance.',
    },
    distributorshipType: {
      required: 'Distributorship type is required.',
    },
    // brandName: {
    //   required: 'Brand name is required.',
    //   startingWithEmptySpace: 'You cannot start with empty spaces.',
    // },
    // minInvestmentAmount: {
    //   required: 'Please provide minimum investment amount.',
    //   pattern: 'Only numbers are allowed.'
    // },
    // maxInvestmentAmount: {
    //   required: 'Please provide maximum investment amount.',
    //   pattern: 'Only numbers are allowed.'
    // },
    // gstNumber: {
    //   required: 'GST number is required.',
    //   minlength: 'GST number should have 15 characters.',
    //   maxlength: 'GST number should have 15 characters.',
    //   pattern: 'Enter a valid GST number.'
    // },

  };

  constructor(private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _toastr: ToastrService,
    private _distributorService: DistributorService,
    private _masterDataService: MasterDataService,
    private _registrationService: RegistrationService,
    private _router: Router, private titleService:Title,
    private meta:Meta) {
     }

  ngOnInit(): void {
    this.loadMasterData();

    this.setupForm();

    this.becomeDistributorForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.becomeDistributorForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
  }

  becomeDistributorSubmit(): void {
    this._spinnerService.show();
    // console.log(this.appointDistributorForm.value);
    const brandDto = this.mapFormValuesToModel();
    this._registrationService.registrationDto.brand = brandDto;
    this._registrationService.saveUserRegistrationDetails(this._registrationService.registrationDto).subscribe((result: any) => {
      this.handleSuccess(result);
    }, (error: any) => {
      this.handleError(error);
    });

   // this._router.navigate(['home']);
  }

  setupForm() {

    this.locationMultiSelectSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: true
    };

    this.businessNatureMultiSelectSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.becomeDistributorForm = this._formBuilder.group({
      businessNatures: [[]],
      categories: [[]],
      products: ['', [Validators.required]],
      investmentAmount: [0],
      spaceRequired: ['', [CustomValidators.startingWithEmptySpace()]],
      pan: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      experianceType: [],
      experianceYears: [],
      // states: [this.selectStates],
      // cities: [this.selectCities],
      description: [''],

      // brandName: ['', [Validators.required, CustomValidators.startingWithEmptySpace()]],
      // brandName: ['', [CustomValidators.startingWithEmptySpace()]],
      // businessNature: ['', Validators.required],
      // investmentRequired: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      // minInvestmentAmount: ['', [Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/)]],
      // maxInvestmentAmount: ['', [Validators.pattern(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/)]],
      // gstNumber: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      // gstNumber: ['', [Validators.minLength(15), Validators.maxLength(15), Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      // experianceType: [[], Validators.required],
      // pan: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/[A-Z]{5}[0-9]{4}[A-Z]{1}/)]],
      // distributorshipType: ['', Validators.required],
    });

  }

  loadMasterData() {

    if (sessionStorage.getItem('catagories')) {
      const prodCatagories = JSON.parse(sessionStorage.getItem('catagories'));
      prodCatagories.forEach(element => {
        element.forEach(item => {
          this.categories.push(item);
        });
      });
    } else {
      this._masterDataService.getAllCategoriesMasterData().subscribe((data: MasterDataDto[]) => {
        this.categories = data; 
      });
    }

    this._masterDataService.getAllBusinessNatures().subscribe((data: MasterDataDto[]) => {
      this.businessNatures = data;
    });

    this._masterDataService.getAllInvestmentRanges().subscribe((data: MasterDataDto[]) => {
      this.investmentRanges = data;
    });

    this._masterDataService.getAllLocations().subscribe((data: LocationDto[]) => {
      this.allLocations = data;

      // this.getAllStates(3);
      // this.getAllCities(4);
    });

    // this._masterDataService.getAllDistributorshipTypes().subscribe((data: MasterDataDto[]) => {
    //   this.distributorshipTypes = data;
    // });
  }

  mapFormValuesToModel(): Brand {
    const brand = new Brand();
    
    brand.description = this.becomeDistributorForm.value.description;
    brand.categories = [parseInt(this.becomeDistributorForm.value.categories)];
    brand.businessNatures = this.becomeDistributorForm.value.businessNatures != '' ? this.becomeDistributorForm.value.businessNatures.map(({ id }) => id) : null;
    brand.investmentRangeId = parseInt(this.becomeDistributorForm.value.investmentAmount);
    brand.spaceRequired = this.becomeDistributorForm.value.spaceRequired;
    brand.productsKeywords = this.becomeDistributorForm.value.products;
    brand.pan = this.becomeDistributorForm.value.pan;
    brand.gstNumber = this.becomeDistributorForm.value.gstNumber;
    brand.experianceType = this.becomeDistributorForm.value.experianceType;
    brand.experianceYears = this.becomeDistributorForm.value.experianceYears;
    brand.requestType = RequestType.BecomeDistributor;
    // locations
    // if (this.selectedStates.length > 0) {
    //   brand.statewiseLocations = this.selectedStates.map(({ id }) => id);
    // }
    // if (this.selectedCities.length > 0) {
    //   brand.citywiseLocations = this.selectedCities.map(({ id }) => id);
    // }
    if (this.selectStates.length > 0) {
      brand.statewiseLocations = this.selectStates.map(({ id }) => id);
    }
    if (this.selectCities.length > 0) {
      brand.citywiseLocations = this.selectCities.map(({ id }) => id);
    }

    return brand;

    // brand.name = this.becomeDistributorForm.value.brandName;
    // brand.minInvestmentAmount = this.becomeDistributorForm.value.minInvestmentAmount;
    // brand.maxInvestmentAmount = this.becomeDistributorForm.value.maxInvestmentAmount;
    // brand.products = this.becomeDistributorForm.value.products != "" ? this.becomeDistributorForm.value.products.map(({ id }) => id) : null;
    // brand.distributorshipType = this.becomeDistributorForm.value.distributorshipType;
  }

  handleError(error: any): void {
    // if (error.statusText === 'Bad Request' || error.status === 400) {
    //   alert(error.error);
    //   this._spinnerService.hide();
    // }
    console.log(error);
    this._toastr.error('Oops something went wrong !!! Please try again after sometime', 'Error');
    this._spinnerService.hide();
  }

  handleSuccess(resp: any): void {
    this._spinnerService.hide();
    this._registrationService.registrationDto = null;
    this.becomeDistributorForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Your data has been saved successfully.', 'Success');
    this._router.navigate(['']);
  }

  logValidationErrors(group: FormGroup = this.becomeDistributorForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (key == 'categories' || abstractControl.touched || abstractControl.dirty)) {
          const messages = this.validationMessages[key];
          for (const errorKey in abstractControl.errors) {
            if (errorKey) {
              this.formErrors[key] += messages[errorKey] + ' ';
            }
          }
        }
      }
    });
  }

  // getAllStates(stateType) {
  //   this.states = this.allLocations.filter(x => x.distributorshipTypeId === stateType);
  // }

  // getAllCities(cityType) {
  //   this.cities = this.allLocations.filter(x => x.distributorshipTypeId === cityType);
  // }

  // public onCountryChecked(event) {
  //   if (event.target.checked) {
  //     this.countries = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
  //   }
  //   else {
  //     this.countries = [];
  //   }
  // }

  // public onRegionChecked(event) {
  //   if (event.target.checked) {
  //     this.regions = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
  //   }
  //   else {
  //     this.regions = [];
  //     this.selectedRegions = [];
  //   }
  // }

  // public onStateChecked(event) {
  //   if (event.target.checked) {
  //     this.states = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
  //   }
  //   else {
  //     this.states = [];
  //     this.selectedStates = [];
  //   }
  // }

  // public onCityChecked(event) {
  //   if (event.target.checked) {
  //     this.cities = this.allLocations.filter(x => x.distributorshipTypeId === parseInt(event.target.value));
  //   }
  //   else {
  //     this.cities = [];
  //     this.selectedCities = [];
  //   }
  // }

  toggleExperienceTextBox(experience: number): void {
    if (experience === 1) {
      this.hideExperienceTextBox = false;
    } else {
      this.hideExperienceTextBox = true;
    }
  }

  counter(i: number) {
    return new Array(i);
}


// ngAfterViewInit(){
//   $(document).ready(function(){
//     $("#tags").autocomplete({
//       source: this.cities
//     });
//   });
// }

}
