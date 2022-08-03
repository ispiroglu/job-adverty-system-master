import {AdvertStatus} from '../../../shared/application/application.model';

export class ApplicationTableInfoModel {
  constructor(
  public name: String,
  public position: String,
  public summary: String,
  public location: String,
  public status: AdvertStatus,
  ) {}
}
