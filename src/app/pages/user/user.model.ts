export class User {
  constructor(
    public id: number,
    public firstname: string,
    public lastname: string,
    public gender: string,
    public email: string,
    public phoneNumber: string,
    public province: string,
    public district: string,
    public experience: number,
    public aboutUser: string
  ) {}
}
