export enum AdvertStatus {
  Reject = "Rejected",
  Accept = "Accepted",
  Pending = "Pending",
}
export class ApplicationDetail {
  constructor(public AdvertId: number, public status: AdvertStatus) {}
}
