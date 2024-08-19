import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateUserDto {
    @IsMongoId({message:`id khong hop le`})
    _id:string;
    @IsOptional()
    name: string;
    @IsOptional()
    phone: number;
    @IsOptional()
    address: string;
    @IsOptional()
    image: string;
    @IsOptional()
    role: string;
}
