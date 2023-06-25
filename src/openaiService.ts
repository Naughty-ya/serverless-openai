import openai from '../config/openai';
import { Prompt } from './types';

async function resOpenAI (list: Array<Prompt>): Promise<any> {
  try {
    const response = await openai.createChatCompletion({
      model : 'gpt-3.5-turbo',
      messages : [
        {
          'role' : 'system',
          'content' : 'mbti전문가의 입장으로 질문 Q 와 질문에 대한 대답 A 를 기준으로 A 가 mbti 유형의 T 성향인지, F 성향인지 판별하고 어떤 성향이 대략 몇 퍼센트인지 분석하고 대답해줘. 어떠한 설명도 하지말고 \'T: %\'이 정규식에 맞게만 숫자로 대답 해줘. '
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

    if (
      response.data.choices[0].message.content.slice(0, 1) === 'T' &&
      response.data.choices[0].message.content.slice(-1) === '%' &&
      !response.data.choices[0].message.content.includes('F') &&
      !response.data.choices[0].message.content.includes('(')
    ) {
      return response.data.choices[0].message.content;
    } else {
      return await resOpenAI(list);
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

export async function chatGPT (list: Array<Prompt>) {
  const percent = await resOpenAI(list);

  if (!percent) {
    return false;
  }

  const response = await openai.createChatCompletion({
    model : 'gpt-3.5-turbo',
    messages : [
      {
        'role' : 'system',
        'content' : 'MBTI 전문가의 입장에서 T 성향이 몇 퍼센트인지 보고 F성향의 관점에서 너의 친구에게 말하는 느낌으로 100자 이내로 익살스럽고 재치있게 반말로 한 마디 해줘.'
      },{
      role : 'user',
      content : `${percent}`
      }
      ]
  })

  const { status, statusText, data } = response;
  if (status !== 200) {
    return {
      success: false,
      message: statusText,
    };
  }
  return {
    success: true,
    percent,
    message: data.choices[0].message.content,
  };
}
