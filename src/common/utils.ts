import { Request } from 'express';
import { JwtPayload } from '~/core/models/auth.model';

export enum Role {
  Customer = 'customer',
  Technician = 'technician',
}

/**
 * Extends the Express Request interface to include a `user` property of type `JwtPayload`.
 * This is useful for accessing the authenticated user's information in request handlers.
 */
export interface RequestWithUser extends Request {
  user: JwtPayload;
}
