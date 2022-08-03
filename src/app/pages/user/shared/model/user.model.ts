import { ApplicationDetail } from "app/shared/application/application.model";

export class User {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public gender: string,
    public email: string,
    public phoneNumber: string,
    public province: string,
    public provinceID: number,
    public district: string,
    public experience: number,
    public aboutUser: string,
    public applicationsDetails: ApplicationDetail[]
  ) {}
}
