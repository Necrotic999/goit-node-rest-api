import express from "express";

import {
  signup,
  signin,
  getCurrent,
  signout,
  verify,
} from "../controllers/usersControllers.js";

import validateBody from "../helpers/validateBody.js";
import authenticate from "../middlewares/authenticate.js";
import validate from "../decorators/validate.js";
import upload from "../middlewares/upload.js";

import {
  authSigninSchema,
  authSignupSchema,
  authEmailSchema,
} from "../schemas/authSchemas.js";

const usersRouter = express.Router();

usersRouter.post(
  "/register",
  upload.single("avatarURL"),
  validateBody,
  validate(authSignupSchema),
  signup
);

usersRouter.post("/login", validateBody, validate(authSigninSchema), signin);

usersRouter.get("/current", authenticate, getCurrent);

usersRouter.post("/logout", authenticate, signout);

usersRouter.patch("/avatars", authenticate);

usersRouter.get("/verify/:verificationToken", verify);

usersRouter.post(
  "/verify",
  validateBody,
  validate(authEmailSchema),
  resendEmail
);

export default usersRouter;
