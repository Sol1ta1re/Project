import { CreateAuthorDto } from "../dto/create-author.dto";
import { UpdateAuthorDto } from "../dto/update-author.dto";
import { AuthorsService } from "../services/authors.service";
export declare class AuthorsController {
    private readonly authorsService;
    constructor(authorsService: AuthorsService);
    create(createAuthorDto: CreateAuthorDto): Promise<import("../entities/author.entity").Author>;
    findAll(): Promise<import("../entities/author.entity").Author[]>;
    findOne(id: number): Promise<import("../entities/author.entity").Author>;
    update(id: number, updateAuthorDto: UpdateAuthorDto): Promise<import("../entities/author.entity").Author>;
    remove(id: number): Promise<void>;
}
