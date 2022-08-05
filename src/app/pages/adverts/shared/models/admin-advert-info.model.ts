import { User } from "app/pages/user/shared/model/user.model";

export class AdminAdvertInfo {
  constructor(
    public id: number,
    public name: string,
    public summary: string,
    public startDate: string,
    public endDate: string,
    public position: string,
    public capacity: number,
    public district: string,
    public province: string,
    public provinceID: number,
    public jobDefinition: string,
    public active: boolean,
    public companyName: string,
    public department: string
  ) {}
}
