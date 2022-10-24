/** @format */

import slugify from "slugify";
import React from "react";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { Radio } from "components/checkbox";
import { Label } from "components/label";
import { Input } from "components/input";
import { Field, FieldCheckboxes } from "components/field";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebase-app/firebase-config";
import { categoryStatus } from "utils/constants";
import { Button } from "components/button";

const CategoryUpdate = () => {
  const {
    control,
    reset,
    watch,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm({
    mode: "onChange",
    defaultValues: {},
  });

  const [params] = useSearchParams();
  const cateId = params.get("id");
  const navigate = useNavigate();

  // * Get category from firebase
  useEffect(() => {
    async function fetchData() {
      const colRef = doc(db, "categories", cateId);
      const docData = await getDoc(colRef);
      reset(docData.data());
    }
    fetchData();
  }, [cateId, reset]);

  const watchStatus = watch("status");

  // * Handle update category
  const handleUpdateCategory = async (values) => {
    const colRef = doc(db, "categories", cateId);
    await updateDoc(colRef, {
      name: values.name,
      slug: slugify(values.name, { lower: true }),
      status: Number(values.status),
    });
    toast.success("Update category successfully!");
    navigate("/manage/category");
  };

  if (!cateId) return null;
  return (
    <div>
      <DashboardHeading
        title="Update category"
        desc={`Update your category id: ${cateId}`}
      ></DashboardHeading>
      <form onSubmit={handleSubmit(handleUpdateCategory)} autoComplete="off">
        <div className="form-layout">
          <Field>
            <Label>Name</Label>
            <Input
              control={control}
              name="name"
              placeholder="Enter your category name"
              required
            ></Input>
          </Field>
          <Field>
            <Label>Slug</Label>
            <Input
              control={control}
              name="slug"
              placeholder="Enter your slug"
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
                checked={Number(watchStatus) === categoryStatus.APPROVED}
                value={categoryStatus.APPROVED}
              >
                Approved
              </Radio>
              <Radio
                name="status"
                control={control}
                checked={Number(watchStatus) === categoryStatus.UNAPPROVED}
                value={categoryStatus.UNAPPROVED}
              >
                Unapproved
              </Radio>
            </FieldCheckboxes>
          </Field>
        </div>
        <Button
          kind="primary"
          className="mx-auto w-[250px]"
          type="submit"
          disabled={isSubmitting}
          isLoading={isSubmitting}
        >
          Update category
        </Button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
