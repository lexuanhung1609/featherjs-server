import * as feathersAuthentication from '@feathersjs/authentication';
import * as local from '@feathersjs/authentication-local';
import { HookContext } from '@feathersjs/feathers';
import { NotAcceptable } from '@feathersjs/errors';
// Don't remove this comment. It's needed to format import lines nicely.

const { authenticate } = feathersAuthentication.hooks;
const { hashPassword, protect } = local.hooks;

const omitUpdateEmail = async (context: HookContext) => {
  if (context.method === 'patch' && context.data.hasOwnProperty('email')) {
    throw new NotAcceptable('email can not be modified');
  }
  const user = await context.app.service('users').get(context.id);
  if (context.method === 'update' && user.email !== context.data.email) {
    throw new NotAcceptable('email can not be modified');
  }
  return context;
};

const findUser = async (context: HookContext) => {
  const Posts = context.app.services.posts.Model;
  context.params.sequelize = {
    include: [{ model: Posts }],
  };
};

export default {
  before: {
    all: [],
    find: [authenticate('jwt'), findUser],
    get: [authenticate('jwt')],
    create: [hashPassword('password')],
    update: [omitUpdateEmail, hashPassword('password'), authenticate('jwt')],
    patch: [omitUpdateEmail, hashPassword('password'), authenticate('jwt')],
    remove: [authenticate('jwt')],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      protect('password'),
    ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
