export type IUserResponse = {
  id?: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  description?: string;
};

export type IUserUpdateRequest = Omit<IUserResponse, "id">;
