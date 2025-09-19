import { UserRepository } from "../repositories/user.repository";
import { verifyToken } from "../utils/VerifyToken"; // tu helper de JWT/Azure

export class AuthService {
  private userRepo = new UserRepository();

  async login(token: string) {
    const decoded = await verifyToken(token);

    if (!decoded?.upn) {
      throw new Error("Token inválido o sin email");
    }

    const user = await this.userRepo.findByEmail(decoded.upn);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    return {
      user,
    };
  }
}
