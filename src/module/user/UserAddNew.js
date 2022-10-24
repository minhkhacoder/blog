/** @format */

import useFirebaseImage from "hooks/useFirebaseImage";
import React from "react";
import ImageUpload from "components/image/ImageUpload";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { userRole, userStatus } from "utils/constants";
import { useForm } from "react-hook-form";
import { Radio } from "components/checkbox";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field, FieldCheckboxes } from "components/field";
import { Button } from "components/button";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "firebase-app/firebase-config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import slugify from "slugify";
import { toast } from "react-toastify";

const UserAddNew = () => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { isValid, isSubmitting },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      username: "",
      avatar: "",
      status: userStatus.ACTIVE,
      role: userRole.USER,
      createdAt: new Date(),
    },
  });

  // * Hooks
  const {
    image,
    progress,
    handleSelectImage,
    handleDeleteImage,
    handleResetUpload,
  } = useFirebaseImage(setValue, getValues);

  const watchStatus = watch("status");
  const watchRole = watch("role");

  // * Handle submit new user
  const handleSubmitNewUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = collection(db, "users");
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      await addDoc(colRef, {
        fullname: values.fullname,
        email: values.email,
        password: values.password,
        username: slugify(values.username || values.fullname, {
          lower: true,
          replacement: "",
          trim: true,
        }),
        avatar: image,
        status: Number(values.status),
        role: Number(values.role),
        createdAt: serverTimestamp(),
      });
      toast.success("Add new user successfully!");
      reset({
        fullname: "",
        email: "",
        password: "",
        username: "",
        avatar: "",
        status: userStatus.ACTIVE,
        role: userRole.ADMIN,
        createdAt: new Date(),
      });
      handleResetUpload();
    } catch (error) {
      console.log(error);
      toast.error("Can not create new user");
    }
  };

  return (
    <>
      <DashboardHeading title="New user"></DashboardHeading>
      <form onSubmit={handleSubmit(handleSubmitNewUser)}>
        <div className="mb-10 text-center">
          <ImageUpload
            className="w-[200px] h-[200px] !rounded-full min-h-0 mx-auto"
            onChange={handleSelectImage}
            image={image}
            process={progress}
            handleDeleteImage={handleDeleteImage}
          ></ImageUpload>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Fullname</Label>
            <Input
              name="fullname"
              placeholder="Enter your fullname"
              control={control}
            ></Input>
          </Field>
          <Field>
            <Label>Username</Label>
            <Input
              name="username"
              placeholder="Enter your username"
              control={control}
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Email</Label>
            <Input
              name="email"
              placeholder="Enter your email"
              control={control}
              type="email"
            ></Input>
          </Field>
          <Field>
            <Label>Password</Label>
            <Input
              name="password"
              placeholder="Enter your password"
              control={control}
              type="password"
            ></Input>
          </Field>
        </div>
        <div className="form-layout">
          <Field>
            <Label>Status</Label>
            <FieldCheckboxes>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.ACTIVE}
                value={userStatus.ACTIVE}
              >
                Active
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.PENDING}
                value={userStatus.PENDING}
              >
                Pending
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === userStatus.BAN}
                value={userStatus.BAN}
              >
                Banned
              </Radio>
            </FieldCheckboxes>
          </Field>
          <Field>
            <Label>Role</Label>
            <FieldCheckboxes>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.ADMIN}
                value={userRole.ADMIN}
              >
                Admin
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.MOD}
                value={userRole.MOD}
              >
                Moderator
              </Radio>
              <Radio
                name="role"
                control={control}
                checked={Number(watchRole) === userRole.USER}
                value={userRole.USER}
              >
                User
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[200px]"
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitting}
        >
          Add new user
        </Button>
      </form>
    </>
  );
};

export default UserAddNew;
