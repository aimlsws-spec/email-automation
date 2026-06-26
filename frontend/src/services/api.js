const BASE = '/api';

async function getJSON(url) {
  try {
    const res = await fetch(url, { cache: 'no-store' });
    
    if (!res.ok) {
      console.error(`API error: ${res.status} on ${url}`);
      return null;
    }
    
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      console.error(`Expected JSON but got ${contentType} — check if backend is running.`);
      return null;
    }
    
    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      console.error("Invalid JSON response from API", err);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error(`Network error or fetch failed for ${url}:`, err);
    return null;
  }
}

// Unified Dashboard Summary
export async function fetchDashboardSummary() {
  const json = await getJSON(`${BASE}/dashboard/summary`);
  return json?.success ? json.data : null;
}

// Compatibility Wrappers
export async function fetchDashboard() {
  const json = await getJSON(`${BASE}/dashboard`);
  if (!json?.success || !json.data) return { metrics: {} };
  const data = json.data;
  return {
    metrics: {
      emailsSentToday:     data.emailsSentToday     || 0,
      activeCampaigns:     data.activeCampaigns     || 0,
      totalLeads:          data.totalLeads          || 0,
      replyRate:           data.replyRate           || 0,
      emailsSentTotal:     data.emailsSentTotal     || 0,
      replyCount:          data.replyCount          || 0,
      convertedLeads:      data.convertedLeads      || 0,
      emailsSentYesterday: data.emailsSentYesterday || 0,
    }
  };
}

export async function fetchAutomationStats() {
  const json = await getJSON(`${BASE}/dashboard/automation`);
  return json?.success ? json.data : {};
}

export async function fetchActivityRecent() {
  const data = await fetchDashboardSummary();
  if (!data?.recentActivity) return [];
  
  // Standardize activity format
  return data.recentActivity.map(item => ({
    email: item.email,
    subject: item.subject,
    type: item.type || item.status,
    timestamp: item.timestamp,
    campaign_name: item.campaign_name || "Outreach"
  }));
}

export async function fetchAnalyticsOverview() {
  const json = await getJSON(`${BASE}/dashboard/summary`);
  if (!json?.success) return null;
  return json.data;
}

export async function fetchTopCampaignSingle() {
  const json = await getJSON(`${BASE}/campaigns/top`);
  if (!json?.success || !json.data) return {};
  return { campaign: json.data };
}

export async function fetchAdvancedStats() {
  const json = await getJSON(`${BASE}/dashboard/advanced-stats`);
  return {
    sent_rate:       json?.sent_rate       ?? 0,
    converted_leads: json?.converted_leads ?? 0,
    reply_rate:      json?.reply_rate      ?? 0,
  };
}

// Independent Entities
export async function fetchSenders() {
  const json = await getJSON(`${BASE}/senders/stats`);
  return json?.success ? json.data : null;
}

export async function fetchLeads(campaignId = null) {
  const url = campaignId ? `${BASE}/leads?campaignId=${campaignId}` : `${BASE}/leads`;
  const data = await getJSON(url);
  // /api/leads returns a raw array; guard against null on network error
  return Array.isArray(data) ? data : [];
}

export async function fetchCampaigns() {
  const json = await getJSON(`${BASE}/campaigns/status`);
  return json?.success ? json.campaigns : [];
}

export async function fetchCampaign(id) {
  return getJSON(`${BASE}/campaigns/${id}`);
}

export async function deleteQueueItems(ids) {
  const res = await fetch(`${BASE}/queue/items`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });
  return res.json();
}

