import { getSession } from "next-auth/client";
import { hashPassword, verifyPassword } from "../../../lib/auth";
import { COLLECTION_NAME, connectToDatabase, DB_NAME } from "../../../lib/db";

const resolver = async (req, res) => {
  if (req.method !== 'PATCH') {
    return;
  };
  const session = await getSession({ req });

  if (!session) {
    res.status(401).json({ message: 'Not Authenticated' });
    return;
  };

  const { email: userEmail } = session.user;
  const { oldPassword, newPassword } = req.body;

  const client = await connectToDatabase();

  const usersCollection = client.db(DB_NAME).collection(COLLECTION_NAME);
  const user = await usersCollection.findOne({ email: userEmail });

  if(!user){
    res.status(404).json({message: 'User not found'});
    client.close();
    return;
  };

  const currentPassword = user.password;

  const isValidPassword = await verifyPassword(oldPassword, currentPassword);

  if(!isValidPassword){
    res.status(403).json({ message: 'Not Authorized, incorrect password' })
    client.close();
    return;
  };

  const newHashedPassword = await hashPassword(newPassword);
  const result = await usersCollection.updateOne(
    {
      email: userEmail
    },
    {
      $set: {
        password: newHashedPassword
      }
    }
  );

  // TODO: Add error handling

  client.close();
  res.status(200).json({message: 'Password updated'});
}

export default resolver;