import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { applyAppSettings } from '../src/settings/apply-app-settings';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('posts tests', () => {
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

  describe('1. (POST) - CREATE POST', () => {
    it('1. Should create post and return  status code of 201', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);
    });

    it("2. Shouldn't create post and return  status code of 400", async () => {
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
        title: '',
        shortDescription: '',
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const res = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(2);
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

      const blog = await request(app.getHttpServer())
        .post('/blogs')
        .send(newBlog)
        .auth('admin', 'qwerty')
        .expect(201);

      //create post
      const newPost = {
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });
  });
  describe('2. (GET) - GET POSTS', () => {
    it('1. Should get posts and return status code 200 and object with pagination', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //get posts
      const res = await request(app.getHttpServer())
        .get(`/posts?pageNumber=1&pageSize=5`)
        .expect(200);

      expect(res.body.page).toBe(1);
      expect(res.body.pageSize).toBe(5);
    });
  });

  describe('3. (GET) - GET COMMENT OF POST', () => {
    it("1. Shouldn't find comment for proper post if postId is not exist & return status code 404", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect postId
      const wrongPostId = '6634e807bcf8ea51a3d4da61';

      await request(app.getHttpServer())
        .get(`/posts/${wrongPostId}/comments?pageNumber=1&pageSize=5`)
        .expect(404);
    });

    it('2. Should find comment for proper post if postId exist, return status code 200 & object with pagination', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //create comment
      const comment = {
        content: 'Can you, please, explain how it works?',
      };

      await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(comment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .get(`/posts/${post.body.id}/comments?pageNumber=1&pageSize=5`)
        .expect(200);
    });
  });

  describe('4. (PUT) - UPDATE POST BY ID', () => {
    it('1. Should update post and return status code 204', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //post to update
      const postToUpdate = {
        title: 'Nest.js',
        shortDescription: 'Learn more about Nest.js in ' + new Date(),
        content: 'whole content about Nest.js',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .put(`/posts/${post.body.id}`)
        .send(postToUpdate)
        .auth('admin', 'qwerty')
        .expect(204);
    });

    it("2. Shouldn't update post and return status code 400 if invalid inputs", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //post to update
      const postToUpdate = {
        title: '',
        shortDescription: '',
        content: '',
        blogId: blog.body.id,
      };

      const res = await request(app.getHttpServer())
        .put(`/posts/${post.body.id}`)
        .send(postToUpdate)
        .auth('admin', 'qwerty')
        .expect(400);

      expect(res.body.errorsMessages.length).toBe(3);
    });

    it("3. Shouldn't update post and return status code 401 if unauthorized", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //post to update
      const postToUpdate = {
        title: 'Nest.js',
        shortDescription: 'Learn more about Nest.js in ' + new Date(),
        content: 'whole content about Nest.js',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .put(`/posts/${post.body.id}`)
        .send(postToUpdate)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });

    it("4. Shouldn't update post and return status code 404 if ID not found", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect postId
      const postId = '662bb47c5ea70648a79f7c10';

      //post to update
      const postToUpdate = {
        title: 'Nest.js',
        shortDescription: 'Learn more about Nest.js in ' + new Date(),
        content: 'whole content about Nest.js',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .put(`/posts/${postId}`)
        .send(postToUpdate)
        .auth('admin', 'qwerty')
        .expect(404);
    });
  });

  describe('5. (POST) - CREATE COMMENT FOR POST', () => {
    it('1- Should create comment for proper post and with user auth & return status code 201', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //create comment
      const comment = {
        content: 'Can you, please, explain how it works?',
      };

      await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(comment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);
    });

    it("2- Shouldn't create comment for proper post and with user auth if incorrect values & return status code 400", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //create comment
      const shortComment = {
        content: 'How it works?',
      };

      await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(shortComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it("3- Shouldn't create comment for proper post if user unauthorized & return status code 401", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //create comment
      const comment = {
        content: 'Can you, please, explain how it works?',
      };

      await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(comment)
        .set('Authorization', `Bearer ${accessToken}+1`)
        .expect(401);
    });

    it("4- Shouldn't create comment for proper post if postId is not exist & return status code 404", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect postId
      const wrongPostId = '6634e807bcf8ea51a3d4da61';

      //create comment
      const comment = {
        content: 'Can you, please, explain how it works?',
      };

      await request(app.getHttpServer())
        .post(`/posts/${wrongPostId}/comments`)
        .send(comment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });

  describe('6. (DELETE) - DELETE POST', () => {
    it("1. Shouldn't delete post and return status code 401 if unauthorized", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/posts/${post.body.id}`)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });

    it("2- Shouldn't delete post and return status code 404 if id is not exist", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect postId
      const postsId = '662bb47c5ea70648a79f7c10';

      await request(app.getHttpServer())
        .delete(`/posts/${postsId}`)
        .auth('admin', 'qwerty')
        .expect(404);
    });

    it('3- Should delete post and return status code 204', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/posts/${post.body.id}`)
        .auth('admin', 'qwerty')
        .expect(204);
    });
  });

  describe('7. (PUT) - UPDATE POST LIKE STATUS', () => {
    it('1. Should update post like status and return status code 204', async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //reaction to post
      const status = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/posts/${post.body.id}/like-status`)
        .send(status)
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .expect(204);
    });

    it("2. Shouldn't update post reaction status and return status code 400 if invalid inputs", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //incorrect reaction to post
      const status = {
        likeStatus: 'like',
      };

      await request(app.getHttpServer())
        .put(`/posts/${post.body.id}/like-status`)
        .send(status)
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .expect(400);
    });

    it("3. Shouldn't update post reaction status and return status code 401 if unauthorized", async () => {
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
        title: 'Refactor',
        shortDescription: 'Learn more about refactor in ' + new Date(),
        content: 'whole content about refactor',
        blogId: blog.body.id,
      };

      const post = await request(app.getHttpServer())
        .post('/posts')
        .send(newPost)
        .auth('admin', 'qwerty')
        .expect(201);

      //reaction to post
      const status = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/posts/${post.body.id}/like-status`)
        .send(status)
        .set('Authorization', `Bearer ${res.body.accessToken}+1`)
        .expect(401);
    });

    it("4. Shouldn't update post reaction status and return status code 404 if ID not found", async () => {
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

      //incorrect postId
      const wrongPostId = '6634e807bcf8ea51a3d4da61';

      //reaction to post
      const status = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/posts/${wrongPostId}/like-status`)
        .send(status)
        .set('Authorization', `Bearer ${res.body.accessToken}`)
        .expect(404);
    });
  });
});