export async function deleteFollowupQueueItems(items) {
  try {
    const res = await fetch(`${BASE}/followup-queue/items`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Delete followup queue items failed: ${res.status} ${text}`);
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }
    return res.json();
  } catch (err) {
    console.error('Delete followup queue items network error:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteCampaign(id) {
  try {
    const res = await fetch(`${BASE}/campaigns/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const text = await res.text();
      console.error(`Delete campaign failed: ${res.status} ${text}`);
      return { success: false, error: `HTTP ${res.status}: ${text}` };
    }
    return res.json();
  } catch (err) {
    console.error('Delete campaign network error:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchAnalyticsActivity(range = 'daily') {
  const json = await getJSON(`${BASE}/analytics/activity?range=${range}`);
  return json || [];
}

export async function fetchFollowUpAnalytics() {
  const json = await getJSON(`${BASE}/followup/analytics`);
  return json?.success ? json : { leads: [], summary: {} };
}

// Template CRUD
export async function fetchTemplates() {
  const json = await getJSON(`${BASE}/templates`);
  return json?.success ? json.data : [];
}

export async function fetchTemplate(id) {
  const json = await getJSON(`${BASE}/templates/${id}`);
  return json?.success ? json.data : null;
}

export async function saveTemplate({ id, name, html_content, template_type }) {
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${BASE}/templates/${id}` : `${BASE}/templates`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, html_content, template_type: template_type || 'html' }),
  });
  const text = await res.text();
  if (!text) throw new Error('Server returned empty response — check backend logs');
  let json;
  try { json = JSON.parse(text); } catch { throw new Error('Invalid JSON from server: ' + text.slice(0, 200)); }
  if (!json.success) throw new Error(json.error || 'Failed to save template');
  return json.data;
}

export async function deleteTemplate(id) {
  const res = await fetch(`${BASE}/templates/${id}`, { method: 'DELETE' });
  const text = await res.text();
  if (!text) throw new Error('Server returned empty response');
  let json;
  try { json = JSON.parse(text); } catch { throw new Error('Invalid JSON from server'); }
  if (!json.success) throw new Error(json.error || 'Failed to delete template');
}

// Follow-up Templates (campaign-linked)
export async function fetchFollowupTemplates(campaignTemplateId) {
  // Use a direct fetch instead of the shared getJSON so we can distinguish
  // a genuine server error from a "route not yet available" 404, and avoid
  // flooding the console when the backend is temporarily unreachable.
  try {
    const res = await fetch(
      `${BASE}/followup-templates?campaign_template_id=${campaignTemplateId}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      // 404 means the route isn't registered yet (server restart pending).
      // Return empty array silently — the UI shows "no stages" rather than crashing.
      if (res.status !== 404) {
        console.error(`[followup-templates] API error ${res.status}`);
      }
      return [];
    }
    const json = await res.json().catch(() => null);
    return json?.success ? json.data : [];
  } catch {
    // Network error or JSON parse failure — return empty array silently.
    return [];
  }
}

export async function saveFollowupTemplate({ id, campaign_template_id, followup_stage, delay_value, delay_unit, subject, body }) {
  const method = id ? 'PUT' : 'POST';
  const url    = id ? `${BASE}/followup-templates/${id}` : `${BASE}/followup-templates`;
  const payload = id
    ? { delay_value, delay_unit, subject, body }
    : { campaign_template_id, followup_stage, delay_value, delay_unit, subject, body };
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  if (!text) throw new Error('Server returned empty response');
  let json;
  try { json = JSON.parse(text); } catch { throw new Error('Invalid JSON from server: ' + text.slice(0, 200)); }
  if (!json.success) throw new Error(json.error || 'Failed to save follow-up template');
  return json.data;
}

export async function deleteFollowupTemplate(id) {
  const res = await fetch(`${BASE}/followup-templates/${id}`, { method: 'DELETE' });
  const text = await res.text();
  if (!text) throw new Error('Server returned empty response');
  let json;
  try { json = JSON.parse(text); } catch { throw new Error('Invalid JSON from server'); }
  if (!json.success) throw new Error(json.error || 'Failed to delete follow-up template');
}

// ─── Queue Monitor ────────────────────────────────────────────────────────────

export async function fetchQueueStats() {
  const json = await getJSON(`${BASE}/queue/stats`);
  return json?.success ? json.data : null;
}

export async function fetchQueueSenders() {
  const json = await getJSON(`${BASE}/queue/senders`);
  return json?.success ? json.data : [];
}

export async function fetchQueueList(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') qs.set(k, v); });
  const json = await getJSON(`${BASE}/queue/list?${qs}`);
  return json?.success ? { data: json.data, total: json.total, page: json.page, limit: json.limit } : { data: [], total: 0, page: 1, limit: 50 };
}

export async function fetchFollowupQueueList(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== undefined && v !== '') qs.set(k, v); });
  const json = await getJSON(`${BASE}/followup-queue/list?${qs}`);
  return json?.success ? { data: json.data, total: json.total, page: json.page, limit: json.limit } : { data: [], total: 0, page: 1, limit: 50 };
}
