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
export class VerifyDto {

    @IsNotEmpty({message:"id Không được để trống"})
    _id:string

    @IsNotEmpty({message:"Code Không được để trống"})
    code:string

}
export class ChangePasswordDto {

    @IsNotEmpty({message:"Code Không được để trống"})
    code:string

    @IsNotEmpty({message:"Password Không được để trống"})
    password:string

    @IsNotEmpty({message:" Confirm Password Không được để trống"})
    confirmPassword:string

    // @IsNotEmpty({message:"Email Không được để trống"})
    // email:string
}
