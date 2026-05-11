// Import Dependencies
import { useEffect, useState } from "react";
import { EnvelopeIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router";

// Local Imports
import { Box, Button } from "components/ui";
import { fetchSenders } from "services/api";

// ----------------------------------------------------------------------

export function SendInitialEmailCard() {
  const navigate = useNavigate();
  const [senderInfo, setSenderInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = () => {
      fetchSenders()
        .then((data) => {
          console.log("[SendInitialEmailCard] Senders Data:", data);
          setSenderInfo(data);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    };
    load();
    const intervalId = setInterval(load, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const activeAccounts = senderInfo?.activeAccounts || 0;
  const hasActiveSenders = activeAccounts > 0;
  const remainingCapacity = senderInfo?.remainingCapacity || 0;
  const isCapacityFull = remainingCapacity <= 0 && hasActiveSenders;

  return (
    <Box className="relative flex flex-col rounded-lg bg-linear-to-br from-primary-600 to-primary-500 px-5 pb-5 overflow-hidden">
      {/* Decorative Background Icon */}
      <div className="absolute -right-6 -top-6 opacity-10">
        <EnvelopeIcon className="size-32 text-white" />
      </div>

      <div className="pt-8">
        <p className="text-3xl font-black text-white">
          Send Initial Email
        </p>
        <p className="mt-1 text-sm font-medium text-white/80">
          Start outreach using your saved email template
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className={`size-2 rounded-full ${hasActiveSenders ? 'bg-success-400 animate-pulse' : 'bg-error-400'}`} />
          <p className="text-sm font-bold text-white">
            {loading && !senderInfo ? "..." : activeAccounts} Active Accounts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-3">
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Daily Capacity</p>
              <p className="text-lg font-black text-white">
                {loading && !senderInfo ? "..." : `${senderInfo?.sentToday || 0}/${senderInfo?.dailyCapacity || 0}`}
              </p>
           </div>
           <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Remaining</p>
              <p className="text-lg font-black text-white">
                {loading && !senderInfo ? "..." : remainingCapacity}
              </p>
           </div>
        </div>
      </div>

      {!hasActiveSenders && !loading && (
        <div className="mt-4 flex items-center gap-2 rounded bg-error-400/20 p-2 text-[10px] font-bold text-white">
          <ExclamationTriangleIcon className="size-3.5" />
          <span>Add sender account in Settings to start</span>
        </div>
      )}

      <div className="mt-6">
        <Button
          unstyled
          disabled={!hasActiveSenders || isCapacityFull}
          className="w-full gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-primary-600 transition-all hover:bg-opacity-90 disabled:bg-white/20 disabled:text-white/40"
          onClick={() => navigate("/dashboards/send-email")}
        >
          <EnvelopeIcon className="size-4.5 shrink-0" />
          <span>{isCapacityFull ? 'Capacity Reached' : 'Start Campaign'}</span>
        </Button>
      </div>
    </Box>
  );
}
