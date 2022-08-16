export class FileCredentialsModel {
  constructor(
    public type: string,
    public ID: number,
    public requiredFileType: string,
    public caption: string,
  ) {}
}
