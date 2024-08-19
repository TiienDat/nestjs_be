import { IsNotEmpty } from "class-validator"

export class CreateAuthDto {
    @IsNotEmpty({message:"username khong dc de trong"})
    username:string
    @IsNotEmpty({message:"password khong dc de trong"})
    password:string
}
