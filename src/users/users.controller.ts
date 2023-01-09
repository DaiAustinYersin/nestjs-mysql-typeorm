import { Delete, Param, ParseIntPipe, Body, Controller, Get, Post, Put } from '@nestjs/common';
import { CreateUserPostDto } from 'src/dto/CreateUserPost';
import { CreateUserProfileDto } from 'src/dto/CreateUserProfile';
import { CreateUserDto } from '../dto/CreateUser.dto';
import { UpdateUserDto } from '../dto/UpdateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Post()
    createUser(@Body() dto: CreateUserDto) {
        return this.usersService.createUser(dto);
    }

    @Get()
    getUsers() {
        return this.usersService.getUsers();
    }

    @Put(':id')
    async updateUser(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
        await this.usersService.updateUser(id, dto);
        return this.usersService.getUser(id);
    }

    @Delete(':id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        this.usersService.deleteUser(id);
    }

    @Post(':id/profile')
    createUserProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateUserProfileDto) {
        return this.usersService.createUserProfile(id, dto);
    }

    @Post(':id/posts')
    createUserPost(@Param('id', ParseIntPipe) id: number, @Body() dto: CreateUserPostDto) {
        return this.usersService.createUserPost(id, dto);
    }
}
