import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { AdvertService } from "app/adverts/advert.service";
import { UserComponent } from "app/pages/user/user.component";
import { User } from "app/pages/user/user.model";
import { UserService } from "app/pages/user/user.service";
import * as XLSX from "xlsx";
import { UserModal } from "../advert-modal/advert-modal.component";

@Component({
  selector: "table-cmp",
  moduleId: module.id,
  templateUrl: "table.component.html",
  styles: [
    `
      tr:hover {
        background-color: Rgb(230, 230, 230);
      }
      .modal-backdrop {
        display: none;
      }
    `,
  ],
})
export class TableComponent implements OnInit {
  closeResult = "";
  @Input() advertID: number;
  applicants: User[];

  constructor(
    private modalService: NgbModal,
    private userService: UserService
  ) {}
  ngOnInit() {
    this.applicants = this.userService.getUsers(); // Mock
  }
  onClickApplicant(applicant: User) {
    this.modalService
      .open(UserModal, { size: "xl", scrollable: true })
      .result.then((result) => {
        console.log(result);
      });
  }
  onClickExcelOutput() {
    let element = document.getElementById("table");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Advert ${this.advertID} Applicants`);

    XLSX.writeFile(wb, `advert-${this.advertID}-applicants.xlsx`);
  }

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
