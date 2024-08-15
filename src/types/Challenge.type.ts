import {User} from './User.type';

export type Challenge = {
  id: string;
  title: string;
  participants: User[];
  createdAt: any;
  status: 'active' | 'completed' | 'cancelled';
};
