import HttpError from "./HttpError.js";

const validateBody = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(HttpError(400));
  }
  next();
};

export default validateBody;
