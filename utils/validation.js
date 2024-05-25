const Joi = require('@hapi/joi');

const registerValidation = (data) => {
	const schema = Joi.object({
		firstName: Joi.string().min(1).required(),
		lastName: Joi.string().min(1).required(),
		email: Joi.string().min(6).required().email(),
		password: Joi.string().min(6).required(),
	});

	const { error } = schema.validate(data);
	return error;
};

const loginValidation = (data) => {
	const schema = Joi.object({
	  email: Joi.string().min(6).required().email(),
	  password: Joi.string().min(6).required(),
	});
  
	const { error } = schema.validate(data);
  
	if (error) {
	  if (error.message) {
		return error.message;
	  }
  
	  if (Array.isArray(error.details) && error.details.length > 0) {
		if (error.details.some((detail) => detail.path.includes('email'))) {
		  return 'Invalid email';
		}
  
		if (error.details.some((detail) => detail.path.includes('password'))) {
		  return 'Invalid password';
		}
	  }
	}
  
	return null;
};

module.exports = {
	registerValidation,
	loginValidation
};
