import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {User} from 'app/pages/user/shared/model/user.model';
import {UserService} from 'app/pages/user/user.service';
import {AdvertService} from '../advert.service';
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

  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private advertService: AdvertService,
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
    this.onClickCancel();
  }
  onClickCancel() {
    this.activeModal.dismiss();
  }
}
