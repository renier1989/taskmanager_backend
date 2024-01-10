import mongoose, { Types } from "mongoose";

export const isValidId = (id:Types.ObjectId) => mongoose.Types.ObjectId.isValid(id);