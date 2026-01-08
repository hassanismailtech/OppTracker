export enum AppStatus {
  INTERESTED = 'Interested',
  DRAFTING = 'Drafting',
  SUBMITTED = 'Submitted',
  REJECTED = 'Rejected',
  OFFER = 'Offer'
}

export interface UserProfile {
  name: string;
  cvText: string;
  linkedinUrl: string;
  interests: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  url?: string;
  status: AppStatus;
  fitScore: number;
  fitReasoning: string;
  scamRiskScore: number; // 0-100, high is risky
  deadline: string | null;
  dateAdded: string;
  notes: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
  relatedOpportunityId?: string; // If the bot parsed an opp, link it here
  isProcessing?: boolean;
}

export enum View {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  PROFILE = 'profile',
}