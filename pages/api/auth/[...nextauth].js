import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { verifyPassword } from "../../../lib/auth";
import { COLLECTION_NAME, connectToDatabase, DB_NAME } from "../../../lib/db";



export default NextAuth({
  providers: [
    Providers.Credentials({
      session: {
        jwt: true
      },
      async authorize(credentials) {
        const client = await connectToDatabase();

        const userCollection = client.db(DB_NAME).collection(COLLECTION_NAME);

        const user = await userCollection.findOne({ email: credentials.email });

        if (!user) {
          client.close();
          throw new Error('No user found.');
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password);
        
        if(!isValidPassword){
          client.close();
          throw new Error('Incorrect username/password.');
        }

        client.close();
        return { email: user.email };

        
      }
    })
  ]
});