// Import Dependencies
import { DocumentDuplicateIcon } from "@heroicons/react/20/solid";
import { FaUpLong } from "react-icons/fa6";
import { toast } from "sonner";

// Local Imports
import { Box, Button, CopyButton } from "components/ui";

// ----------------------------------------------------------------------

export function Balance() {
  return (
    <Box className="rounded-lg bg-linear-to-br from-purple-500 to-indigo-600 px-4 pb-4">
      <div className="pt-3">
        <h2 className="text-sm-plus font-medium tracking-wide text-white">
          Your Balance
        </h2>
      </div>
      <div className="mt-2 flex w-9/12 min-w-0 items-center gap-1">
        <p className="truncate text-xs text-white/90">
          0x9CDBC28F0A6C13BB42ACBD3A3B366BFCAB07B8B1
        </p>
        <CopyButton value="0x9CDBC28F0A6C13BB42ACBD3A3B366BFCAB07B8B1">
          {({ copied, copy }) => {
            copied && toast.success("Your Wallet Address copied");
            return (
              <Button
                unstyled
                onClick={copy}
                className="size-5 shrink-0 rounded-full text-white hover:bg-white/20 focus:bg-white/20 active:bg-white/25"
              >
                <DocumentDuplicateIcon className="size-3.5" />
              </Button>
            );
          }}
        </CopyButton>
      </div>
      <div className="mt-4 text-3xl font-semibold text-white">$5,566.00</div>
      <div className="mt-3">
        <p className="text-xs text-white/90">Offers</p>
        <div className="flex justify-between">
          <span className="font-medium text-white">USD 35,000</span>
          <span className="text-right text-xs text-white/90">
            <span className="align-sub">(55%)</span>{" "}
            <FaUpLong className="inline size-2.5" />
          </span>
        </div>
      </div>
      <Button
        unstyled
        className="mt-6 w-full rounded-lg border border-white/10 bg-white/20 py-2 text-white hover:bg-white/30 focus:bg-white/30"
      >
        Up Your Balance
      </Button>
    </Box>
  );
}
