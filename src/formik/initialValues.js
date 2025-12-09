export const loginFormValues = {
  email: "",
  password: "",
  checkbox: false,
};

export const signUpFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
};

export const updatePasswordValues = {
  currentPassword: "",
  password: "",
  confirmPassword: "",
};

export const forgotPasswordValues = {
  email: "",
};

export const resetPasswordValues = {
  password: "",
  confirmPassword: "",
};

export const createNewCaseFormValues = {
  caseType: "",
  clientName: "",
  reference: "",
  trademarkName: "",
  jurisdiction: "",
  deadlines: [{ title: "", internalDeadline: "", officeDeadline: "" }],
  primaryStaff: "",
  secondaryStaff: "",
};

export const addNoteFormValues = {
  noteTitle: "",
  description: "",
  permissible: "",
};

export const replySupportFormValues = {
  message: "",
};

export const addNewStaffFormValues = {
  staffName: "",
  email: "",
  permissions: [],
};

export const createJurisdictionFormValues = {
  jurisdictionName: "",
  description: "",
  isActive: true,
};

export const createCaseTypeFormValues = {
  caseTypeName: "",
  jurisdiction: "",
  phases: [{ name: "", order: 1 }],
  isActive: true,
};