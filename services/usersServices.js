import User from "../models/usersMongooseSchemas.js";

export const signup = (data) => User.create(data);

export const findUSer = (filter) => User.findOne(filter);

export const updateUser = (filter, data) => User.findOneAndUpdate(filter, data);
