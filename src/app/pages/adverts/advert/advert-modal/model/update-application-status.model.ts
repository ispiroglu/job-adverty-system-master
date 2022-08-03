import {AdvertStatus} from '../../../../../shared/application/application.model';

export class UpdateApplicationStatusModel {
  constructor(
    public userId: number,
    public newStatus: AdvertStatus
  ) {}
}
