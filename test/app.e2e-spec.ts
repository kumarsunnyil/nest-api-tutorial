import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    prisma = app.get(PrismaService);

    await prisma.cleanDb(); // Ensure this method exists in PrismaService
    await app.init();
    await app.listen(5000);
    pactum.request.setBaseUrl(
      'http://localhost:5000',
    );
  });

  afterAll(async () => {
    await app.close();
  });
  // it('should pass');
  describe('Auth', () => {
    describe('signup', () => {
      it('should throw if email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: '987654',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        const dto: AuthDto = {
          email: 'sunil@2123.com',
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(400);
      });
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'sunil@2123.com',
          password: '987654',
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email empty', () => {
        const dto: AuthDto = {
          email: '',
          password: '987654',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        const dto: AuthDto = {
          email: 'sunil@2123.com',
          password: '',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(400);
      });
      it('should signin', () => {
        const dto: AuthDto = {
          email: 'sunil@2123.com',
          password: '987654',
        };
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });
    describe('Edit user', () => {});
  });
  // describe('Edit user', () => {
  //   describe('Get me', () => {
  //     it('Should edit user', () => {
  //       const dto: EditUserDto = {
  //         firstName: 'Sunil Kumar',
  //         lastName: 'naramukuS',
  //         email: 'sunnyil@123.com',
  //       };
  //       return pactum
  //         .spec()
  //         .get('/users')
  //         .withHeaders({
  //           Authorization: 'Bearer $S{userAt}',
  //         })
  //         .withBody(dto)
  //         .expectStatus(200);
  //     });
  //   });
  //   describe('Edit user', () => {});
  // });
  describe('Bookmark', () => {
    describe('Create bookmark', () => {});
    describe('Get Bookmark', () => {});
    describe('Get Bookmark by id', () => {});
    describe('Edit Bookmark', () => {});
    describe('Delete Bookmark', () => {});
  });
});
