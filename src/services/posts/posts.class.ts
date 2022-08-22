import { Service, SequelizeServiceOptions } from 'feathers-sequelize';
import { Application } from '../../declarations';
import createApplication from '@feathersjs/feathers';

export class Posts extends Service {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<SequelizeServiceOptions>, private app: Application) {
    super(options);
  }

  async find(
    params?: createApplication.Params
  ): Promise<any[] | createApplication.Paginated<any>> {
    console.log('hihih');
    return await this.app.services.users.find({
      $select: 'email',
      include: { model: this.app.services.posts.Model },
    });
  }
}
