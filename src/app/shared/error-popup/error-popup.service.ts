import { Injectable } from "@angular/core";
import Swal from "sweetalert2";

@Injectable({
  providedIn: "root",
})
export class ErrorPopupService {
  constructor() {}

  alert(text: string) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: text,
    });
  }
}
