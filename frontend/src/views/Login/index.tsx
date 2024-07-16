import React from "react";
import * as Yup from "yup";
import scss from "./login.module.scss";
import {
  Button,
  Card,
  Group,
  PasswordInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { FaUser } from "react-icons/fa";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import fetcher from "@/utils/fetcher";
import { getFingerprint } from "@/utils/fingerprint";
import { useRouter } from "next/router";

type LoginData = {
  username: string;
  password: string;
  roleId: string;
};

const validationSchema = Yup.object({
  username: Yup.string().required("email is required"),
  password: Yup.string().required("password is required"),
  roleId: Yup.string().required("Required"),
});
const Login = () => {
  const router = useRouter();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<LoginData> = async (data) => {
    try {
      const response = await fetcher("/auth/sign-in", "POST", {
        ...data,
        fp: getFingerprint(),
      });
      if (response.token) {
        window.sessionStorage.setItem("token", response.token);
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div className={scss.login_content}>
        <h1 className={scss.heading}>Login</h1>
        <Card>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <div className={scss.super_main_div}>
              <div className={scss.main_div}>
                <div className={scss.input_wrapper}>
                  <div className={scss.text_input}>
                    <Radio.Group
                      onChange={(value: any) => {
                        setValue("roleId", value);
                        clearErrors("roleId");
                      }}
                      label="Role"
                      value={getValues("roleId")}
                      error={errors.roleId?.message}
                    >
                      <Group mt="0.4rem">
                        <Radio value="2" label="Buyer" />
                        <Radio value="1" label="Seller" />
                      </Group>
                    </Radio.Group>
                  </div>
                  <div className={scss.text_input}>
                    <TextInput
                      label="Email"
                      error={errors.username?.message}
                      leftSection={<MdOutlineMailOutline />}
                      {...register("username")}
                      type="email"
                    />
                  </div>
                  <div className={scss.text_input}>
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      error={errors.password?.message}
                      {...register("password")}
                    />
                  </div>

                  <div className={scss.button_wrapper}>
                    <Button type="submit" fullWidth>
                      SignIn
                    </Button>
                  </div>
                  <p>
                    Dont have an account <Link href="/register">SignUp</Link>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Login;
