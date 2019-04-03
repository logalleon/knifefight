type TeamDomain = '352inc';
type Command = '/knifefight';
type ResponseType = 'in_channel' | 'ephermeral';

enum Orientation {
  Left,
  Right
}

interface SlackRequest {
  token: string,
  team_id: string,
  team_domain: TeamDomain,
  channel_id: string,
  channel_name: string,
  user_id: string,
  user_name: string,
  command: Command,
  text: string,
  response_url: string,
  trigger_id: string,
}

interface Attachment {
  text: string
}

interface SlackResponse {
  response_type: ResponseType,
  text: string,
  attachments?: Attachment[]
}

interface Combatant {
  head: string,
  legs: string,
  weapon: string
}

export { SlackRequest, Attachment, SlackResponse, Combatant, Orientation }