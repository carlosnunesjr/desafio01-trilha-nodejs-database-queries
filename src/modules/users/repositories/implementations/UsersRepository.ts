import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const user = await this.repository.findOne(user_id, { relations: ["games"] });
    return user!;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT FIRST_NAME, LAST_NAME, EMAIL FROM USERS ORDER BY FIRST_NAME", []);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query("SELECT FIRST_NAME, LAST_NAME, EMAIL FROM USERS WHERE LOWER(FIRST_NAME) = LOWER($1) AND LOWER(LAST_NAME) = LOWER($2) ORDER BY FIRST_NAME", [first_name, last_name]);
  }
}
