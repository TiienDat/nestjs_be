import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message:"name không được để trống"})
    name: string;

    @IsEmail()
    email: string;

    @IsNotEmpty({message:"password không được để trống"})
    password: string;
    
    phone: number;
    address: string;
    image: string;
    role: string;
}
