export interface FeedbackForm {
  userId: string;
  text: string;
}

export interface FeedbackComponentProps {
  userId: string;
}

export interface ResponseGetFeedbackList {
  data: FeedbackForm[];
}
