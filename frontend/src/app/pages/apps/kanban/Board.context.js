// Local Imports
import { createSafeContext } from 'utils/createSafeContext';

export const [BoardContextProvider, useBoardContext] = createSafeContext(
    "useBoardContext must be used within BoardProvider"
);
