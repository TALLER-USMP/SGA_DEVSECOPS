import { eq } from "drizzle-orm";
import { getDb } from "../db/index";
import { usuarioAutorizado } from "../../drizzle/schema";

export class UserRepository {
  private db = getDb();

  async findByEmail(email: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .select()
      .from(usuarioAutorizado)
      .where(eq(usuarioAutorizado.correo, email));

    return result.length ? result[0] : null;
  }

  async findById(id: string) {
    if (!this.db) {
      throw new Error("Database connection is not initialized.");
    }
    const result = await this.db
      .select()
      .from(usuarioAutorizado)
      .where(eq(usuarioAutorizado.id, Number(id)));

    return result.length ? result[0] : null;
  }
}
