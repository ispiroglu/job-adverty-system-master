import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class ConfirmationPopupService {
  constructor(private modalService: NgbModal) {}

  confirm(title: string, fn: Function) {
    Swal.fire({
      title: title,
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      denyButtonText: "No",
    }).then((resp) => {
      if (resp.isConfirmed) {
        Promise.resolve(fn());
      }
    });
  }
}
