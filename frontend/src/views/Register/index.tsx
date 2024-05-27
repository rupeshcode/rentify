import React from "react";
import * as Yup from "yup";
import scss from "./register.module.scss";
import {
  Button,
  Card,
  Group,
  PasswordInput,
  Radio,
  TextInput,
} from "@mantine/core";
import { FaMobileAlt, FaUser } from "react-icons/fa";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MdOutlineMailOutline } from "react-icons/md";
import { toast } from "react-toastify";
import fetcher from "@/utils/fetcher";
import { useRouter } from "next/router";

type RegisterData = {
  firstName: string;
  lastName: string;
  password: string;
  roleId: string;
  username: string;
  mobile: string;
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("firstname is required"),
  lastName: Yup.string().required("lastname is required"),
  password: Yup.string().required("password is required"),
  roleId: Yup.string().required("roleId is required"),
  username: Yup.string().required("email is required"),
  mobile: Yup.string().required("Mobile is Required"),
});

const Register = () => {
  const router = useRouter();
  const {
    register,
    setValue,
    getValues,
    handleSubmit,
    clearErrors,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<RegisterData> = async (data) => {
    try {
      const response = await fetcher("/auth/register", "POST", data);

      if (response == "Registered") {
        toast.success("Registration successful!");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <>
      <h1 className={scss.heading}>Register</h1>

      <Card>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <div className="container">
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
                    <Radio value="1" label="Buyer" />
                    <Radio value="2" label="Seller" />
                  </Group>
                </Radio.Group>
              </div>
              <div className={scss.text_input}>
                <TextInput
                  leftSection={<FaUser />}
                  label="First Name"
                  placeholder="Enter your username"
                  error={errors.firstName?.message}
                  {...register("firstName")}
                />
              </div>
              <div className={scss.text_input}>
                <TextInput
                  leftSection={<FaUser />}
                  label="Last Name"
                  placeholder="Enter your username"
                  error={errors.lastName?.message}
                  {...register("lastName")}
                />
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
              <div className={scss.text_input}>
                <TextInput
                  label="Mobile"
                  error={errors.mobile?.message}
                  leftSection={<FaMobileAlt />}
                  {...register("mobile")}
                />
              </div>

              <div className={scss.button_wrapper}>
                <Button type="submit" fullWidth>
                  SignUp
                </Button>
              </div>
              <p>
                Already have an account? <Link href="/login">SignIn</Link>
              </p>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
};

export default Register;
