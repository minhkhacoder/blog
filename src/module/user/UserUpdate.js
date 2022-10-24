/** @format */

import useFirebaseImage from "hooks/useFirebaseImage";
import React, { useEffect } from "react";
import ImageUpload from "components/image/ImageUpload";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { useSearchParams } from "react-router-dom";
import { userRole, userStatus } from "utils/constants";
import { useForm } from "react-hook-form";
import { Radio } from "components/checkbox";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field, FieldCheckboxes } from "components/field";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "firebase-app/firebase-config";
import { Button } from "components/button";
import { toast } from "react-toastify";
import { updateProfile } from "firebase/auth";
import { Textarea } from "components/textarea";

const UserUpdate = () => {
  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm({
    mode: "onChange",
  });

  const watchStatus = watch("status");
  const watchRole = watch("role");

  const [param] = useSearchParams();
  const userId = param.get("id");
  const imageUrl = getValues("avatar");
  const imageRegex = /%2F(\S+)\?/gm.exec(imageUrl);
  const imageName = imageRegex?.length > 0 ? imageRegex[1] : null;

  // * Hooks
  const { image, setImage, progress, handleSelectImage, handleDeleteImage } =
    useFirebaseImage(setValue, getValues, imageName, deleteAvatar);

  // * Handle update user
  const handleUpdateUser = async (values) => {
    if (!isValid) return;
    try {
      const colRef = doc(db, "users", userId);
      await updateDoc(colRef, {
        ...values,
        avatar: image,
      });
      await updateProfile(auth.currentUser, {
        photoURL: image,
      });
      toast.success("Updated user successfully!");
    } catch (error) {
      toast.error("Update user error");
    }
  };

  // * Delete avatar user
  async function deleteAvatar() {
    const colRef = doc(db, "users", userId);
    await updateDoc(colRef, {
      avatar: "",
    });
  }

  useEffect(() => {
    setImage(imageUrl);
  }, [imageUrl, setImage]);

  // * Reset data user
  useEffect(() => {
    async function fetchData() {
      if (!userId) return;
      const colRef = doc(db, "users", userId);
      const docData = await getDoc(colRef);
      reset(docData && docData.data());
    }
    fetchData();
  }, [reset, userId]);

  if (!userId) return null;

  return (
    <>
      <DashboardHeading title="Update user"></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateUser)}>
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
        <div className="mb-10">
          <Field>
            <Label>Description</Label>
            <Textarea
              name="description"
              placeholder="Enter your description"
              control={control}
            ></Textarea>
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
          Update user
        </Button>
      </form>
    </>
  );
};

export default UserUpdate;
