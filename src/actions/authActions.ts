/* eslint-disable prettier/prettier */
interface User {
  _id: string;
  name: string;
  email: string;
  phno: string;
}

export const authenticate = (authData: { token: string; user: User }) => ({
  type: 'AUTH',
  data: authData,
});

export const logout = () => ({
  type: 'LOGOUT',
});

export const updateUser = (userData: User) => ({
  type: 'UPDATE_USER',
  data: userData,
});
