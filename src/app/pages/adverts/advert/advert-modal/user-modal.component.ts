import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation,} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/pages/user/shared/model/user.model';
import {DataService} from '../../../../shared/http/data.service';
import {UpdateApplicationStatusModel} from './model/update-application-status.model';
import {ApplicationStatus} from '../../../../shared/application/application-status.model';
import {LOCALHOST_ADVERTS} from '../../../../shared/config/advert-constants/advert-constants.constants';

@Component({
  selector: "app-advert-modal",
  templateUrl: "./user-modal.component.html",
  styleUrls: ["./user-modal.component.scss"],
  styles: [``],

  encapsulation: ViewEncapsulation.None,
})
export class UserModalComponent implements OnInit {
  @Input() inModal;
  @Input() advertID: number;
  @Output() tableChanged = new EventEmitter<any>();
  applicant: User;

  constructor(
    private activeModal: NgbActiveModal,
    private dataService: DataService
  ) {}
  ngOnInit(): void {}

  onClickAccept() {
    this.sendUpdateRequest(ApplicationStatus.ACCEPT)
    this.onClickCancel();
  }
  onClickReject() {
    this.sendUpdateRequest(ApplicationStatus.REJECT)
    this.onClickCancel();
  }
  onClickCancel() {
    this.activeModal.dismiss();
  }
  private sendUpdateRequest(status: ApplicationStatus) {
    const request = new UpdateApplicationStatusModel(
      this.inModal.id,
      status
    );
    this.dataService
      .update<UpdateApplicationStatusModel>(
        request,
        LOCALHOST_ADVERTS + `/${this.advertID}/applications`
      )
      .subscribe((response) => {
        this.tableChanged.next({});
      });
  }
}
