const User = require('../models/User'); 

class UserFactory {
  static async create(role, userData) {
    try {
      console.log("--- Đang ở trong Factory với role:", role);
      
      
      const newUser = new User({
        ...userData,
        role: role || 'CUSTOMER'
      });

      return await newUser.save(); 
      
    } catch (error) {
      console.error("--- Lỗi tại UserFactory:", error.message);
      throw error; 
    }
  }
}

module.exports = UserFactory;