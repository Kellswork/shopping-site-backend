import bcrypt from 'bcryptjs';
import { createUser } from './models/index.model';

export default addUserInfo;
const addUserInfo = async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await createUser({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: 'user created successfully',
      user: {
        id: user.id,
        firstname,
        lastname,
        email,
      },
    });
  } catch (error) {
    if (
      error.name == 'UniqueViolationError' &&
      error.columns.includes('email')
    ) {
      return res.status(400).json({
        error: 'email has already been registered',
      });
    }
    return res.status(500).json({
      error: 'could not create user, please try again later',
    });
  }
};
