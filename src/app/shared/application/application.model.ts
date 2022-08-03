export enum AdvertStatus {
  REJECT = "REJECT",
  ACCEPT = "ACCEPT",
  PENDING = "PENDING",
}
export class ApplicationDetail {
  constructor(public AdvertId: number, public status: AdvertStatus) {}
}
