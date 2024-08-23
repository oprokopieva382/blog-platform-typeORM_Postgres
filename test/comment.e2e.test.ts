import { Test, TestingModule } from '@nestjs/testing';
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

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await request(app.getHttpServer()).delete('/testing/all-data').expect(204);
  });

  describe('1. (GET) - GET COMMENT BY ID', () => {
    it('1. Should get comment by id & return status code 200', async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .get(`/comments/${comment.body.id}`)
        .expect(200);
    });

    it("2. Shouldn't get comment by id & return status code 200", async () => {
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

      //incorrect commentId
      const commentId = '55350138933a2fd38939a3e4';

      await request(app.getHttpServer())
        .get(`/comments/${commentId}`)
        .expect(404);
    });
  });

  describe('2. (PUT) - UPDATE COMMENT BY ID', () => {
    it('1. Should update comment by id if user auth & return status code 204', async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const commentToUpdate = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}`)
        .send(commentToUpdate)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it("2. Shouldn't update comment by id if user auth and if incorrect values & return status code 400", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const shortComment = {
        content: 'How it works?',
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}`)
        .send(shortComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it("3. Shouldn't update comment by id if user unauthorized & return status code 401", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      const commentToUpdate = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}`)
        .send(commentToUpdate)
        .set('Authorization', `Bearer ${accessToken}+1`)
        .expect(401);
    });

    it("4. Shouldn't update comment by id if commentId is not exist & return status code 404", async () => {
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

      //incorrect comment
      const commentId = '6634e807bcf8ea51a3d4da61';

      const commentToUpdate = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app.getHttpServer())
        .put(`/comments/${commentId}`)
        .send(commentToUpdate)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it("5. Shouldn't update comment by id if commentId !== user.id & return status code 403", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      //create user2
      const newUser2 = {
        login: 'Tina2',
        password: 'tina1234',
        email: 'Tina2@gmail.com',
      };

      await request(app.getHttpServer())
        .post('/users')
        .send(newUser2)
        .auth('admin', 'qwerty')
        .expect(201);

      //login user
      const loginInput2 = {
        loginOrEmail: 'Tina2',
        password: 'tina1234',
      };

      const res2 = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginInput2)
        .expect(200);

      //set accessToken
      const accessToken2 = res2.body.accessToken;

      //update comment
      const commentToUpdate = {
        content: "Still can't understand, need more info to get how it works?",
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}`)
        .send(commentToUpdate)
        .set('Authorization', `Bearer ${accessToken2}`)
        .expect(403);
    });
  });

  describe('3. (DELETE) - DELETE COMMENT BY ID', () => {
    it('1. Should delete comment by id if user auth & return status code 204', async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/comments/${comment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it("2. Shouldn't delete comment by id if commentId is not exist & return status code 404", async () => {
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

      //incorrect commentId
      const commentId = '6634e807bcf8ea51a3d4da61';

      await request(app.getHttpServer())
        .delete(`/comments/${commentId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });

    it("3. Shouldn't delete comment by id if user unauthorized & return status code 401", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/comments/${comment.body.id}`)
        .set('Authorization', `Bearer ${accessToken}+1`)
        .expect(401);
    });
  });

  describe('4. (PUT) - LIKE COMMENT', () => {
    it('1. Should like comment by commentId & return status code 204', async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      //like comment
      const reaction = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}/like-status`)
        .send(reaction)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(204);
    });

    it("2. Shouldn't like comment by commentId & return status code 400 if input has incorrect value", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      //like comment with incorrect value
      const reaction = {
        likeStatus: 'like',
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}/like-status`)
        .send(reaction)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);
    });

    it("3. Shouldn't like comment by commentId & return status code 401 if user unauthorized", async () => {
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
      const newComment = {
        content: 'Can you, please, explain how it works?',
      };

      const comment = await request(app.getHttpServer())
        .post(`/posts/${post.body.id}/comments`)
        .send(newComment)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(201);

      //like comment
      const reaction = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/comments/${comment.body.id}/like-status`)
        .send(reaction)
        .set('Authorization', `Bearer ${accessToken}+1`)
        .expect(401);
    });

    it("4. Shouldn't like comment by commentId & return status code 404 commentId is not exist", async () => {
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

      //incorrect commentId
      const commentId = '6634e807bcf8ea51a3d4da61';

      //like comment
      const reaction = {
        likeStatus: 'Like',
      };

      await request(app.getHttpServer())
        .put(`/comments/${commentId}/like-status`)
        .send(reaction)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);
    });
  });
});
