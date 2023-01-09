import { Profile } from './../typeorm/entities/Profile';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, CreateUserPostParams, CreateUserProfileParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';
import { Post } from 'src/typeorm/entities/Post';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Profile) private readonly profileRepository: Repository<Profile>,
        @InjectRepository(Post) private readonly postRepository: Repository<Post>
    ) {}

    createUser(params: CreateUserParams) {
        const newUser = this.userRepository.create({
            ... params,
            createdAt: new Date()
        });
        return this.userRepository.save(newUser);
    }

    getUsers() {
        return this.userRepository.find({relations: ['profile', 'posts']});
    }

    getUser(id: number) {
        return this.userRepository.findBy({id});
    }

    updateUser(id: number, params: UpdateUserParams) {
        return this.userRepository.update({id}, {...params});
    }

    deleteUser(id: number) {
        return this.userRepository.delete({id});
    }

    async createUserProfile(id: number, params: CreateUserProfileParams) {
        const user = await this.userRepository.findOneBy({id});
        if(!user) throw new HttpException("User not found. Cannot create profile", HttpStatus.BAD_REQUEST);
        const newProfile = this.profileRepository.create(params);
        const savedProfile = await this.profileRepository.save(newProfile);
        user.profile = savedProfile;
        return this.userRepository.save(user);
    }

    async createUserPost(id: number, params: CreateUserPostParams) {
        const user = await this.userRepository.findOneBy({id});
        if(!user) throw new HttpException("User not found. Cannot create post", HttpStatus.BAD_REQUEST);
        const newPost = this.postRepository.create(params);
        const savedPost = await this.postRepository.save(newPost);
        savedPost.user = user;
        return this.postRepository.save(savedPost);
    }
}
