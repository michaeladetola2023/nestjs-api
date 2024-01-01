import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { PrismaService } from "../src/prisma/prisma.service";
import { AppModule } from '../src/app.module';
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto } from "src/bookmark/dto";




describe('App e2e', () => {

  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    jest.setTimeout(20000);
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen(4000);

    prisma = app.get(PrismaService);
    //deleting all users and bookmarks immediatelly after runing TESTING
    await prisma.cleanDb();
    //TO SET BASE URL FOR D REQUEST
    //"pactum.request.setBaseUrl("http://localhost:4000")";
  });

  afterAll(() => {
    app.close();
  });
  
  describe('Auth', ()=> {
    const dto: AuthDto = {
      email: "michael@gmail.com",
      password: "1234"
    }
    describe('Signup', ()=> {
      //should throw error if email NOT provided
      it('should throw error if email empty',() => {
        return pactum.spec().post("http://localhost:4000/auth/register").withBody({password:dto.password}).expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });
      
      //should throw error if password NOT provided
      it('should throw error if password empty',() => {
        return pactum.spec().post("http://localhost:4000/auth/register").withBody({email:dto.email}).expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

      //should throw error if body is NOT provided
      it('should throw error if body request NOT provided',() => {
        return pactum.spec().post("http://localhost:4000/auth/register").expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

      //Register api function request
      it("should signup",() => {
        return pactum.spec().post("http://localhost:4000/auth/register").withBody(dto).expectStatus(201);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

    });

    
    describe('Signin', ()=> {

      //Login api function request
      it("should signin",() => {
        return pactum.spec().post("http://localhost:4000/auth/login").withBody(dto).expectStatus(201).stores('useAt','access_token');//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

      //should throw error if password NOT provided
      it('should throw error if password empty',() => {
        return pactum.spec().post("http://localhost:4000/auth/login").withBody({email:dto.email}).expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

      //should throw error if body is NOT provided
      it('should throw error if body request NOT provided',() => {
        return pactum.spec().post("http://localhost:4000/auth/login").expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

      //should throw error if email NOT provided
      it("should throw error if email empty",() => {
        return pactum.spec().post("http://localhost:4000/auth/login").withBody({password:dto.password}).expectStatus(400);//if u want 2 see wat z inside d request respond ADD .inspect() at d END.
      });

    });
  });

  describe('User', ()=> {
    describe('Get me', ()=> {
      it('should get current user',() => {
        return pactum.spec().get("http://localhost:4000/users/me").withHeaders({Authorization: "Bearer $S{useAt}"}).expectStatus(200);
      });
    });

    describe('Edit user', ()=> {
      it('should edit user',() => {
        const dto: EditUserDto = {
          firstName: 'Adewale',
          email: 'adetola@gmail.com',
        }
        return pactum.spec().patch("http://localhost:4000/users").withHeaders({Authorization: "Bearer $S{useAt}"}).withBody(dto).expectStatus(200).expectBodyContains(dto.firstName).expectBodyContains(dto.email);
      });
    });
  });
  describe('Bookmarks', ()=> {

    describe('Get empty bookmark', () => {
      it('should get bookmarks',() => {
        return pactum.spec().get("http://localhost:4000/bookmarks").withHeaders({Authorization: "Bearer $S{useAt}"}).expectStatus(200).expectBody([]);
      });
    });
    
    describe('Create bookmark', ()=> {
      const dto: CreateBookmarkDto = {
        title: "First Bookmark",
        link: "http://localhost"
      } 
      it('should create bookmark',() => {
        return pactum.spec().post("http://localhost:4000/bookmarks").withHeaders({Authorization: "Bearer $S{useAt}"}).expectStatus(200);
      });
    });

    describe('Get bookmarks', ()=> {});

    describe('Get bookmark by id', ()=> {});

    describe('Edit bookmark by id', ()=> {});

    describe('Delete bookmark by id', ()=> {});
  });
});