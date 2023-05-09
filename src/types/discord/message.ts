export interface Attachment {
  /** name of file attached */
  filename:	string;
  /** description for the file (max 1024 characters) */
  description: string;
  /** the attachment's media type */
  content_type: string;
  /** size of file in bytes */
  size: number;
  /** source url of file */
  url: string;
  /** a proxied url of file */
  proxy_url: string;
  /** height of file (if image) */
  height: number | null;
  /** width of file (if image) */
  width: number | null;
  /** whether this attachment is ephemeral */
  ephemeral?:	boolean;
  /** the duration of the audio file (currently for voice messages) */
  duration_secs: number;
  /** base64 encoded bytearray representing a sampled waveform (currently for voice messages) */
  waveform: string;
}

export interface Message {
  id: string;
  type: 0; // TODO
  flags: 0; // TODO
  content: string;
  channel_id: string;

  tts: boolean;
  pinned: boolean;

  timestamp: string;

  attachments: Attachment[];
  components: []; // TODO
  embeds: []; // TODO
  mentions: []; // TODO

  author: {
    id: string;
    username: string;
  };
}
