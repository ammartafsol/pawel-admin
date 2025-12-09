"use client";
import React, { useState } from "react";
import classes from "./LoginTemplate.module.css";
import AuthWrapper from "@/components/atoms/AuthWrapper/AuthWrapper";
import Input from "@/components/atoms/Input/Input";
import Button from "@/components/atoms/Button";
import Checkbox from "@/components/atoms/Checkbox";
import { LoginSchema } from "@/formik/schema";
import useAxios from "@/interceptor/axios-functions";
import { useDispatch } from "react-redux";
import { loginFormValues } from "@/formik/initialValues";
import { saveLoginUserData } from "@/store/auth/authSlice";
import { setTokenCookie, setUserMetadataCookie } from "@/resources/utils/cookie";
import RenderToast from "@/components/atoms/RenderToast";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";

const LoginTemplate = () => {
  const [loading, setLoading] = useState("");
  const { Post } = useAxios();
  const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: loginFormValues,
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });
  const handleSubmit = async(values) => {
    if(values?.email?.includes("admin")){
       RenderToast({type:"success", message:"Admin login is not allowed"});
       router.push("/");
       return;
    }
    else{
      RenderToast({type:"error", message:"Invalid email or password"});
      return;
    }

  //   setLoading("loading");
  //   const obj = { email: values?.email, password: values?.password };
  //   const { response } = await Post({ route: "auth/admin/login", data: obj });
  // if(response){
  //   const token = response?.data?.token;
  //   const user = response?.data?.user;
  //   console.log("myuserdata", user);
  //   dispatch(saveLoginUserData(response?.data));
  //   setTokenCookie(token);
  //   setUserMetadataCookie(user);
  //   RenderToast({
  //     type: "success",
  //     message: "Login successful",
  //   });
  //   router.push("/");
  //   return;
  // }
  };

  return (
    <AuthWrapper
      title="Login to your account"
      description="Enter your details to login"
    >
      <div className={classes.loginForm}>
        <div className={classes.inputContainer}>
          <Input type="email" setValue={(e)=>{formik.setFieldValue("email", e)}} error={formik.touched.email && formik.errors.email} value={formik.values.email} label="Email" placeholder="Enter your email" />
          <Input type="password" setValue={(e)=>{formik.setFieldValue("password", e)}} error={formik.touched.password && formik.errors.password} value={formik.values.password} label="Password" placeholder="Enter your password" />
        <div className={classes.buttonContainer}> 
          <div className={classes.forgotPasswordContainer}>
            <Checkbox checked={formik.values.checkbox}  onChange={(e)=>{formik.setFieldValue("checkbox", e)}} label="Keep me logged in" />
            <div onClick={()=>{router.push("/forgot-password")}} className={classes.forgotPassword}>Forgot password?</div>
          </div>
          <Button
            variant="primary"
            onClick={()=>{formik.handleSubmit()}}
            label={loading === "loading" ? "Please wait..." : "Sign In"}
            className={classes.loginButton}
            disabled={loading === "loading"}
          />
        </div>
        </div>
      </div>
    </AuthWrapper>
  );
};

export default LoginTemplate;
