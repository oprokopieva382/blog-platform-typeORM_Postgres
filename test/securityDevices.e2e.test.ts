import { Test, TestingModule } from '@nestjs/testing';
import * as cookieParser from 'cookie-parser';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('comments tests', () => {
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

  describe('1. (GET) - GET USER DEVICES', () => {
    it('1. Should get devices & return status code 200', async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .get('/security/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);
    });

    it("2. Shouldn't get devices & return status code 401 if user unauthorized", async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .get('/security/devices')
        .set('Authorization', `Bearer ${accessToken}+1`)
        .set('Cookie', `refreshToken=${refreshToken}+1`)
        .expect(401);
    });
  });
  describe('2. (DELETE) - DELETE ALL USER DEVICES', () => {
    it('1. Should delete devices & return status code 204', async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .delete('/security/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("2. Shouldn't delete devices & return status code 401 if user unauthorized", async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      await request(app.getHttpServer())
        .delete('/security/devices')
        .set('Authorization', `Bearer ${accessToken}+1`)
        .set('Cookie', `refreshToken=${refreshToken}+1`)
        .expect(401);
    });
  });
  describe('3. (DELETE) - DELETE USER DEVICE BY ID', () => {
    it('1. Should delete device by id & return status code 204', async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      // Get response with device ID
      const devicesRes = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);

      // Get device ID
      const deviceId = devicesRes.body[0].deviceId;

      await request(app.getHttpServer())
        .delete(`/security/devices/${deviceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(204);
    });

    it("2. Shouldn't delete device by id & return status code 401 if user unauthorized", async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      // Get response with device ID
      const devicesRes = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);

      // Get device ID
      const deviceId = devicesRes.body[0].deviceId;

      await request(app.getHttpServer())
        .delete(`/security/devices/${deviceId}`)
        .set('Authorization', `Bearer ${accessToken}+1`)
        .set('Cookie', `refreshToken=${refreshToken}+1`)
        .expect(401);
    });

    it("3. Shouldn't delete device by id & return status code 404 if deviceId is not exist", async () => {
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

      //set accessToken
      const accessToken = res.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = res.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      // Incorrect device ID
      const deviceId = '17abf2ca-fe6d-5361-9701-baa16bd1c3a7';

      await request(app.getHttpServer())
        .delete(`/security/devices/${deviceId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(404);
    });

    it("4. Shouldn't delete device by id & return status code 403 if try to delete the deviceId of other user", async () => {
      //create first user
      const firstUser = {
        login: 'Tina',
        password: 'tina123',
        email: 'Tina@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(firstUser)
        .auth('admin', 'qwerty')
        .expect(201);

      //login first user
      const loginInput = {
        loginOrEmail: 'Tina',
        password: 'tina123',
      };

      const loginUserOneRes = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput)
        .expect(200);

      //set accessToken
      const accessToken = loginUserOneRes.body.accessToken;

      // Extract refreshToken from cookie
      const cookies = loginUserOneRes.headers['set-cookie'];
      const refreshToken = cookies[0].split(';')[0].split('=')[1];

      // Get response with device ID
      const devicesRes = await request(app.getHttpServer())
        .get('/security/devices')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refreshToken=${refreshToken}`)
        .expect(200);

      // Get device ID
      const deviceId = devicesRes.body[0].deviceId;

      // Create second user
      const userTwo = {
        login: 'Bobby',
        password: 'password123',
        email: 'userbobby78a0@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(userTwo)
        .auth('admin', 'qwerty')
        .expect(201);

      // Login second user
      const loginInputTwo = {
        loginOrEmail: userTwo.login,
        password: userTwo.password,
      };

      const loginResTwo = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInputTwo)
        .expect(200);

      const accessTokenTwo = loginResTwo.body.accessToken;
      const refreshTokenTwo = loginResTwo.headers['set-cookie'][0]
        .split(';')[0]
        .split('=')[1];

      await request(app.getHttpServer())
        .delete(`/security/devices/${deviceId}`)
        .set('Authorization', `Bearer ${accessTokenTwo}`)
        .set('Cookie', `refreshToken=${refreshTokenTwo}`)
        .expect(403);
    });
  });
});
