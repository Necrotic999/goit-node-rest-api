import * as usersServices from "../services/usersServices.js";
import bcrypt from "bcrypt";

import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersServices.findUSer({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = bcrypt.hash(password, 10);

  const newUser = await usersServices.signup({
    ...req.body,
    password: hashPassword,
  });

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersServices.findUSer({ email });
  if (user) {
    throw HttpError(401, "Email or password invalid");
  }

  const userPassword = bcrypt.compare(password, user.password);
  if (!userPassword) {
    throw HttpError(401, "Email or password invalid");
  }

  const { _id: id } = user;

  const payload = {
    id,
  };

  const token = createToken(payload);
  await usersServices.updateUser({ _id: id }, { token });

  res.json({
    token,
  });
};

export const getCurrent = (req, res) => {
  const { email } = req.user;

  res.json({
    email,
  });
};

export const signout = async (req, res) => {
  const { _id } = req.user;
  await usersServices.updateUser({ _id }, { token: "" });

  res.json({
    message: "logout success",
  });
};
