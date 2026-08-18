'use strict';

function normalizedStatus(value) {
  return String(value || '').trim().toLowerCase();
}

function isCampaignFollowUpPaused(campaignRowOrLead) {
  if (!campaignRowOrLead) return true;
  
  // Handle lead object format or campaign object format
  const followupEnabled = campaignRowOrLead.campaign_followup_enabled !== undefined
    ? campaignRowOrLead.campaign_followup_enabled
    : campaignRowOrLead.followup_enabled;
    
  if (followupEnabled === 0 || followupEnabled === false) return true;

  const status = campaignRowOrLead.campaign_status !== undefined
    ? campaignRowOrLead.campaign_status
    : campaignRowOrLead.status;

  return ['paused', 'archived', 'stopped', 'cancelled', 'canceled'].includes(normalizedStatus(status));
}

function logFollowUpCheck(obj1, obj2, obj3, obj4) {
  let campaignId = '';
  let campaignName = '';
  let automationEnabled = false;
  let isSelected = false;
  let followupEnabled = null;
  let status = null;

  if (obj2 && typeof obj2 === 'object') {
    // 4-argument signature: logFollowUpCheck(job, campaignRow, automationEnabled, isSelected)
    const job = obj1;
    const campaignRow = obj2;
    automationEnabled = obj3;
    isSelected = obj4;

    campaignId = job?.campaign_id || '';
    campaignName = campaignRow?.name || '';
    followupEnabled = campaignRow?.followup_enabled;
    status = campaignRow?.status;
  } else {
    // 3-argument signature: logFollowUpCheck(leadOrCampaign, automationEnabled, isSelected)
    const leadOrCampaign = obj1;
    automationEnabled = obj2;
    isSelected = obj3;

    campaignId = leadOrCampaign?.campaign_id || leadOrCampaign?.id || '';
    campaignName = leadOrCampaign?.campaign_name || leadOrCampaign?.name || '';
    
    followupEnabled = leadOrCampaign?.campaign_followup_enabled !== undefined
      ? leadOrCampaign.campaign_followup_enabled
      : leadOrCampaign?.followup_enabled;

    status = leadOrCampaign?.campaign_status !== undefined
      ? leadOrCampaign.campaign_status
      : leadOrCampaign?.status;
  }

  const followupStatus = followupEnabled === 0 || followupEnabled === false
    ? 'paused'
    : normalizedStatus(status) || 'active';

  const automationStatus = automationEnabled ? 'active' : 'paused';

  console.log(
    `[FOLLOWUP_CHECK] campaign_id=${campaignId} campaign_name=${JSON.stringify(campaignName)} ` +
    `automation_status=${automationStatus} followup_status=${followupStatus} is_selected=${isSelected}`
  );
}

module.exports = {
  normalizedStatus,
  isCampaignFollowUpPaused,
  logFollowUpCheck
};
