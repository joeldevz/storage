import { Provider } from '@nestjs/common';
import { Connection, getCustomRepository, ObjectType } from 'typeorm';

export function getTypeOrmRepository(
  repositoryToken: string,
  implementationClass: ObjectType<any>,
): Provider {
  return {
    provide: repositoryToken,
    useFactory: (connection: Connection) => {
      return getCustomRepository(implementationClass, 'asdasd');
    },
    inject: [Connection],
  };
}
