const errorLogs = require("../models/errorlogs");

exports.SuccessResponse = (ctx, status, data = "") => {
  ctx.status(status).json({
    success: true,
    data,
  });
};

exports.ErrorResponse = async (
  ctx,
  status,
  message = "",
  model,
  error,
  endPoint
) => {
  console.log({ status, message, model, error, endPoint });
  if (endPoint)
    await errorLogs.create({
      model,
      error,
      endPoint,
    });
  ctx.status(status).json({
    success: false,
    message,
  });
};
