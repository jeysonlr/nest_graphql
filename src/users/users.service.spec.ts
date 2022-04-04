import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserModel = {
  userId: 'fakeUserId',
  firstName: 'fakeFirstName',
  lastName: 'fakeLastName',
  email: 'fakeEmail',
  password: 'fakePass',
  role: 'fakeRole',
};

const createUserInput = {
  firstName: 'fakeFirstName',
  lastName: 'fakeLastName',
  email: 'fakeEmail',
  password: 'fakePass',
  role: 'fakeRole',
};

describe('UserService', () => {
  let service: UsersService;

  const mockRepository = {
    find: jest.fn().mockReturnValue(mockUserModel),
    findOne: jest.fn().mockReturnValue(mockUserModel),
    create: jest.fn().mockReturnValue(mockUserModel),
    save: jest.fn().mockReturnValue(mockUserModel),
    update: jest.fn().mockReturnValue(mockUserModel),
    delete: jest.fn().mockReturnValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('When search all Users', () => {
    it('Should list all users', async () => {
      const users = service.findAll();

      expect(users).resolves.toBe(mockUserModel);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search User By Id', () => {
    it('Should find a existing user', async () => {
      const userFound = service.findOne('fakeUserId');

      expect(mockRepository.findOne).toHaveBeenCalledWith(mockUserModel.userId);
      expect(userFound).resolves.toBe(mockUserModel);
    });

    it('Should return a exception when does not to find a user', async () => {
      mockRepository.findOne.mockReturnValue(null);

      const user = service.findOne(mockUserModel.userId);

      expect(user).rejects.toThrow(NotFoundException);
      expect(mockRepository.findOne).toHaveBeenCalledWith(mockUserModel.userId);
    });
  });

  describe('When create a user', () => {
    it('Should create a user', async () => {
      const user = service.create(createUserInput);

      expect(mockRepository.create).toBeCalledWith(createUserInput);
      expect(mockRepository.save).toBeCalledTimes(1);
      expect(user).resolves.toBe(mockUserModel);
    });
  });

  describe('When update User', () => {
    it('Should update a user', async () => {
      service.findOne = jest.fn().mockReturnValueOnce(mockUserModel);

      const userUpdated = service.update(mockUserModel.userId, mockUserModel);
      expect(userUpdated).resolves.toBe(mockUserModel);
    });

    describe('When delete User', () => {
      it('Should delete a existing user', async () => {
        service.findOne = jest.fn().mockReturnValueOnce(mockUserModel);

        let remove = service.remove(mockUserModel.userId);
        expect(remove).resolves.toBe(mockUserModel.userId);
      });

      it('Should return an internal server error if repository does not delete the user', async () => {
        service.findOne = jest.fn().mockReturnValueOnce(mockUserModel);
        mockRepository.delete.mockReturnValueOnce(null);

        const deletedUser = service.remove(mockUserModel.userId);
        expect(deletedUser).rejects.toThrow(InternalServerErrorException);
      });
    });
  });
});
