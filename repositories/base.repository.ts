//<T> is a generic type parameter, meaning this repository can work with any type
//of entity (like User, Product, discount etc.).
//This BaseRepository class is a generic CRUD (Create, Read, Update, Delete) repository
// that can be reused for any database model. By passing a specific model when instantiating it,
// you automatically get methods
export class BaseRepository<T> {
  //Runs when a new instance of the repository is created.
  //The ORM model (e.g. prisma.user, prisma.product) any is used because ORM models often have complex types
  constructor(protected readonly model: any) {} //

  //Returns a Promise that resolves to: T - entity found null - entity not found
  async findById(id: number): Promise<T | null> {
    //SELECT * FROM table WHERE id = ?;
    return this.model.findUnique({ where: { id } });
  }

  //Returns an empty array [] if no records exist
  //SELECT * FROM table;
  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  //Returns an array of type T
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
