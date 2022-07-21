import { Component, Input, OnInit } from "@angular/core";
import { Applicant } from "app/shared/applicant/applicant.model";

@Component({
  selector: "table-cmp",
  moduleId: module.id,
  templateUrl: "table.component.html",
})
export class TableComponent implements OnInit {
  @Input() advertID;
  applicants: Applicant[];

  constructor() {}
  ngOnInit() {}
}
