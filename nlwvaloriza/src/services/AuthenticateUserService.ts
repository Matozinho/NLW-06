import { getCustomRepository } from "typeorm"
import { UsersRepositories } from "../repositories/UsersRepositories"
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import {Subject} from "typeorm/persistence/Subject";

interface IAuthenticateRequest { 
  email: string;
  password: string;
}

class AuthenticateUserService {
  async execute({ email, password }: IAuthenticateRequest) {
    const usersRepositories = getCustomRepository(UsersRepositories);
    const user = await usersRepositories.findOne({ email });

    if (!user)
      throw new Error("Email/Password incorrect");

    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch)
      throw new Error("Email/Password incorrect");

    const token = sign(
      { email: user.email }, 
      "81da3c321c6b72af2b29fe23e5c2c288",
      { subject: user.id, expiresIn: "1d" }
    );

    return token;
  }
}

export { AuthenticateUserService }
