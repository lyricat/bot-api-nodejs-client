export interface ConversationResponse {
  conversation_id: string;
  creator_id: string;
  category: ConversationCategory;
  name: string;
  icon_url: string;
  announcement: string;
  created_at: string;
  code_id: string;
  code_url: string;

  participants: Participant[];
}

export type ConversationCategory = 'CONTACT' | 'GROUP';
export type ConversationAction = 'ADD' | 'REMOVE' | 'ROLE';
export type ConversationRole = 'OWNER' | 'ADMIN' | '';

export interface Participant {
  user_id: string;
  type?: 'participant';
  role?: ConversationRole;
  created_at?: string;
}

export interface ConversationCreateRequest {
  category: ConversationCategory;
  conversation_id: string;
  participants: Participant[];
  name?: string;
}

export interface ConversationUpdateRequest {
  name?: string;
  announcement?: string;
}

export interface ConversationMuteRequest {
  duration: number;
}

export interface ConversationClientRequest {
  createConversation(params: ConversationCreateRequest): Promise<ConversationResponse>;
  updateConversation(conversationID: string, params: ConversationUpdateRequest): Promise<ConversationResponse>;
  createContactConversation(userID: string): Promise<ConversationResponse>;
  createGroupConversation(conversationID: string, name: string, participant: Participant[]): Promise<ConversationResponse>;
  readConversation(conversationID: string): Promise<ConversationResponse>;
  managerConversation(conversationID: string, action: ConversationAction, participant: Participant[]): Promise<ConversationResponse>;
  addParticipants(conversationID: string, userIDs: string[]): Promise<ConversationResponse>;
  removeParticipants(conversationID: string, userIDs: string[]): Promise<ConversationResponse>;
  adminParticipants(conversationID: string, userIDs: string[]): Promise<ConversationResponse>;
  rotateConversation(conversationID: string): Promise<ConversationResponse>;
}