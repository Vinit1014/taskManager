import { z } from 'zod';

// Define the schema for login form validation
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long")
});

// Function to validate form data
export const validateLogin = (data:any) => {
  try {
    loginSchema.parse(data);  // This will throw an error if validation fails
    return { success: true, errors: null };
  } catch (err:any) {
    // Extracting and returning errors in a readable format
    const errors = err.errors.map((error:any) => error.message);
    return { success: false, errors };
  }
};


const signUpSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters" }),
    email: z.string().min(1, { message: "Email is required" }).email("Please enter a valid email address"), 
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const validateSignUp = (data:any) => {
    try {
      signUpSchema.parse(data);
      return { success: true, errors: [] };
    } catch (e:any) {
      return { success: false, errors: e.errors.map((err:any) => err.message) };
    }
};

// export const getInitials = (fullName:string) => {
//     if (!fullName) return '';
  
//     const nameParts = fullName.trim().split(' ');
//     const firstNameInitial = nameParts[0] ? nameParts[0][0].toUpperCase() : '';
//     const lastNameInitial = nameParts[1] ? nameParts[1][0].toUpperCase() : '';
  
//     return `${firstNameInitial}${lastNameInitial}`;
// };
