import { UserType } from "../enums/UserType"

export interface UserModel {
    id: string
    first_name: string
    last_name: string
    email: string
    username: string
    type: UserType
    status: string
}