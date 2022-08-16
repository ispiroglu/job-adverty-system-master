import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";
import { UserModal } from "../advert-modal/advert-modal.component";
import { DataService } from "../../../../shared/http/data.service";
import { TableUserInfoModel } from "./model/table-user-info.model";
import { Subscription } from "rxjs";

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
export class TableComponent implements OnInit, OnDestroy {
  closeResult = "";
  @Input() advertID: number;
  applicants: TableUserInfoModel[];
  private modalRef: NgbModalRef;
  private modalSub: Subscription;

  constructor(
    private modalService: NgbModal,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.dataService
      .get<TableUserInfoModel[]>(
        `http://localhost:8080/api/v1/adverts/${this.advertID}/applications`
      )
      .subscribe((response) => {
        this.applicants = response.body;
      });
  }
  onClickApplicant(applicant: TableUserInfoModel) {
    this.modalRef = this.modalService.open(UserModal, {
      size: "xl",
      scrollable: true,
      backdropClass: "modal-index",
    });
    this.modalRef.componentInstance.inModal = { id: applicant.id };
    this.modalRef.componentInstance.advertID = this.advertID;
    this.modalSub = this.modalRef.componentInstance.tableChanged.subscribe(
      () => {
        console.log("NEXT");

        this.dataService
          .get<TableUserInfoModel[]>(
            `http://localhost:8080/api/v1/adverts/${this.advertID}/applications`
          )
          .subscribe((response) => {
            console.log("NEW TABLE");

            this.applicants = response.body;
            console.log(this.applicants);
          });
      }
    );
  }
  onClickExcelOutput() {
    const element = document.getElementById("table");
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Advert ${this.advertID} Applicants`);
    XLSX.writeFile(wb, `advert-${this.advertID}-applicants.xlsx`);
  }
  ngOnDestroy(): void {
    this.modalSub?.unsubscribe();
  }
}
