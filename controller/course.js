const Course = require("../models/Courses");
const { SuccessResponse, ErrorResponse } = require("../utils/responsehelpers");

const getCourse = async (req,res) =>
{
    try {
        const courses = await Course.find(); 
        res.json({ courses });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
      }
    
}
module.exports = {
    getCourse
};