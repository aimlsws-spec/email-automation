// Import Dependencies
import { PropTypes } from "prop-types";

// Local Imports
import { Avatar, Box } from "components/ui";

// ----------------------------------------------------------------------

export function SellerCard({ name, replyRate, totalSent, totalReplied }) {
  return (
    <Box className="px-4">
      {/* Header */}
      <div className="flex flex-col items-center space-y-3 pt-6 text-center">
        <Avatar
          size={20}
          classNames={{
            root: "rounded-full bg-linear-to-r from-primary-400 to-primary-600 p-0.5 shadow-lg shadow-primary-200 dark:shadow-none",
            display: "border-2 border-white text-xl font-bold dark:border-dark-700",
          }}
          name={name}
          initialColor="auto"
        />
        <div className="px-2">
          <p className="text-lg font-black text-gray-800 dark:text-dark-100 line-clamp-1">
            {name}
          </p>
          <p className="text-xs font-bold text-gray-400 dark:text-dark-400 mt-1 uppercase tracking-widest">
            Top Performing Campaign
          </p>
        </div>
      </div>

      {/* Reply Rate Progress */}
      <div className="mt-8 px-2">
        <div className="flex justify-between items-end mb-2">
           <p className="text-xs font-bold text-gray-500 dark:text-dark-300 uppercase tracking-tight">Reply Rate Performance</p>
           <p className="text-xl font-black text-primary-600 dark:text-primary-400">{replyRate}%</p>
        </div>
        <div className="h-2.5 w-full bg-gray-100 dark:bg-dark-800 rounded-full overflow-hidden border border-gray-200/50 dark:border-dark-600">
           <div 
             className="h-full bg-primary-500 rounded-full transition-all duration-1000 shadow-sm"
             style={{ width: `${replyRate}%` }}
           />
        </div>
      </div>

      {/* Volume Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-dark-800 p-3 rounded-xl border border-gray-100 dark:border-dark-700 text-center">
          <p className="text-2xl font-black text-gray-800 dark:text-dark-100">
            {totalSent}
          </p>
          <p className="text-[10px] font-bold uppercase text-gray-400 dark:text-dark-400">Total Sent</p>
        </div>
        <div className="bg-success-50 dark:bg-success-900/10 p-3 rounded-xl border border-success-100 dark:border-success-900/30 text-center">
          <p className="text-2xl font-black text-success dark:text-success-lighter">
            {totalReplied}
          </p>
          <p className="text-[10px] font-bold uppercase text-success-600 dark:text-success-400">Total Replies</p>
        </div>
      </div>

      <div className="h-12" />
    </Box>
  );
}

SellerCard.propTypes = {
  name:          PropTypes.string.isRequired,
  replyRate:     PropTypes.number.isRequired,
  totalSent:     PropTypes.number.isRequired,
  totalReplied:  PropTypes.number.isRequired,
};
