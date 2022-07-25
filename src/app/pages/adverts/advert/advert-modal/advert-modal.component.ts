import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "app/pages/user/user.model";
import { UserService } from "app/pages/user/user.service";
import { AdvertService } from "../advert.service";

@Component({
  selector: "app-advert-modal",
  templateUrl: "./advert-modal.component.html",
  styleUrls: ["./advert-modal.component.scss"],
  styles: [``],

  encapsulation: ViewEncapsulation.None,
})
export class UserModal implements OnInit {
  @Input() inModal: boolean;
  @Input() applicant: User;
  @Input() advertID: number;

  constructor(
    private activeModal: NgbActiveModal,
    private userService: UserService,
    private advertService: AdvertService
  ) {}
  ngOnInit(): void {
    console.log(this.inModal);
    console.log(this.applicant);
  }

  onClickAccept() {
    this.userService.acceptUserApplication(this.applicant.id, this.advertID);
    this.advertService.removeApplicant(this.advertID, this.applicant);
    this.onClickCancel();
  }
  onClickReject() {
    this.userService.rejectUserApplication(this.applicant.id, this.advertID);
    this.advertService.removeApplicant(this.advertID, this.applicant);
    this.onClickCancel();
  }
  onClickCancel() {
    this.activeModal.dismiss();
  }
}
