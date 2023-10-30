import * as yup from "yup";

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email.")
    .required("Email is a required."),
});

export const passwordResetSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "Must be at least 8 characters.")
    .matches(
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
      "Password must contain at least one digit and one special character."
    )
    .required("Password is a required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Password do not match.")
    .required("Please confirm password."),
});
