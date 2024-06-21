import { Hono } from "hono"
import { decode, sign, verify } from 'hono/jwt'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupSchema, signinSchema } from "@h_bakrania/medium-common"

export const userRouter = new Hono<{
	Bindings: {
		DATABASE_URL: string
    JWT_SECRET: string
	}
}>();

userRouter.post("/signup", async(c) =>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())
  
    const body = await c.req.json();
    const { success } = signupSchema.safeParse(body);

    if(!success){
      c.status(411);
      return c.json({ message: "Inputs not correct"});
    }
    
    try{
      const user = await prisma.user.create({
        data: {
          email: body.email,
          password: body.password
        }
      })

      const token = await sign({ id: user.id}, c.env.JWT_SECRET);
    
      return c.json({jwt: token});
    }catch(error){
      console.log(error)
      c.status(403);
      return c.text("Error Signing up");
    }
    })
  
userRouter.post("/signin", async(c) =>{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json();
    const { success } = signinSchema.safeParse(body);

    if(!success){
      c.status(411);
      return c.json({ message: "Inputs not correct"});
    }

    try{
        const user = await prisma.user.findUnique({
        where: {
        email: body.email,
        password: body.password
        }
    });

    if(!user){
        c.status(403);
        return c.json({message: "user not found"});
    }

    const token = await sign({id: user.id},c.env.JWT_SECRET);
    return c.json({ jwt: token})
    }catch(error){
        console.log(error);
        c.status(403);
        return c.json({
        message: "Invalid"})
    }
});