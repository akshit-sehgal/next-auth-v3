import { hashPassword } from "../../../lib/auth";
import { COLLECTION_NAME, connectToDatabase, DB_NAME } from "../../../lib/db";

const resolver = async (req, res) => {
  if (req.method !== 'POST') {
    return;
  }

  const { email, password } = req.body;

  if (!email?.includes('@') || !password?.trim() || password.trim().length < 7) {
    res.status(422).json({ message: 'Invalid input - password should be atleast 7 characters long' });
  }

  const client = await connectToDatabase();
  const db = client.db(DB_NAME);

  const existingUser = await db.collection(COLLECTION_NAME).findOne({email});

  if(existingUser){
    res.status(422).json({message: 'User account already exists'});
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(password);

  const result = await db.collection(COLLECTION_NAME).insertOne({
    email,
    password: hashedPassword
  });

  res.status(201).json({ message: 'New user created' });
  client.close();
};

export default resolver;