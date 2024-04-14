const bcrypt = require('bcrypt');
const User = require('../models/user_model');
const jwt = require('jsonwebtoken');

const getAllUser = async (req, res) => {
    // Callback function to handle the database operation result
    const callback = (error, users) => {
      if (error) {
          console.error('Error while fetching user:', error);
          return res.status(500).json({ error: true, message: 'Server error while fetching user.' });
      }

      // Send the food items as JSON response
      return res.status(200).json({ success: true, users });
  };

  // Call the model's getAll method and pass the callback
  User.getAll(callback);
}

// Get a single User by ID
const getUserById = (req, res) => {
  const { id } = req.params;

  const callback = (error, user) => {
      if (error) {
          console.error(`Error while fetching User with ID ${id}:`, error);
          return res.status(500).json({ error: true, message: `Server error while fetching User with ID ${id}.` });
      }
      if (!user) {
          return res.status(404).json({ error: true, message: 'User not found.' });
      }
      console.log(`User fetched successfully:`, user);
      return res.status(200).json({ success: true, user });
  };

  User.findById(id, callback);
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  const callback = (error, numRemoved) => {
      if (error) {
          console.error(`Error while deleting User with ID ${id}:`, error);
          return res.status(500).json({ error: true, message: `Server error during the deletion of User with ID ${id}. Please try again later.` });
      }
      if (numRemoved === 0) {
          return res.status(404).json({ error: true, message: 'User not found.' });
      }
      console.log(`User with ID ${id} deleted successfully.`);
      return res.status(200).json({ success: true, message: 'User deleted successfully.' });
  };

  User.delete(id, callback);
}

const updateUser = async (req, res) => {
  const { id } = req.params;

  const callback = (error, numReplaced) => {
      if (error) {
          console.error(`Error while updating User with ID ${id}:`, error);
          return res.status(500).json({ error: true, message: `Server error during the update of User with ID ${id}. Please try again later.` });
      }
      if (numReplaced === 0) {
          return res.status(404).json({ error: true, message: 'User not found or no change detected.' });
      }
      console.log(`User with ID ${id} updated successfully.`);
      return res.status(200).json({ success: true, message: 'User updated successfully.' });
  };

  User.update(id, req.body, callback);
}

const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, phone, accountType } = req.body;

  // Basic validations
  if (!name || !email || !password || !confirmPassword || !phone || !accountType) {
    return res.status(400).json({ error: true, message: 'All fields are required.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: true, message: 'Passwords do not match.' });
  }

  try {
    // Check if username already exists
    const isEmailUnique = await User.isEmailUnique(email);
    console.log("existingUser", isEmailUnique)
    if (!isEmailUnique) {
      // email already exists
      return res.status(400).json({ error: true, message: 'Email already taken.' });
    }

    // Username is unique, proceed with registration
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserting new user into the database
    const newUser = await User.create({ name, email, password: hashedPassword, phone, accountType });
    
    // Successfully created new user
    console.log('New user registered:', newUser);
    return res.status(200).json({ success: true, message: 'User registered successfully.', user: newUser });
  } catch (error) {
    console.error('Server error during registration:', error);
    return res.status(500).json({ error: true, message: 'Server error during registration. Please try again later.' });
  }
};

const loginUser = (req, res) => {
  const { email, password } = req.body;
  console.log('Email:', email);
  console.log('Password:', password);

  User.findByEmail(email, async function(err, user) {
    if (err || !user) {
      console.error(err || 'User not found');
      return res.status(401).json({ error: true, message: 'Invalid email or password' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        
        const token = jwt.sign({
          userId: user._id,
          email: user.email,
          name: user.name,
          accountType: user.accountType
        }, process.env.JWT_SECRET_KEY);

        res.cookie('kd_token', token);

        // Check if the user is an admin
        if (user.accountType === 'Admin') {
          console.log("user.accountType === 'Admin'", "true")
          // Instead of creating a JWT token, send a JSON response with redirect information
          return res.json({ redirect: true, redirectUrl: '/dashboard' });
        } else {
          // Proceed with token creation for non-admin users
          return res.status(200).json({ message: 'Successfully logged in', token });
        }
      } else {
        console.error('Incorrect password');
        return res.status(401).json({ error: true, message: 'Invalid email or password' });
      }
    } catch (error) {
      console.error('Error during password comparison:', error);
      return res.status(500).json({ error: true, message: 'Server error during login' });
    }
  });
};

const logoutUser = (req, res) => {
  res.clearCookie('kd_token'); // Clear the token stored in the cookie
  res.redirect('/login');
};

const authenticateToken = (req, res, next) => {
  const token = req.cookies.kd_token; 

  if (token == null) return res.sendStatus(401); // if there's no token

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403); // if the token is invalid or has expired
    req.user = user;
    next(); // proceed to the next middleware or route handler
  });
};

module.exports = { registerUser, loginUser, logoutUser, authenticateToken, getAllUser, deleteUser, updateUser, getUserById };
