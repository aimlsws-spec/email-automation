import { createSafeContext } from "utils/createSafeContext";

export const [AddProductFormContextProvider, useAddProductFormContext] =
    createSafeContext(
        "useAddProductFormContext must be used within a AddProductFormProvider",
    );
