"use client";
import React, { useEffect, useState } from "react";
import classes from "./CreateCaseTypeModal.module.css";
import Input from "@/components/atoms/Input/Input";
import ModalSkeleton from "../ModalSkeleton/ModalSkeleton";
import Checkbox from "@/components/atoms/Checkbox";
import Button from "@/components/atoms/Button";
import DropDown from "@/components/molecules/DropDown/DropDown";
import { useFormik } from "formik";
import { CreateCaseTypeSchema } from "@/formik/schema";
import { createCaseTypeFormValues } from "@/formik/initialValues";
import { RiDeleteBinLine } from "react-icons/ri";
import { IoMdCheckmark } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import useAxios from "@/interceptor/axios-functions";
import RenderToast from "@/components/atoms/RenderToast";

const CreateCaseTypeModal = ({ show, setShow, selectedData, getCaseTypeData }) => {
  const [loading, setLoading] = useState("");
  const [jurisdictions, setJurisdictions] = useState([]);
  const { Post, Patch, Get } = useAxios();

  const formik = useFormik({
    initialValues: createCaseTypeFormValues,
    validationSchema: CreateCaseTypeSchema,
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  // Fetch jurisdictions for dropdown
  useEffect(() => {
    if (show) {
      fetchJurisdictions();
    }
  }, [show]);

  // Populate form when editing
  useEffect(() => {
    if (show) {
      if (selectedData) {
        const phases = selectedData.phases || [];
        // Sort phases by order before setting
        const sortedPhases = phases.length > 0 
          ? [...phases]
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((phase) => ({ name: phase.name, order: phase.order }))
          : [{ name: "", order: 1 }];
        
        formik.setValues({
          caseTypeName: selectedData.name || "",
          jurisdiction: selectedData.jurisdiction?._id || "",
          phases: sortedPhases,
          isActive: selectedData.status === "active" ? true : false,
        });
      } else {
        formik.resetForm();
      }
    }
  }, [selectedData, show]);

  const fetchJurisdictions = async () => {
    try {
      const { response } = await Get({ route: `admin/jurisdiction/all?status=active&limit=1000` });
      if (response && response.data) {
        const jurisdictionOptions = response.data.map((jurisdiction) => ({
          label: jurisdiction.name,
          value: jurisdiction._id,
        }));
        setJurisdictions(jurisdictionOptions);
      }
    } catch (error) {
      console.error("Error fetching jurisdictions:", error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading("loading");
    
    // Sort phases by order
    const sortedPhases = [...values.phases].sort((a, b) => a.order - b.order);
    
    const obj = {
      name: values.caseTypeName,
      jurisdiction: values.jurisdiction,
      phases: sortedPhases.map((phase) => ({
        name: phase.name,
        order: parseInt(phase.order),
      })),
      status: values.isActive ? "active" : "inactive",
    };

    try {
      const { response } = selectedData
        ? await Patch({
            route: `admin/case-type/update/${selectedData.slug}`,
            data: obj,
          })
        : await Post({
            route: "admin/case-type/create",
            data: obj,
          });

      if (response) {
        RenderToast({
          type: "success",
          message: selectedData
            ? "Case Type updated successfully"
            : "Case Type created successfully",
        });
        setShow(false);
        formik.resetForm();
        if (getCaseTypeData) {
          getCaseTypeData({ _status: "", _page: 1 });
        }
      }
    } catch (error) {
      RenderToast({
        type: "error",
        message: selectedData
          ? "Failed to update case type"
          : "Failed to create case type",
      });
    }
    setLoading("");
  };

  const handleAddPhase = () => {
    const currentPhases = formik.values.phases || [];
    const nextOrder = currentPhases.length > 0 
      ? Math.max(...currentPhases.map((p) => p.order || 0)) + 1
      : 1;
    const newPhases = [...currentPhases, { name: "", order: nextOrder }];
    formik.setFieldValue("phases", newPhases);
  };

  const handleRemovePhase = (index) => {
    const newPhases = formik.values.phases.filter((_, i) => i !== index);
    // Reorder remaining phases
    const reorderedPhases = newPhases.map((phase, idx) => ({
      ...phase,
      order: idx + 1,
    }));
    formik.setFieldValue("phases", reorderedPhases);
  };

  const handlePhaseChange = (index, field, value) => {
    const newPhases = [...formik.values.phases];
    newPhases[index] = {
      ...newPhases[index],
      [field]: field === "order" ? parseInt(value) || 1 : value,
    };
    formik.setFieldValue("phases", newPhases);
  };

  return (
    <div>
      <ModalSkeleton
        showCloseIcon={true}
        show={show}
        setShow={setShow}
        heading={selectedData ? "Edit Case Type" : "Create Case Type"}
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
                loading === "loading"
                  ? selectedData
                    ? "Updating..."
                    : "Creating..."
                  : selectedData
                  ? "Update Case Type"
                  : "Create Case Type"
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
            label="Case Type Name"
            placeholder="Enter Case Type Name"
            value={formik.values.caseTypeName}
            setValue={(value) => formik.setFieldValue("caseTypeName", value)}
            error={
              formik.touched.caseTypeName && formik.errors.caseTypeName
            }
          />

          <div className={classes.dropdownContainer}>
            <label className={classes.label}>Jurisdiction</label>
            <DropDown
              options={jurisdictions}
              placeholder="Select Jurisdiction"
              values={
                formik.values.jurisdiction
                  ? jurisdictions.filter(
                      (opt) => opt.value === formik.values.jurisdiction
                    )
                  : []
              }
              className={classes.dropdown}
              closeOnSelect={true}
              onChange={(value) => {
                const selectedValue =
                  value && value.length > 0 ? value[0]?.value : "";
                formik.setFieldValue("jurisdiction", selectedValue);
              }}
            />
            {formik.touched.jurisdiction && formik.errors.jurisdiction && (
              <div className={classes.errorText}>
                {formik.errors.jurisdiction}
              </div>
            )}
          </div>

          <div className={classes.phasesContainer}>
            <label className={classes.label}>Phases</label>
            <div className={classes.phasesList}>
              {formik.values.phases.map((phase, index) => (
                <div key={`phase-${index}`} className={classes.phaseItem}>
                  <div className={classes.phaseInputs}>
                    <Input
                      label={`Phase ${index + 1} Name`}
                      placeholder="Enter phase name"
                      value={phase.name}
                      setValue={(value) =>
                        handlePhaseChange(index, "name", value)
                      }
                      error={
                        formik.touched.phases?.[index]?.name &&
                        formik.errors.phases?.[index]?.name
                      }
                    />
                    <Input
                      label="Order"
                      type="number"
                      placeholder="Order"
                      value={phase.order || ""}
                      setValue={(value) =>
                        handlePhaseChange(index, "order", value)
                      }
                      error={
                        formik.touched.phases?.[index]?.order &&
                        formik.errors.phases?.[index]?.order
                      }
                    />
                  </div>
                  {formik.values.phases.length > 1 && (
                    <Button
                      label=""
                      variant="outlined"
                      leftIcon={<RiDeleteBinLine color="var(--red)" size={20} />}
                      onClick={() => handleRemovePhase(index)}
                      className={classes.removePhaseButton}
                    />
                  )}
                </div>
              ))}
            </div>
            <Button
              label="Add Phase"
              className={classes.addPhaseButton}
              variant="outlined"
              leftIcon={<IoAddCircle color="#5C5C5C" size={25} />}
              onClick={handleAddPhase}
            />
            {formik.touched.phases && formik.errors.phases && typeof formik.errors.phases === 'string' && (
              <div className={classes.errorText}>
                {formik.errors.phases}
              </div>
            )}
          </div>

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

export default CreateCaseTypeModal;

