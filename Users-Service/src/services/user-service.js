// All API Logic goes here
// All Buisiness Logic goes here
const { UserRepository } = require("../Database-users");
const jwt = require("jsonwebtoken");
const { ValidateSignature, ComparePassword } = require("../utils");
const {
  GeneratePassword,
  GenerateSalt,
  ValidatePassword,
  GenerateSignature,
  FormateData,
} = require("../utils");

class UserService {
  constructor() {
    this.repository = new UserRepository();
  }

  async Register(UserData) {
    try {
      const { username, email, password } = UserData;
      const salt = await GenerateSalt();
      const hashedPassword = await GeneratePassword(password, salt);
      const user = await this.repository.createUser({
        username,
        email,
        password: hashedPassword,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = await GenerateSignature(data);
      console.log("User Created");
      return { success: true, token };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async RegisterAdmin(AdminData) {
    try {
      const { username, email, password } = AdminData;
      const salt = await GenerateSalt();
      const hashedPassword = await GeneratePassword(password, salt);
      const user = await this.repository.createAdmin({
        username: username,
        email: email,
        password: hashedPassword,
      });
      console.log("Admin Created");
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "admin");
      console.log("Admin Created");
      return { success: true, token, message: "Admin Created" };
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async Login(UserInput) {
    try {
      const { email, password } = UserInput;

      const User = await this.repository.getUser({ email });

      if (!User) {
        console.log("User not found");
        return { success: false, message: "User not found" };
      } else {
        const isPassCompare = await ComparePassword(password, User.password);
        if (!isPassCompare) {
          return { success: false, message: "Invalid Password" };
        }
        const data = {
          user: {
            id: User.id,
          },
        };

        const token =
          UserInput.email === "admin"
            ? jwt.sign(data, "admin")
            : jwt.sign(data, "user");
        console.log("User Logged In");
        return { success: true, token, user: { id: User.id } };
      }
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async AddToCart(userId, productData) {
    try {
      const cart = await this.repository.addToCart(userId, productData);
      return cart;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async UpdateInteraction(userId, productId, interaction) {
    try {
      console.log("User ID in service:", userId);
      console.log("Product ID in service:", productId);
      console.log("Interaction in service:", interaction);
      const interactionData = await this.repository.UpdateInteraction(
        userId,
        productId,
        interaction
      );
      return interactionData;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async ClearCart(userId) {
    try {
      const cart = await this.repository.clearCart(userId);
      return cart;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }
  async GetUserCart(userId) {
    try {
      const cart = await this.repository.getUserCart(userId);
      return cart;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async CheckAdmin(email) {
    try {
      const admin = await this.repository.checkAdmin(email);
      return admin;
    } catch (error) {
      console.log(error);
      return { success: false, message: "Internal Server Error" };
    }
  }

  async GetUserById(userId) {
    try {
      const User = await this.repository.getUserbyID(userId);
      return User;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async GetAllUsers() {
    try {
      const users = await this.repository.getAllUsers();
      return users;
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  async GetUser(userId) {
    try {
      const User = await this.repository.getUser(userId);
      return res.status(200).json(FormateData(User));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async UpdateUser(req, res) {
    try {
      const { email } = req.user;
      const { password } = req.body;
      const salt = await GenerateSalt();
      const hashedPassword = await GeneratePassword(password, salt);
      await User.findOneAndUpdate(
        { email },
        { password: hashedPassword, salt }
      );
      return res.status(200).json({ message: "User Updated" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

module.exports = UserService;
