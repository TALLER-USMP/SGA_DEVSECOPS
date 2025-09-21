import { UserRepository } from "../repositories/user.repository";
import { verifyToken } from "../utils/VerifyToken";

export class AuthService {
  private userRepo = new UserRepository();

  async login(token: string) {
    const decoded = await verifyToken(token);

    if (!decoded?.oid || !decoded?.tid) {
      throw new Error("invalid Token: missing oid/tid");
    }

    const azureOid = decoded.oid;
    const tenantId = decoded.tid;
    const email = decoded.upn || decoded.unique_name;
    const displayName = decoded.name;

    // Buscar por OID + tenant
    let user = await this.userRepo.findByOidAndTenant(azureOid, tenantId);

    if (!user && email) {
      user = await this.userRepo.findByEmail(email);
      if (!user) {
        throw new Error("User not found with email");
      }
      await this.userRepo.updateOidAndTenant(user.id, azureOid, tenantId);
      console.log("Updated user with OID and Tenant");
    }

    // Actualizar último acceso
    if (!user) {
      throw new Error("User empty after checks");
    }
    await this.userRepo.updateLastAccess(user.id);

    return {
      ...user,
      azureOid,
      tenantId,
      displayName,
    };
  }
}
