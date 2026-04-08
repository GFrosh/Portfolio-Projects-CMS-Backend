import { AuthUser } from "./Auth.js";

export interface ResponseObject {
    success: boolean;
    message: string;
    error?: any;
    user?: AuthUser | null;
    data?: object | any[];
}
