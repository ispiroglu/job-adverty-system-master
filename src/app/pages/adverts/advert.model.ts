import { User } from "../user/user.model";

export class Advert {
  constructor(
    public id: number,
    public name: string,
    public summary: string,
    public startDate: string,
    public endDate: string,
    public position: string,
    public capacity: number,
    public applications: number,
    public district: string,
    public province: string,
    public jobDefinition: string,
    public isOpen: boolean,
    public photoUrl: string,
    public companyName: string,
    public department: string,
    public applicants: User[]
  ) {}
}
