// Import Dependencies
import PropTypes from "prop-types";
import { useReducer } from "react";

// Local Imports
import { KYCFormContextProvider } from "./KYCFormContext";

// ----------------------------------------------------------------------

const initialState = {
  formData: {
    personalInfo: {
      firstName: "",
      lastName: "",
      middleName: "",
      email: "",
      dialCode: "",
      phone: "",
      gender: "",
      dateOfBirth: null,
      matrialStatus: "",
      nationality: "",
    },
    addressInfo: {
      permanentAddress: {
        country: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
      },
      isSameCorrespondenceAddress: true,
      correspondenceAddress: {
        country: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        zipCode: "",
      },
    },
    identifyDocument: {
      type: "passport",
      imageFront: null,
      imageBack: null,
      passportPage: null,
    },
    declaration: {
      agreed: false,
      fullName: "",
      dateSigned: "",
    },
  },
  stepStatus: {
    personalInfo: {
      isDone: false,
    },
    addressInfo: {
      isDone: false,
    },
    identifyDocument: {
      isDone: false,
    },
    declaration: {
      isDone: false,
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_FORM_DATA":
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      };
    case "SET_STEP_STATUS":
      return {
        ...state,
        stepStatus: {
          ...state.stepStatus,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};

export function KYCFormProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return (
    <KYCFormContextProvider value={value}>{children}</KYCFormContextProvider>
  );
}

KYCFormProvider.propTypes = {
  children: PropTypes.node,
};
