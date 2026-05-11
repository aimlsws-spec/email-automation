// Import Dependencies
import { useEffect, useState } from "react";

// Local Imports
import { fetchDashboard } from "services/api";
import { TransactionCard } from "./TransactionCard";

// ----------------------------------------------------------------------

export function Transactions() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const load = () => fetchDashboard().then((d) => setEvents(d.events || [])).catch(console.error);
    load();
    const intervalId = setInterval(load, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-12 flex flex-col sm:col-span-6 lg:col-span-4">
      <div className="flex min-w-0 items-center justify-between">
        <h2 className="font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Recent Email Events
        </h2>
      </div>
      <div className="mt-3 flex flex-1 flex-col justify-between space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-dark-300">No email events yet.</p>
        ) : (
          events.map((event, i) => (
            <TransactionCard
              key={i}
              name={event.lead_name}
              avatar={null}
              time={event.timestamp ? new Date(event.timestamp).toLocaleString() : ""}
              action={event.action}
            />
          ))
        )}
      </div>
    </div>
  );
}
