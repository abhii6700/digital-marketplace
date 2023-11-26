import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getPayloadClient } from "../get-payload";
import { AuthCredentialValidator } from "../lib/validators/accountCredentialsValidator";
import { publicProcedure, router } from "./trpc";

export const authRouter = router({
    createPayloadUser: publicProcedure.input(AuthCredentialValidator).mutation(async ({input}) => {
        const {email, password} = input
        const payload = await getPayloadClient()

        const {docs: user} = await payload.find({
            collection: 'users',
            where: {
                email:{
                    equals: email
                }
            }
        })

        if(user.length !== 0) throw new TRPCError({code: 'CONFLICT'})

        await payload.create({
            collection: 'users',
            data: {
                email,
                password,
                role: 'user',
            }
        })

        return {success: true, sentToEmail: email }
    }
    
   
    ),

    verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input

      const payload = await getPayloadClient()

      const isVerified = await payload.verifyEmail({
        collection: 'users',
        token,
      })

      if (!isVerified)
        throw new TRPCError({ code: 'UNAUTHORIZED' })

      return { success: true }
    }),


    signIn: publicProcedure.input(AuthCredentialValidator).mutation(async ({input, ctx}) => {
        const {email, password} = input
        const {res} = ctx

        const payload = await getPayloadClient()

        try{
            await payload.login({
                collection: 'users',
                data: {
                    email,
                    password
                },
                res,
            })

            return {success: true}
        }catch(e){
           throw new TRPCError({code: 'UNAUTHORIZED'})
        }


    })


})