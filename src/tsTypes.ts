import { Request, Response } from "express";
import { Document } from "mongoose";

export interface IComment extends Document {
  _id: string;
  content: string;
}

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  bio: string;
}

export interface MyContext {
  req: Request;
  res: Response;
  payload?: { userId: string };
}
