const { ErrorResponse } = require('../utils/responseHelpers');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = async (req, res, next) => {
	try {
		const accessToken = req?.headers?.authorization?.split(' ')[1];
		if (accessToken) {
			jwt.verify(
				accessToken,
				process.env.TOKEN_SECRET,
				async (err, decoded) => {
					if (err) {
						console.log('err', err);
						return ErrorResponse(res, 401, 'Invalid Token');
					} else {
						console.log(decoded);
						const user = await User.findOne({ _id: decoded.userId });
						if (!user) return ErrorResponse(res, 401, 'User not found');
						req.user = user;
						next();
					}
				}
			);
		} else {
			return ErrorResponse(res, 401, 'A token is required for Authentication');
		}
	} catch (error) {
		console.log(error);
		return ErrorResponse(
			res,
			401,
			String(error),
			'verify token middeware',
			String(error),
			req.url
		);
	}
};

module.exports = {
	verifyToken,
};
