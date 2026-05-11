// Local Imports
import { createSafeContext } from 'utils/createSafeContext';

export const [ChatContextProvider, useChatContext] = createSafeContext(
    "useChatContext must be used within ChatProvider"
);
