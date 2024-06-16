import HttpError from "../helpers/HttpError.js";
import { verifyToken } from "../helpers/jwt.js";
import { findUSer } from "../services/usersServices.js";

const authenticate = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return next(HttpError(401, "Authorization header not found"));
  }
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    return next(HttpError(401, "Bearer not found"));
  }

  const { error, payload } = verifyToken(token);
  if (error) {
    return next(HttpError(401, error.message));
  }
  const { id } = payload;
  const user = await findUSer({ _id: id });
  if (!user) {
    next(HttpError(401, "Unauthorized"));
  }

  if (!user.token) {
    next(HttpError(401, "User already logout"));
  }
  req.user = user;
  next();
};

export default authenticate;
