import {ApplicationStatus} from '../../../../../shared/application/application-status.model';

export class UpdateApplicationStatusModel {
  constructor(
    public userId: number,
    public newStatus: ApplicationStatus
  ) {}
}
