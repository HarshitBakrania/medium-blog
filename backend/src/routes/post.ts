import { Hono } from "hono";
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { createPostSchema, updatePostSchema } from "@h_bakrania/medium-common";

export const postRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string;
        JWT_SECRET: string;
    },
    Variables: {
        userId: string
    }
}>();

postRouter.use("/*", async(c, next) =>{
    const authHeader = c.req.header("Authorization") || "";
    
    const user = await verify(authHeader, c.env.JWT_SECRET);
  
    if(user){
        c.set("userId", user.id as string);
        await next();
    }else{
        c.status(403);
        return c.json({
            message: "Not logged in"
        })
    }
})

postRouter.post("/", async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = createPostSchema.safeParse(body);
    
    if(!success){
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }

    const authorId = c.get("userId");
    try{
        const post = await prisma.post.create({
        data: {
            title: body.title,
            content: body.content,
            authorId: authorId
        }
    })
    return c.json({
        id: post.id
    });
    }catch(error){
        console.log(error);
    }
    
})

postRouter.put("/", async (c) =>{
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = updatePostSchema.safeParse(body);

    if(!success){
        c.status(411);
        return c.json({
            message: "Incorrect inputs"
        })
    }
    
    const post = await prisma.post.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })

    return c.json({
        id: post.id
    });
})

postRouter.get("/bulk", async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const filteredPosts = await prisma.post.findMany();
    
    return c.json({ posts: filteredPosts});
})

postRouter.get("/:id", async (c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const id = c.req.param("id");
        const post = await prisma.post.findFirst({
        where: {
            id: id
        },
    })

    return c.json({
        post
    });
    }catch(error){
        c.status(411);
        console.log(error);
        return c.json({
            message: "Error getting the post"
        })
    }
})
