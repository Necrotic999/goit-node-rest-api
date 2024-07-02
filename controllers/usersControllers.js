import * as usersServices from "../services/usersServices.js";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import HttpError from "../helpers/HttpError.js";
import { createToken } from "../helpers/jwt.js";
import path from "path";
import fs from "fs/promises";
import sendEmail from "../helpers/sendEmail.js";
import { nanoid } from "nanoid";
import "dotenv/config";

const { BASE_URL } = process.env;

export const signup = async (req, res) => {
  const { email, password } = req.body;

  const user = await usersServices.findUSer({ email });
  if (user) {
    throw HttpError(409, "Email is already in use");
  }

  const hashPassword = bcrypt.hash(password, 10);
  const verificationToken = nanoid();

  const newUser = await usersServices.signup({
    ...req.body,
    password: hashPassword,
    avatarUrl: gravatar.url(email),
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.status(201).json({
    username: newUser.username,
    email: newUser.email,
  });
};

export const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = usersServices.findUSer({ verificationToken });
  if (!user) {
    throw HttpError(404, "User not found");
  }

  await usersServices.updateUser(
    { _id: user, _id },
    { verify: true, verificationToken: null }
  );

  res.json({
    message: "Verification successful",
  });
};

export const resendEmail = async (req, res) => {
  const { email } = req.body;
  const user = await usersServices.findUSer({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify your email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json({
    message: "Verify email send success",
  });
};

export const signin = async (req, res) => {
  const { email, password } = req.body;
  const user = await usersServices.findUSer({ email });
  if (user) {
    throw HttpError(401, "Email or password invalid");
  }

  if (!user.verify) {
    throw HttpError(401, "Email not verified");
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

export const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  Jimp.read(filename).then((image) => {
    image.resize(250, 250).catch((error) => {
      console.log(error.message);
    });
  });

  const newPath = path.join(avatarsDir, filename);
  await fs.rename(oldPath, newPath);
  const avatar = path.join("avatars", filename);

  await usersServices.updateUser({ _id }, { avatarUrl: avatar });

  res.json({
    message: "avatar is update",
  });
};
