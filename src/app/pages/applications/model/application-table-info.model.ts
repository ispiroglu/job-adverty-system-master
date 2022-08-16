import {ApplicationStatus} from '../../../shared/application/application-status.model';

export class ApplicationTableInfoModel {
  constructor(
  public name: String,
  public position: String,
  public summary: String,
  public location: String,
  public status: ApplicationStatus,
  ) {}
}
