import { Types } from "mongoose";

export interface ILogo {
  _id: Types.ObjectId;
  imageUrl: string;
  title: string;
  desc: string;
  category: string;
  folderName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface LogoCardProps {
  id: string;
  image: string;
  title: string;
  desc: string;
  category: string;
  folderName?: string | null;
  createdAt?: string;
}