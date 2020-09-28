export default abstract class Service<T> {
  /**
   * Creates a new object of type T and gets an ID for this object from indexed DB. Use this for the creation of new objects!
   * Returns a promise for the created object.
   */
  abstract async create(): Promise<T>;

  /**
   * Saves the changes of the given object into the database. Object must have an ID! This can be achieved by creating
   * it with create() or by loading it from the database (loadByID(), loadAll())
   * @param object the object to save
   */
  abstract async save(object: T): Promise<number>;

  /**
   * Loads an object of type T with a given ID from the database. The returned promise contains undefined, if the object
   * was not found.
   * @param id ID to search for
   */
  abstract async loadByID(id: number): Promise<T | undefined>;

  /**
   * Loads all Objects of type T from the database. Returns a promise for an Array<T>
   */
  abstract async loadAll(): Promise<Array<T>>;

  /**
   * Loads all attributes that are other objects. Behaves differently from service to service. Does not return anything.
   * @param object
   */
  abstract async loadNavigationProperties(object: T);

  /**
   * Deletes the object with the key id from the database, if it exists.
   * @param id Key of the object to delete.
   */
  abstract async delete(id: number): Promise<void>;

  /**
   * Deletes the given object from the database, if it is persisted.
   * @param object
   */
  abstract async delete(object: T): Promise<void>;
}
