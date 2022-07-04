import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("game").where("LOWER(game.title) like LOWER(:title)", { title: `%${param}%` }).getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(1) AS COUNT FROM GAMES");
  }

  async findUsersByGameId(id: string): Promise<User[]> {

    const game = await this.repository.manager.findOne(Game, id);
    const users = await this.repository.createQueryBuilder()
      .relation(Game, "users")
      .of(game)
      .loadMany();

    return users;
  }
}
