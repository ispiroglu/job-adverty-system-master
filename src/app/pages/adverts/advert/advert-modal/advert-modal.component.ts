import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  NgbModal,
  ModalDismissReasons,
  NgbActiveModal,
} from "@ng-bootstrap/ng-bootstrap";
import { User } from "app/pages/user/user.model";

@Component({
  selector: "app-advert-modal",
  templateUrl: "./advert-modal.component.html",
  styleUrls: ["./advert-modal.component.scss"],
  styles: [``],

  encapsulation: ViewEncapsulation.None,
})
export class UserModal implements OnInit {
  @ViewChild("modalDialogue") modalDialogue: ElementRef;
  @Input() inModal: boolean;
  @Input() user: User;

  @Output()
  clickOutside: EventEmitter<Event> = new EventEmitter<Event>();

  constructor(private activeModal: NgbActiveModal) {}
  ngOnInit(): void {
    console.log(this.inModal);
    console.log(this.user);
  }

  onClickAccept() {}
  onClickReject() {}
  onClickCancel() {
    this.activeModal.dismiss();
  }
}
