import { Request } from 'express';
import Users from 'src/features/users/entities/user.entity';

interface RequestWithUser extends Request {
  user: Users;
}

export default RequestWithUser;
