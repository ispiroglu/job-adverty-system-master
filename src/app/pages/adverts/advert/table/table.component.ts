import { Component, Input, OnInit, ViewEncapsulation } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import * as XLSX from "xlsx";
import { UserModal } from "../advert-modal/advert-modal.component";
import { AdvertService } from "../advert.service";
import {DataService} from '../../../../shared/http/data.service';
import {TableUserInfoModel} from './model/table-user-info.model';
import {User} from '../../../user/shared/model/user.model';

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
  applicants: TableUserInfoModel[];

  constructor(
    private modalService: NgbModal,
    private advertService: AdvertService,
    private dataService: DataService
  ) {}
  ngOnInit() {
    // this.applicants = this.advertService.getAdvert(this.advertID).applicants; // Mock
    this.dataService.get<TableUserInfoModel[]>(`http://localhost:8080/api/v1/adverts/${this.advertID}/applications`)
      .subscribe( (response) => {
        console.log(response)
        this.applicants = response.body
      })
  }
  onClickApplicant(applicant: TableUserInfoModel) {
    const modalRef = this.modalService.open(UserModal, {
      size: "xl",
      scrollable: true,
      backdropClass: "modal-index",
    });
    modalRef.componentInstance.inModal = {id: applicant.id};
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
