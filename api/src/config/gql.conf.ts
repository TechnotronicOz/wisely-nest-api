import { AuthModule } from '../auth/auth.module';
import env from './env.conf';

export default {
  debug: env.isDevelopment,
  autoSchemaFile: env.isDevelopment,
  context: AuthModule.GraphQLModuleContext,
  playground: env.isDevelopment,
};
