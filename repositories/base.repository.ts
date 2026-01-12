//<T> is a generic type parameter, meaning this repository can work with any type
//of entity (like User, Post, etc.).
//This BaseRepository class is a generic CRUD (Create, Read, Update, Delete) repository
// that can be reused for any database model. By passing a specific model when instantiating it,
// you automatically get methods
export class BaseRepository<T> {
  constructor(protected readonly model: any) {}

  async findById(id: number): Promise<T | null> {
    return this.model.findUnique({ where: { id } });
  }

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async create(data: any): Promise<T> {
    return this.model.create({ data });
  }

  async update(id: number, data: any): Promise<T> {
    return this.model.update({ where: { id }, data });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({ where: { id } });
  }
}
