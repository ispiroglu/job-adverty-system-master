import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {FileUploadService} from '../file-upload.service';
import {finalize, Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

  fileName = '';
  @Input() uploadCredentials: {type: string, ID: number, requiredFileType: string, caption: string}
  // @Input() requiredFileType: string;
  // @Input() userID: number;
  // @Input() caption: string;
  @Output() changed = new EventEmitter<string>();

  uploadProgress: number;
  uploadSub: Subscription;

  constructor(private fileService: FileUploadService) {
  }
  ngOnInit(): void {}

  onFileSelected(event) {

    const file: File = event.target.files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("file", file);

      switch (this.uploadCredentials.type) {
        case ("user"):
          switch (this.uploadCredentials.caption) {
            case ("photo"):
              this.fileService.uploadUserProfile(this.uploadCredentials.ID, formData)
                .pipe(
                  finalize(() => this.reset())
                )
                .subscribe((event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                  }
                });
              break;
            case ("cv"):
              this.fileService.uploadUserCv(this.uploadCredentials.ID, formData)
                .pipe(
                  finalize(() => this.reset())
                )
                .subscribe((event) => {
                  if (event.type === HttpEventType.UploadProgress) {
                    this.uploadProgress = Math.round(100 * (event.loaded / event.total));
                  }
                });
              break;
          }
          break;
        case ("advert"):
          this.fileService.uploadAdvertPhoto(this.uploadCredentials.ID, formData)
            .pipe(
              finalize(() => this.reset())
            )
            .subscribe((event) => {
              if (event.type === HttpEventType.UploadProgress) {
                this.uploadProgress = Math.round(100 * (event.loaded / event.total));
              }
            });
      }

    }
  }

  private reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    this.changed.next(this.uploadCredentials.caption);
  }
}
