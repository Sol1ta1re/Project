import { Strategy } from "passport-jwt";
import { UserRole } from "../../users/entities/user.entity";
import { AuthUser } from "../types/auth-user";
type JwtPayload = {
    sub: number;
    email: string;
    role: UserRole;
};
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    constructor();
    validate(payload: JwtPayload): AuthUser;
}
export {};
