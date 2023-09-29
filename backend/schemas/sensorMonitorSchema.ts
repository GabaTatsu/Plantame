import Joi from 'joi';

const sensorMonitorSchema = Joi.object({
    temperature: Joi.number().min(-50).max(100).precision(1).required(),
    humidity: Joi.number().min(0).max(100).precision(1).required(),
});

export default sensorMonitorSchema;
