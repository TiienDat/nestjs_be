import { IsNotEmpty, IsOptional } from "class-validator"

export class RegisterDto {

    @IsNotEmpty({message:"email khong dc de trong"})
    email:string

    @IsNotEmpty({message:"password khong dc de trong"})
    password:string

    @IsOptional()
    name:string
    phone:number
    address:string
    image:string
    role:string 
}
