import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('blogs tests', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    applyAppSettings(app);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('1. (POST) - CREATE BLOG', () => {
    it('1. Should create blog and return  status code of 201', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);
    });

    it("2. Shouldn't create blog and return  status code of 400", async () => {
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

      //create blog
      const newBlog = {
        name: '',
        description: '',
        websiteUrl: '',
      };

      const res = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3. Shouldn't create blog if unauthorized and return  status code of 401", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });
  });
  describe('2. (GET) - GET BLOGS', () => {
    it('1. Should get blogs and return status code 200 and object with pagination', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //get blogs
      const res = await request(app.getHttpServer())
        .get(`/blogs?pageNumber=1&pageSize=5`)
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(5);
    });
  });

  describe('2. (GET) - GET BLOG BY ID', () => {
    it('1. Should get blog by ID and return status code 200 and object', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //get blog by id
      await request(app.getHttpServer())
        .get(`/blogs/${blog.body.id}`)
        .expect(200);
    });
    it("2. Shouldn't get blog by ID and return status code 404 if blogId is not exist", async () => {
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

      //create blog
      const blogId = '662bb47c5ea70648a79f7c10';

      //get blog by id
      await request(app.getHttpServer()).get(`/blogs/${blogId}`).expect(404);
    });
  });

  describe('3. (PUT) - UPDATE BLOG BY ID', () => {
    it('1. Should update blog and return status code 204', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //blog to update
      const blogToUpdate = {
        name: 'Promise updated',
        description: 'do you know promise well?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .put(`/blogs/${blog.body.id}`)
        .send(blogToUpdate)
        .auth('admin', 'qwerty')
        .expect(204);
    });

    it("2. Shouldn't update blog and return status code 400 if invalid inputs", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //blog to update
      const blogToUpdate = {
        name: 'Promise updated',
        description: 'do you know promise well?',
        websiteUrl: '',
      };

      await request(app.getHttpServer())
        .put(`/blogs/${blog.body.id}`)
        .send(blogToUpdate)
        .auth('admin', 'qwerty')
        .expect(400);
    });

    it("3. Shouldn't update blog and return status code 401 if unauthorized", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //blog to update
      const blogToUpdate = {
        name: 'Promise updated',
        description: 'do you know promise well?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .put(`/blogs/${blog.body.id}`)
        .send(blogToUpdate)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });

    it("4. Shouldn't update blog and return status code 404 if ID not found", async () => {
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

      //create blog
      const blogId = '665de0b0ed6b88ba049eae66';

      //blog to update
      const blogToUpdate = {
        name: 'Promise updated',
        description: 'do you know promise well?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .put(`/blogs/${blogId}`)
        .send(blogToUpdate)
        .auth('admin', 'qwerty')
        .expect(404);
    });
  });

  describe('4. (CREATE) - CREATE BLOG POST', () => {
    it('1. Should create blog post and return object with status 201', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: 'whole content about memo',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);
    });

    it("2. Shouldn't create blog post and return status 404", async () => {
      //create blog
      const blogId = '662bb47c5ea70648a79f7c10';

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: 'whole content about memo',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blogId}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(404);
    });

    it("3. Shouldn't create blog post and return object with status 400 if incorrect input values", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: '',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(400);
    });

    it("4. Shouldn't create blog post and return object with status 400 if unauthorized", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: '',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });
  });

  describe('5. (GET) - GET BLOG POSTS', () => {
    it('1. Should get blog posts and return object with pagination & status 200', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: 'whole content about memo',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //get blog post
      await request(app.getHttpServer())
        .get(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(200);
    });

    it("2. Shouldn't get blog posts and return object with pagination & status 200", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Memo',
        shortDescription: 'Learn more about memo in ' + new Date(),
        content: 'whole content about memo',
      };

      await request(app.getHttpServer())
        .post(`/blogs/${blog.body.id}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect blogID
      const blogId = '662bb47c5ea70648a79f7c10';

      //get blog post
      await request(app.getHttpServer())
        .get(`/blogs/${blogId}/posts`)
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(404);
    });
  });

  describe('6. (DELETE) - DELETE BLOG BY ID', () => {
    it("1. Shouldn't delete blog and return status code 401 if unauthorized", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/blogs/${blog.body.id}`)

        .auth('admin1', 'qwerty1')
        .expect(401);
    });

    it("2. Shouldn't delete blog and return status code 404 if id is not exist", async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect blogId
      const blogsId = '662bb47c5ea70648a79f7c10';

      await request(app.getHttpServer())
        .delete(`/blogs/${blogsId}`)
        .auth('admin', 'qwerty')
        .expect(404);
    });

    it('3. Should delete blog and return status code 204', async () => {
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

      //create blog
      const newBlog = {
        name: 'Promise',
        description: 'do you know promise?',
        websiteUrl: 'https://google.com',
      };

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/blogs/${blog.body.id}`)
        .auth('admin', 'qwerty')
        .expect(204);
    });
  });
});
