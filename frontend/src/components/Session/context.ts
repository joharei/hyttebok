import { User } from 'firebase';
import * as React from 'react';

const AuthUserContext = React.createContext<User | null>(null);

export default AuthUserContext;