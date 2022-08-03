export class AdvertCardModel {
  constructor(
    public id: number,
    public image: Blob,
    public imageURL: string,
    public advertName: string,
    public position: string,
    public summary: string,
    public location: string
  ) {}
}
