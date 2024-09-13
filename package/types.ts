export interface AnalyticsEvent {
  analytic_type: "pageview" | "click" | "custom";
  api_key: string;
  timestamp: string;
  visitor_id: string;
  page: string;
  referrer?: string;
  country?: string;
  operating_system: string;
  browser: string;
  user_id?: string;
  metadata?: Record<string, any>;
}
