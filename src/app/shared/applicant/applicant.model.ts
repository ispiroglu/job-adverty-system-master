export class Applicant {
  constructor(
    public name: string,
    public surname: string,
    public gender: string,
    public email: string,
    public phoneNumber: string,
    public birthDate: string,
    public graduation: string,
    public citizenID: string,
    public province: string,
    public district: string,
    public experience: number,
    public aboutUser: string
  ) {}
}
