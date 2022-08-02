export class AdvertCardModel {
  constructor(
    private id: number,
    private image: Blob,
    private advertName: string,
    private position: string,
    private summary: string,
    private location: string
  ) {}
}
