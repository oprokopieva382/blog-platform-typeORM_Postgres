import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('auth tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);

    app.use(cookieParser());

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('1. (POST) - AUTH LOGIN', () => {
    it('1. Should login user and return status code 200', async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      expect(res.body).toEqual({
        accessToken: expect.any(String),
      });
    });

    it("2. Shouldn't login user and return status code 401 if password or login is wrong", async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123456789',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(401);
    });
  });
  describe('2. (GET) - AUTH ME', () => {
    it('1. Should auth me return status code 200 and object', async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      //get accessToken
      const accessToken = res.body.accessToken;
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    });

    it("2. Shouldn't auth me and return status code 401", async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      //get accessToken
      const accessToken = res.body.accessToken;
      await request(app.getHttpServer())
        .get('/auth/me')
        .set('Authorization', `Bearer ${accessToken}+1`)
        .expect(401);
    });
  });

  describe('3. (POST) - LOGOUT USER', () => {
    it('1. Should logout user and return status code of 204', async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("2. Shouldn't logout user and return status code of 401 if unauthorized", async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .post('/auth/logout')
        .set('Cookie', `refreshToken=${refreshToken}+1`)
        .expect(401);
    });
  });

  describe('4. (POST) - REGISTER USER', () => {
    it('1. Should register user and return status code of 204', async () => {
      //register user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(newUser)
        .expect(204);
    });

    it("2. Shouldn't register user and return status code of 400 if invalid inputs", async () => {
      //register user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina',
      };

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(newUser)
        .expect(400);
    });
  });

  describe('5. (POST) - REFRESH TOKEN', () => {
    it('1. Should request new refreshToken, return new accessToken & status code of 200', async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .auth('admin', 'qwerty')
        .send(newUser)
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);
    });

    it('2. Should request new refreshToken but request failed as unauthorized user, return status code of 401', async () => {
      //create user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .auth('admin', 'qwerty')
        .send(newUser)
        .expect(201);

      //login user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .post('/auth/refresh-token')
        .set('Authorization', `Bearer ${res.body.accessToken}+1`)
        .set('Cookie', `refreshToken=${refreshToken}+1`)
        .expect(401);
    });
  });

  describe('6. (POST) - REGISTRATION EMAIL RESENDING', () => {
    it('1. Should resend email with confirmation link, return status code of 204', async () => {
      //register user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'TinaYo1297@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(newUser)
        .expect(204);

      //email to resend
      const email = {
        email: 'TinaYo1297@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send(email)
        .expect(204);
    });

    it('2. Should fail the request resend-email with confirmation link, return status code of 400', async () => {
      //register user
      const newUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'TinaYo1297@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/auth/registration')
        .send(newUser)
        .expect(204);

      //invalid email to resend
      const email = {
        email: 'Tina@.com',
      };

      await request(app.getHttpServer())
        .post('/auth/registration-email-resending')
        .send(email)
        .expect(400);
    });
  });
});
