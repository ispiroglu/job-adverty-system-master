import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  NgbActiveModal,
  ModalDismissReasons,
  NgbModal,
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-advert-modal",
  templateUrl: "./advert-modal.component.html",
  styleUrls: ["./advert-modal.component.scss"],
  styles: [
    `
      .dark-modal .modal-content {
        background-color: #292b2c;
        color: white;
      }
      .dark-modal .close {
        color: white;
      }
      .modal-backdrop {
        display: none;
      }
      .light-blue-backdrop {
        background-color: #5cb3fd;
      }
    `,
  ],
})
export class UserModal {
  closeResult = "";
  constructor(public modalService: NgbModal) {}

  open(content) {
    this.modalService
      .open(content, { ariaLabelledBy: "modal-basic-title" })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }
}
