export interface Dhis2MessageConversation {
  subject: string;
  messages: Array<{
    text: string;
  }>;
}
