export class TableUserInfoModel {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public email: string,
    public experience: number,
    public location: string,
  ) {}
}
