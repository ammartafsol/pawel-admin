"use client";
import React from "react";
import classes from "./AddNewStaffModal.module.css";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Button from "@/components/atoms/Button";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark, IoMdKey } from "react-icons/io";
import IconInput from "@/components/molecules/IconInput/IconInput";
import Input from "@/components/atoms/Input/Input";
import { FaUser } from "react-icons/fa6";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { auditTrackingOptions } from "@/developementContent/Enums/enum";
import { MdEmail } from "react-icons/md";
import { useFormik } from "formik";
import { AddNewStaffSchema } from "@/formik/schema";
import { addNewStaffFormValues } from "@/formik/initialValues";

const AddNewStaffModal = ({ show, setShow }) => {
  const formik = useFormik({
    initialValues: addNewStaffFormValues,
    validationSchema: AddNewStaffSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    console.log("Form submitted:", values);
    // Add your API call here
    // setShow(false);
  };

  return (
    <div>
      <ModalSkeleton
        drawer={true}
        heading="Add New Staff"
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
              label="Add Staff"
              variant="outlined"
              leftIcon={<IoMdCheckmark color="var(--midnight-black)" />}
              onClick={() => formik.handleSubmit()}
            />
          </div>
        }
        show={show}
        setShow={setShow}
      >
        <div className={classes.iconInputContainer}>
          <IconInput icon={<FaUser size={22} />} title="Staff Name">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.staffName}
              setValue={(value) => formik.setFieldValue("staffName", value)}
              error={formik.touched.staffName && formik.errors.staffName}
            />
          </IconInput>
          <IconInput icon={<MdEmail size={22} />} title="Email">
            <Input
              inputClass={classes?.inputClassName}
              className={classes?.input}
              placeholder="Type here..."
              value={formik.values.email}
              setValue={(value) => formik.setFieldValue("email", value)}
              error={formik.touched.email && formik.errors.email}
            />
          </IconInput>
          <IconInput icon={<IoMdKey size={22} />} title="Permissions">
            <DropDown
              options={auditTrackingOptions}
              placeholder="Select Permissions"
              multi={true}
              values={
                formik.values.permissions && formik.values.permissions.length > 0
                  ? auditTrackingOptions.filter((opt) =>
                      formik.values.permissions.includes(opt.value)
                    )
                  : []
              }
              className={classes.dropdown}
              closeOnSelect={false}
              onChange={(value) => {
                const selectedValues =
                  value && value.length > 0
                    ? value.map((item) => item.value)
                    : [];
                formik.setFieldValue("permissions", selectedValues);
              }}
            />
            {formik.touched.permissions && formik.errors.permissions && (
              <div className={classes.errorText}>
                {formik.errors.permissions}
              </div>
            )}
          </IconInput>
        </div>
      </ModalSkeleton>
    </div>
  );
};

export default AddNewStaffModal;
