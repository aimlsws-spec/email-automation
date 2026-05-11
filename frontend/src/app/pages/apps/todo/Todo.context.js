// Local Imports
import { createSafeContext } from 'utils/createSafeContext';

export const [TodoContextProvider, useTodoContext] = createSafeContext(
    "useTodoContext must be used within TodoProvider"
);
