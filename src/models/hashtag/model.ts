import { Schema, model } from 'mongoose';

/**
 * 프리셋에 포함된 해시태그 모델
 */
export interface HashtagType {
  content: string;
}

export const Hashtag = new Schema<HashtagType>(
  {
    content: { type: String, required: true },
  },
  {
    versionKey: false,
  },
);

export default model<HashtagType>('hashtags', Hashtag);
