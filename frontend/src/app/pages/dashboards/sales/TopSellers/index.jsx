// Import Dependencies
import { useEffect, useState } from "react";
import { register } from "swiper/element/bundle";

// Local Imports
import { Card } from "components/ui";
import { SellerCard } from "./SellerCard";
import { useLocaleContext } from "app/contexts/locale/context";
import { fetchAnalyticsOverview } from "services/api";

// ----------------------------------------------------------------------

register();

export function TopSellers() {
  const { direction } = useLocaleContext();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchAnalyticsOverview().then(data => setCampaigns(data.topCampaigns || [])).catch(console.error);
  }, []);

  return (
    <Card className="pb-4">
      <div className="flex min-w-0 items-center justify-between px-4 py-3">
        <h2 className="min-w-0 font-medium tracking-wide text-gray-800 dark:text-dark-100">
          Top Campaigns
        </h2>
      </div>

      {campaigns.length === 0 ? (
        <p className="px-4 py-12 text-center text-sm text-gray-400 dark:text-dark-300">
          No performance data yet. Send emails to see rankings.
        </p>
      ) : (
        <swiper-container
          pagination
          pagination-clickable
          slides-per-view="1"
          dir={direction}
          space-between="16"
        >
          {campaigns.map((c) => (
            <swiper-slide key={c.campaign_id}>
              <SellerCard
                name={c.campaign_name}
                replyRate={parseFloat(c.reply_rate)}
                totalSent={c.sent}
                totalReplied={c.replies}
              />
            </swiper-slide>
          ))}
        </swiper-container>
      )}
    </Card>
  );
}
