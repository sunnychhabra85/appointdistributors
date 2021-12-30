import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomValidators } from 'src/app/shared/custom.validators';
import { RegistrationDto } from 'src/app/models/registration.model';
import {UserRegisterDto} from 'src/app/models/userRegister.model';
import { RegistrationService } from 'src/app/services/registration.service';
import { LocationDto } from 'src/app/models/location.model';
import { MasterDataService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  distributorshipType: string;
  registrationDto: RegistrationDto;
  userRegisterDto:UserRegisterDto;
  selectedStates: LocationDto[] = [];
  cities: LocationDto[] = [];
  selectedCities: LocationDto[] = [];
  locationMultiSelectSettings = {};
  allLocations: LocationDto[] = [];
  states: LocationDto[] = [];
  changeType:string;
  

  constructor(
    private _formBuilder: FormBuilder,
    private _spinnerService: NgxSpinnerService,
    private _router: Router,
    private _toastr: ToastrService,
    private _masterDataService: MasterDataService,
    private _registrationService: RegistrationService) {
    this.registrationDto = this._registrationService.registrationDto;
    this.userRegisterDto = this._registrationService.userRegisterDto;
  }

  registrationForm: FormGroup;
  formCompanyDtails: FormGroup;
  // This object will hold the messages to be displayed to the user
  // Notice, each key in this object has the same name as the
  // corresponding form control
  formErrors = {
    name: '',
    mobileNumber: '',
    email: '',
    password: '',
    confirmPassword: '',
    passwordGroup: '',
    companyName: '',
    address: '',
    distributorshipType:''
    // postalCode: '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {
    name: {
      required: 'Name is required.',
      startingWithEmptySpace: 'You cannot start name with empty spaces.',
      minlength: 'Name should at least have 2 characters.',
      maxlength: 'Name cannot have more than 50 characters.',
    },
    mobileNumber: {
      required: 'Mobile number is required.',
      minlength: 'Mobile number should have 10 characters.',
      maxlength: 'Mobile number should have 10 characters.',
      pattern: 'Only numbers are allowed.'
    },
    email: {
      required: 'Email is required.',
      startingWithEmptySpace: 'You cannot start description with empty spaces.',
      pattern: 'Please provide valid email address.'
    },
    password: {
      required: 'Password is required.',
      startingWithEmptySpace: 'You cannot start password text with empty spaces.',
      minlength: 'Password should have at least 4 characters.',
      maxlength: 'Password should not exceed more than 8 characters.'
    },
    confirmPassword: {
      required: 'Confirm password is required.',
      mustMatch: 'Password and confirm password must be same.'
    },
    companyName: {
      required: 'Company name is required.',
      startingWithEmptySpace: 'You cannot start company name with empty spaces.',
    },
    address: {
      required: 'Address is required.',
      startingWithEmptySpace: 'You cannot start address with empty spaces.',
    },
    distributorshipType: {
      required: 'Please select.',
    },
    // postalCode: {
    //   minlength: 'Postal code must have 6 digits.',
    //   maxlength: 'Postal code must have 6 digits.',
    //   pattern: 'Only numbers are allowed.'
    // },
  };

  ngOnInit(): void {
    this.loadMasterData();
    this.setupForm();

    this.registrationForm = this._formBuilder.group({
      name: [this.userRegisterDto.name, [Validators.required,
      CustomValidators.startingWithEmptySpace(),
      Validators.minLength(2),
      Validators.maxLength(50)]],
      mobileNumber: [this.userRegisterDto.mobileNumber, [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      email: [this.userRegisterDto.email, [Validators.required,
      CustomValidators.startingWithEmptySpace(),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      password: [this.userRegisterDto.password, [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(10),
      CustomValidators.startingWithEmptySpace()]],
      confirmPassword: ['', [Validators.required]],
      distributorshipType: ['', [Validators.required]],
    },
      {
        validator: CustomValidators.MustMatch('password', 'confirmPassword')
      });

    this.formCompanyDtails = this._formBuilder.group({
      companyName: [this.registrationDto.companyName, [Validators.required, CustomValidators.startingWithEmptySpace()]],
      website: [this.registrationDto.website],
      address: [this.registrationDto.address, [Validators.required, CustomValidators.startingWithEmptySpace()]],
      // postalCode: [this.registrationDto.postalCode, [Validators.minLength(6), Validators.maxLength(6), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      gstNo: [this.registrationDto.gstNo],

    });

    this.registrationForm.valueChanges.subscribe(
      (data) => {
        this.logValidationErrors(this.registrationForm);
        // Called when success
      },
      (error) => {
        // Called when error
      }
    ).add(() => {
      // Called when operation is complete (both success and error)
    });
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

  }

  loadMasterData() {
    this._masterDataService.getAllLocations().subscribe((data: LocationDto[]) => {
      this.allLocations = data;

      this.getAllStates(3);
      this.getAllCities(4);
    });

  }

  onCitySelect(item: any) {
    // this.selectedCities = item
  }
  onSelectAllCities(items: any) {
    // this.selectedCities = items
  }

  onStateSelect(item: any) {
    // this.selectedStates = item
  }
  onSelectAllStates(items: any) {
    this.selectedStates = items;
  }

  getAllStates(stateType) {
    this.states = this.allLocations.filter(x => x.distributorshipTypeId === stateType);
  }

  getAllCities(cityType) {
    this.cities = this.allLocations.filter(x => x.distributorshipTypeId === cityType);
  }


  logValidationErrors(group: FormGroup = this.registrationForm): void {
    // Loop through each control key in the FormGroup
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      } else {
        this.formErrors[key] = '';
        if (abstractControl && !abstractControl.valid
          && (abstractControl.touched || abstractControl.dirty)) {
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

  matchPasswords(group: AbstractControl): { [key: string]: any } | null {
    const passwordControl = group.get('password');
    const confirmPasswordControl = group.get('confirmPassword');

    if (passwordControl.value === confirmPasswordControl.value || confirmPasswordControl.pristine) {
      return null;
    } else {
      return { 'passwordMismatch': true };
    }
  }

  saveUserDetails() {
    this.registrationDto.name = this.registrationForm.value.name;
    this.registrationDto.mobileNumber = this.registrationForm.value.mobileNumber;
    this.registrationDto.email = this.registrationForm.value.email;
    this.registrationDto.password = this.registrationForm.value.password;    
  }


  saveUserData() {
    this.userRegisterDto.name = this.registrationForm.value.name;
    this.userRegisterDto.mobileNumber = this.registrationForm.value.mobileNumber;
    this.userRegisterDto.email = this.registrationForm.value.email;
    this.userRegisterDto.password = this.registrationForm.value.password;

    // console.log(JSON.stringify(this.userRegisterDto))

    this._registrationService.saveUserDetails(this._registrationService.userRegisterDto).subscribe((result: any) => {
      //this.handleSuccess(result);
      this.saveUserDetails();
    }, (error: any) => {
      //this.handleError(error);
    });
    
  }

  handleSuccess(resp: any): void {
    this._spinnerService.hide();
    // this._registrationService.registrationDto = null;
    // this.appointDistributorForm.reset();
    // alert('request callback submitted');
    this._toastr.success('Thanks for register your profile, Our team will contact you soon.', 'Success');
    //this._router.navigate(['home']);
  }

  handleError(error: any): void {
    // if (error.statusText === 'Bad Request' || error.status === 400) {
    //   alert(error.error);
    //   this._spinnerService.hide();
    // }
    console.log(error);
    if (error?.error.includes('User already regitered with email. Kindly try with different email Id')) {
      this._toastr.error('User already regitered with email. Kindly try with different email Id', 'Error');
    } else {
      this._toastr.error('Oops something went wrong !!! Please try again after sometime', 'Error');
    }
    this._spinnerService.hide();
  }

  saveCompanyDetails() {
    this.registrationDto.companyName = this.formCompanyDtails.value.companyName;
    this.registrationDto.website = this.formCompanyDtails.value.website;
    this.registrationDto.address = this.formCompanyDtails.value.address;
    // this.registrationDto.postalCode = this.formCompanyDtails.value.postalCode;
    this.registrationDto.gstNo = this.formCompanyDtails.value.gstNo;
    this.changeType = this.distributorshipType;
  }

  ondistributorshipTypeChanged(event) {
    this.distributorshipType = event.target.value;
  }

  
}
