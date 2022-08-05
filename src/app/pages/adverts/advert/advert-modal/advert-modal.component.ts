import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/pages/user/shared/model/user.model';
import {DataService} from '../../../../shared/http/data.service';
import {UpdateApplicationStatusModel} from './model/update-application-status.model';
import {AdvertStatus} from '../../../../shared/application/application.model';

@Component({
  selector: "app-advert-modal",
  templateUrl: "./advert-modal.component.html",
  styleUrls: ["./advert-modal.component.scss"],
  styles: [``],

  encapsulation: ViewEncapsulation.None,
})
export class UserModal implements OnInit {
  @Input() inModal;
  applicant: User;
  @Input() advertID: number;
  @Output() tableChanged = new EventEmitter<any>();

  constructor(
    private activeModal: NgbActiveModal,
    private dataService: DataService,
  ) {}
  ngOnInit(): void {}

  onClickAccept() {
    const request = new UpdateApplicationStatusModel(
      this.inModal.id, AdvertStatus.ACCEPT
    )
    this.dataService.update<UpdateApplicationStatusModel>(request, `http://localhost:8080/api/v1/adverts/${this.advertID}/applications`)
      .subscribe((response) => {
        console.log(response)
      })
    this.tableChanged.next({});
    this.onClickCancel();
  }
  onClickReject() {
    const request = new UpdateApplicationStatusModel(
      this.inModal.id, AdvertStatus.REJECT
    )
    this.dataService.update<UpdateApplicationStatusModel>(request, `http://localhost:8080/api/v1/adverts/${this.advertID}/applications`)
      .subscribe((response) => {
        console.log(response)
      })
    this.tableChanged.next({});
    this.onClickCancel();
  }
  onClickCancel() {
    this.activeModal.dismiss();
  }
}
