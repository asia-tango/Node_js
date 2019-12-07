const Joi = require('joi');

const validation = (schema) => {
  return (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error) {
      return res.status(400).json({
        message: `${result.error}`
      });
    }
    next();
  };
  
}
module.exports = validation;

schema: {
  getSchema: Joi.object().keys({
    title: Joi.string().required(),
    completed: Joi.string()
  })
};