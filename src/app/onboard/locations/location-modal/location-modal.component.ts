import { Component, Output } from '@angular/core';

import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';

import { AccountService } from '../../../core/services/index';

export class LocationModalContext extends BSModalContext {
  // public num1: number;
  // public num2: number;
}

/**
 * A Sample of how simple it is to create a new window, with its own injects.
 */
@Component({
  selector: 'app-location-modal',
  //TODO: [ngClass] here on purpose, no real use, just to show how to workaround ng2 issue #4330.
  // Remove when solved.
  /* tslint:disable */
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModal implements CloseGuard, ModalComponent<LocationModalContext> {
  context: LocationModalContext;
  location = {};
  selectedType = '';
  selectedState = '';
  stateArr = {};
  typeArr = {};
  typeDirty: boolean = false;
  stateDirty: boolean = false;

  uploadedImage;
  fileIsOver: boolean = false;
  options = {
    readAs: 'DataURL'
  };

  constructor(
      public dialog: DialogRef<LocationModalContext>,
      private accountService: AccountService
  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.accountService.getStates().subscribe((res: any) => {
      this.stateArr = res.data; 
      console.log(this.stateArr);
    });
  }

  closeModal(){
    this.dialog.close();
  }

  // beforeDismiss(): boolean {
  //   return true;
  // }
  //
  // beforeClose(): boolean {
  //   return true;
  // }

  changeState(){
    this.stateDirty = true;
  }

  changeType(){
    this.typeDirty = true;
  }

  // upload by input type=file
  changeListener($event) : void {
    this.readThis($event.target);
  }

  readThis(inputValue: any): void {
    var file:File = inputValue.files[0];
    var myReader:FileReader = new FileReader();

    myReader.onloadend = (e) => {
      this.uploadedImage = myReader.result;
    };
    myReader.readAsDataURL(file);
  }

  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }

  onFileDrop(file: File): void {
    this.uploadedImage = file;
  }
}
