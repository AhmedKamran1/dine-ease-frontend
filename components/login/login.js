import React from "react";
import Image from "next/image";
import LoginForm from "./form/form";

// Styles
import { Grid } from "@mui/material";
import { FormDivider } from "../UI";
import { SecondaryContainer } from "../UI";

const Login = () => {
  return (
    <SecondaryContainer container>
      <Grid item xs={12} md={5}>
        <LoginForm />
      </Grid>

      <FormDivider />

      <Grid item xs={0} md={6} display={{ xs: "none", md: "block" }}>
        <Image
          src={"/assets/images/food.svg"}
          width={800}
          height={800}
          alt="login-image"
        />
      </Grid>
    </SecondaryContainer>
  );
};

export default Login;
