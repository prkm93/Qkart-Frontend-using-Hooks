import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const initialFormData = {
    username: "",
    password: "",
    confirmPassword: ""
  };
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  
  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
      try {
        
        setLoading(true);
        if (validateInput(formData)) {
          const response = await axios.post(`${config.endpoint}/auth/register`, {
            username: formData.username,
            password: formData.password
          });
          if (response.status === 201 && response.data.success) {
            displayMessage("Registered successfully", 'success');
            history.push("/login");
          } 
        }
        setLoading(false);

      } catch (err) {

        setLoading(false);
        const { response } = err;

        if (response) {
          if (response.status === 400 && response.data.success === false) {
            displayMessage(response.data.message, 'error');
          }
        } else {
          displayMessage("Something went wrong. Check that the backend is running, reachable and returns valid JSON.", "error");
        }
      }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {

    const { username, password, confirmPassword} = data;

    if (!username) {
      
      displayMessage("Username is a required field", "warning");
      return false;

    } else if (username.length < 6) {
      
      displayMessage("Username must be at least 6 characters", "warning");
      return false;

    } else if (!password) {
      
      displayMessage("Password is a required field", "warning");
      return false;

    } else if (password.length < 6) {
      
      displayMessage("Password must be at least 6 characters", "warning");
      return false;

    } else if (password !== confirmPassword) {
      
      displayMessage("Passwords do not match", "warning");
      return false;

    } else {
      return true;
    }
  };

  /**
   * 
   * @param {string} msg
   * Error message to be passed 
   * @param {string} errVariant
   * Type of error message(success, failure, warning) 
   * @returns {function}
   */
  const displayMessage = (msg, errVariant) => {
    return enqueueSnackbar(msg, { variant: errVariant });
  }

  /**
   * 
   * @param {string} e 
   * event value for each input field
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name] : e.target.value
    });
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={1} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            onChange={handleChange}
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            onChange={handleChange}
          />
          {
            loading ? 
            <Box sx={{pl: '10em'}}><CircularProgress/></Box> 
            : 
            <Button role='button' className="button" variant="contained" onClick={() => register(formData)}>
              Register
           </Button>
          }
          <p className="secondary-action">
            Already have an account?{" "}
            <Link className="link" to="/login">
             Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
