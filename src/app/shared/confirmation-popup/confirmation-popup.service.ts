import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class ConfirmationPopupService {
  constructor() {}

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
