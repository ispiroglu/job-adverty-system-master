import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { HttpClient, HttpEventType } from "@angular/common/http";
import { FileUploadService } from "../file-upload.service";
import { finalize, Subject, Subscription } from "rxjs";
import { ErrorPopupService } from "app/shared/error-popup/error-popup.service";

@Component({
  selector: "app-file-upload",
  templateUrl: "./file-upload.component.html",
  styleUrls: ["./file-upload.component.scss"],
})
export class FileUploadComponent implements OnInit {
  fileName = "";
  @Input() uploadCredentials: {
    type: string;
    ID: number;
    requiredFileType: string;
    caption: string;
  };
  @Input() sendRequestSubject: Subject<number>;
  @Output() changed = new EventEmitter<string>();
  @Output() cachedFile = new EventEmitter<{ url: string; type: string }>();

  uploadProgress: number;
  uploadSub: Subscription;
  formData: FormData;

  constructor(
    private fileService: FileUploadService,
    private errorPopupService: ErrorPopupService
  ) {}
  ngOnInit(): void {
    this.sendRequestSubject.subscribe((id: number) => {
      if (id) {
        this.uploadCredentials.ID = id;
      }
      if (this.formData) {
        this.sendRequest();
      }
    });
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];

    if (file) {
      if (file.size > 11026764) {
        this.errorPopupService.alert(
          "Cannot Upload this file. File size is to big. Max File size is 10 MB!"
        );
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.cachedFile.next({
          url: reader.result as string,
          type: this.uploadCredentials.caption,
        });
      };
      this.fileName = file.name;
      this.formData = new FormData();
      this.formData.append("file", file);
    }
  }

  sendRequest() {
    switch (this.uploadCredentials.type) {
      case "user":
        switch (this.uploadCredentials.caption) {
          case "photo":
            this.fileService
              .uploadUserProfile(this.uploadCredentials.ID, this.formData)
              .pipe(finalize(() => this.reset()))
              .subscribe((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.uploadProgress = Math.round(
                    100 * (event.loaded / event.total)
                  );
                }
              });
            break;
          case "cv":
            this.fileService
              .uploadUserCv(this.uploadCredentials.ID, this.formData)
              .pipe(finalize(() => this.reset()))
              .subscribe((event) => {
                if (event.type === HttpEventType.UploadProgress) {
                  this.uploadProgress = Math.round(
                    100 * (event.loaded / event.total)
                  );
                }
              });
            break;
        }
        break;
      case "advert":
        this.fileService
          .uploadAdvertPhoto(this.uploadCredentials.ID, this.formData)
          .pipe(finalize(() => this.reset()))
          .subscribe((event) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.uploadProgress = Math.round(
                100 * (event.loaded / event.total)
              );
            }
          });
    }
  }

  private reset() {
    this.uploadProgress = null;
    this.uploadSub = null;
    this.changed.next(this.uploadCredentials.caption);
  }
}
