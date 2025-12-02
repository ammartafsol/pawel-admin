"use client";
import React, { useEffect, useState } from "react";
import classes from "./CreateJurisdictionModal.module.css";
import Input from "@/components/atoms/Input/Input";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import { TextArea } from "@/components/atoms/TextArea/TextArea";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import { useFormik } from "formik";
import { CreateJurisdictionSchema } from "@/formik/schema";
import { createJurisdictionFormValues } from "@/formik/initialValues";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";
import useDebounce from "@/resources/hooks/useDebounce";

const CreateJurisdictionModal = ({ show, setShow, selectedData, getJurisdictionData }) => {
  const [loading, setLoading] = useState("");
  const { Post, Patch } = useAxios();
  const [search,setSearch] = useState("");
  const formik = useFormik({
    initialValues: createJurisdictionFormValues,
    validationSchema: CreateJurisdictionSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading("loading");
    const obj = {
      name: values.jurisdictionName,
      description: values.description,
      status: values.isActive ? "active" : "inactive",
    };
 const {response} = selectedData ? await Patch({
    route: `admin/jurisdiction/update/${selectedData.slug}`,
    data: obj,
   }) : await Post({
    route: "admin/jurisdiction/create",
    data: obj,
   });
   
    if (response) {
      RenderToast({
        type: "success",
        message: selectedData ? "Jurisdiction updated successfully" : "Jurisdiction created successfully",
      });
      setShow(false);
      formik.resetForm();
      setShow(false);
      getJurisdictionData();
    }
    setLoading("");
    // Add your API call here
    // setShow(false);
  };

  useEffect(()=>{
    if(selectedData){
      formik.setValues({
        jurisdictionName: selectedData.name,
        description: selectedData.description,
        isActive: selectedData.status === "active" ? true : false,
      });
    }
  },[selectedData])

  return (
    <div>
      <ModalSkeleton
        showCloseIcon={true}
        show={show}
        setShow={setShow}
        heading={"Create Jurisdiction"}
        footerData={
          <div className={classes.footerDiv}>
            <Button
              label=""
              variant="outlined"
              onClick={() => {
                formik.resetForm();
                setShow(false);
              }}
              leftIcon={<RiDeleteBinLine color="var(--red)" size={24} />}
            />
            <Button
              label={`${
                loading === "loading" ? selectedData ? "Updating..." : "Creating..." : selectedData ? "Update Jurisdiction" : "Create Jurisdiction"
              }`}
              variant="outlined"
              loading={loading === "loading"}
              leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
              onClick={() => formik.handleSubmit()}
            />
          </div>
        }
      >
        <div className={classes.formContainer}>
          <Input
            label="Jurisdiction Name"
            placeholder="Enter Jurisdiction Name"
            value={formik.values.jurisdictionName}
            setValue={(value) =>
              formik.setFieldValue("jurisdictionName", value)
            }
            error={
              formik.touched.jurisdictionName && formik.errors.jurisdictionName
            }
          />
          <TextArea
            label="Description"
            placeholder="Enter Description"
            value={formik.values.description}
            setValue={(value) => formik.setFieldValue("description", value)}
            error={formik.touched.description && formik.errors.description}
          />
          <Checkbox
            label="Is Active"
            checked={formik.values.isActive}
            onChange={(checked) => formik.setFieldValue("isActive", checked)}
            error={formik.touched.isActive && formik.errors.isActive}
          />
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default CreateJurisdictionModal;
