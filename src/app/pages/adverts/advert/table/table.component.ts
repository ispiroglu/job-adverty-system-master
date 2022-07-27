import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { User } from "app/pages/user/user.model";
import { UserService } from "app/pages/user/user.service";
import * as XLSX from "xlsx";
import { UserModal } from "../advert-modal/advert-modal.component";
import { AdvertService } from "../advert.service";

@Component({
  selector: "table-cmp",
  moduleId: module.id,
  templateUrl: "table.component.html",
  styles: [
    `
      tr:hover {
        background-color: Rgb(230, 230, 230);
      }
      .modal-backdrop.modal-index {
        z-index: 1031 !important;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class TableComponent implements OnInit {
  closeResult = "";
  @Input() advertID: number;
  applicants: User[];

  constructor(
    private modalService: NgbModal,
    private advertService: AdvertService
  ) {}
  ngOnInit() {
    this.applicants = this.advertService.getAdvert(this.advertID).applicants; // Mock
  }
  onClickApplicant(applicant: User) {
    const modalRef = this.modalService.open(UserModal, {
      size: "xl",
      scrollable: true,
      backdropClass: "modal-index",
    });
    modalRef.componentInstance.applicant = applicant;
    modalRef.componentInstance.inModal = true;
    modalRef.componentInstance.advertID = this.advertID;
  }
  onClickExcelOutput() {
    const element = document.getElementById("table");

    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Advert ${this.advertID} Applicants`);

    XLSX.writeFile(wb, `advert-${this.advertID}-applicants.xlsx`);
  }
}
