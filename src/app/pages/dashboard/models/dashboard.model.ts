import { AdvertInfoModel } from "./advert-info.model";

export class DashboardModel {
  constructor(
    // public today: Date,
    public totalAdvertCount: number,
    public totalUserCount: number,
    public totalApplicationCount: number,
    public soonEndingAdverts: AdvertInfoModel[],
    public soonStartingAdverts: AdvertInfoModel[]
  ) {}
}
