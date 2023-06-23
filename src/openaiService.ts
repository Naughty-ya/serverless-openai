import openai from '../config/openai';
import { Prompt } from './types';

export async function chatGPT (list: Array<Prompt>) {
  const response = await openai.createChatCompletion({
    model : 'gpt-3.5-turbo',
    messages : [
      {
        'role' : 'system',
        'content' : 'mbti전문가의 입장으로 질문 Q 와 질문에 대한 대답 A 를 기준으로 A 가 mbti 유형의 T 성향인지, F 성향인지 판별하고 어떤 성향이 대략 몇 퍼센트인지 분석하고 대답해줘. 어떠한 설명도 하지말고 \'T:/d/d%,F:/d/d%\'이 정규식에 맞게만 대답 해줘. '
      },
      {
        role : 'user',
        content : `Q: ${list[0].question}\n A: ${list[0].answer}`
      },
      {
        role : 'user',
        content : `Q: ${list[1].question}\n A: ${list[1].answer}`
      },
      {
        role : 'user',
        content : `Q: ${list[2].question}\n A: ${list[2].answer}`
      },
      {
        role : 'user',
        content : `Q: ${list[3].question}\n A: ${list[3].answer}`
      },
      {
        role : 'user',
        content : `Q: ${list[4].question}\n A: ${list[4].answer}`
      }
    ],
  });
  /**
   * 이미지 생성 및 url 제공 API
   * const imgResponse = await openai.createImage({
   *     prompt : 'Cartoons resembling Disney movie characters',
   *     n : 1,
   *     size : '1024x1024'
   *   });
   * **/
  const { status, statusText, data } = response;
  if (status !== 200) {
    return {
      success: false,
      message: statusText
    };
  }
  return {
    success: true,
    data,
  };
}
