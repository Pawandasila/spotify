import type { UserDocument } from "../models/user.models.ts";


declare global {
    namespace Express {
        interface User extends UserDocument {
            _id: any;
            id : string;
        }
    }
}