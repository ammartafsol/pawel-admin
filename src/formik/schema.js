import { emailRegex } from "@/resources/utils/regex";
import * as Yup from "yup";

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const ForgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test(
      "no-special-chars",
      "Email contains invalid characters",
      (value) => !value || emailRegex.test(value)
    ),
});

export const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export const CreateNewCaseSchema = Yup.object({
  caseType: Yup.string().required("Case Type is required"),
  clientName: Yup.string().required("Client Name is required"),
  reference: Yup.string().required("Reference is required"),
  trademarkName: Yup.string().required("Trademark Name/No. is required"),
  jurisdiction: Yup.string().required("Jurisdiction is required"),
  deadlines: Yup.array().of(
    Yup.object({
      date: Yup.string().required("Deadline date is required"),
      title: Yup.string().required("Deadline title is required"),
    })
  ),
  primaryStaff: Yup.string().required("Primary staff is required"),
  secondaryStaff: Yup.string().required("Secondary staff is required"),
});

export const AddNoteSchema = Yup.object({
  noteTitle: Yup.string().required("Note Title is required"),
  description: Yup.string().required("Description is required"),
  permissible: Yup.string().required("Permissible is required"),
});

export const ReplySupportSchema = Yup.object({
  message: Yup.string().required("Message is required"),
});

export const AddNewStaffSchema = Yup.object({
  staffName: Yup.string().required("Staff Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .test(
      "no-special-chars",
      "Email contains invalid characters",
      (value) => !value || emailRegex.test(value)
    ),
  permissions: Yup.array()
    .min(1, "At least one permission is required")
    .required("Permissions are required"),
});

export const CreateJurisdictionSchema = Yup.object({
  jurisdictionName: Yup.string().required("Jurisdiction Name is required"),
  description: Yup.string(),
  isActive: Yup.boolean(),
});

export const CreateCaseTypeSchema = Yup.object({
  caseTypeName: Yup.string().required("Case Type Name is required"),
  jurisdiction: Yup.string().required("Jurisdiction is required"),
  phases: Yup.array()
    .min(1, "At least one phase is required")
    .of(
      Yup.object({
        name: Yup.string().required("Phase name is required"),
        order: Yup.number().required("Phase order is required").min(1),
      })
    ),
  isActive: Yup.boolean(),
});