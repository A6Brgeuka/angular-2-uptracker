import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DialogRef, ModalComponent, CloseGuard } from 'angular2-modal';
import { BSModalContext } from 'angular2-modal/plugins/bootstrap';
import { DestroySubscribers } from 'ng2-destroy-subscribers';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { FileUploadService } from '../../../../../core/services/file-upload.service';

export class AttachmentUploadModel {
  file_name: string;
  s3_object: string;
  id: string;
  ts: string;
  uri: string;
  type: string;
}

export class EditEmailDataModalContext extends BSModalContext {
  public email_text: string;
  public po_number: string;
  public user_email: string;
  public vendor_email: string;
  public order_id: string;
}

@Component({
  selector: 'edit-email-data-modal',
  templateUrl: './edit-email-data-modal.component.html',
  styleUrls: ['./edit-email-data-modal.component.scss']
})
@DestroySubscribers()
export class EditEmailDataModal implements OnInit, AfterViewInit, CloseGuard, ModalComponent<EditEmailDataModalContext> {
  public subscribers: any = {};
  context: EditEmailDataModalContext;

  fileIsOver: boolean = false;
  
  public file$: Observable<any>;
  public file;
  public loadFile$: Subject<any> = new Subject<any>();
  public addFileToFile$: Subject<any> = new Subject<any>();
  public deleteFromFile$: Subject<any> = new Subject<any>();
  public updateFile$: Subject<any> = new Subject<any>();
  
  public formData: FormData = new FormData();

  public emailTo:string;
  public emailFrom:string;
  public emailSubject:string;
  public emailMessage:string;
  public hasDocs: boolean;
  public hasFiles: boolean;
  public uploaded: any[] = [];
  
  constructor(
      public dialog: DialogRef<EditEmailDataModalContext>,
      public fileUploadService: FileUploadService,

  ) {
    this.context = dialog.context;
    dialog.setCloseGuard(this);
    this.emailMessage = this.context.email_text;
    this.emailFrom = this.context.user_email;
    this.emailTo = this.context.vendor_email;
    this.emailSubject = "Purchase order #"+this.context.po_number;
    this.fileActions();
  
  }

  ngOnInit(){
    this.loadFile$.next([]);
  }

  ngAfterViewInit(){
  }
  
  
  // File load, add, delete actions
  fileActions(): any {
    let addFileToFile$ = this.addFileToFile$
    .switchMap((res) => {
      
      return this.file$.first()
      .map((file: any) => {
        
        file = file.concat(res);
        return file;
      });
    });
    
    let deleteFromFile$ = this.deleteFromFile$
    .switchMap((deleteFile) => {
      this.file$.subscribe((res) => {
        console.log('Model Service delete from file ' + res);
      });
      return this.file$.first()
      .map((file: any) => {
        return file.filter((el: any) => {
          return el.name != deleteFile.name;
        });
      });
    });
    this.file$ = Observable.merge(
      this.loadFile$,
      this.updateFile$,
      addFileToFile$,
      deleteFromFile$
    ).publishReplay(1).refCount();
    this.file$.subscribe(res => {
      this.file = res;
      this.hasFiles = res.length > 0;
    });
    
    this.addFileToFile$
    .switchMap((file:File)=>this.fileUploadService.uploadAttachment(this.context.order_id,file[0]))
    .subscribe((info:AttachmentUploadModel)=>{
      this.uploaded.push(info);
      console.log('uploaded files',this.uploaded);
    })
  }
  
  
  
  dismissModal(){
    this.dialog.dismiss();
  }

  closeModal(data){
    this.dialog.close(data);
  }
  
  
  // upload by filedrop
  fileOver(fileIsOver: boolean): void {
    this.fileIsOver = fileIsOver;
  }
  
  onFileDrop(file: any): void {
    let myReader: any = new FileReader();
    myReader.fileName = file.name;
    this.addFile(file);
  }
  
  onFileUpload(event) {
    this.onFileDrop(event.target.files[0]);
  }
  
  addFile(file) {
    this.addFileToFile$.next([file]);
  }
  
  removeFile(file) {
    console.log(`remove ${file.name}`);
    this.deleteFromFile$.next(file);
  }
  
  
  
}
