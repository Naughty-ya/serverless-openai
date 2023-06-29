import redis from '../config/redis';
import openai from '../config/openai';
import { Prompt } from './types';

export async function getAverage (data: string) {
  try {
    let num;
    if (data.includes('F')) {
      num = data.split(' F')[0].slice(3, -1);
    } else {
      num = data.slice(3).includes('(') ? data.split(' ')[0].slice(2, -1) : data.slice(3, -1);
    }

    const average = await redis.get('average');
    if (!average) {
      await redis.set('average', 70);
      await redis.rpush('averageList', num);
      return {
        success: true,
        average: `${Math.floor((50 + Number(num) / 2))}%`,
        rate: '60%',
      }
    } else {
      await redis.rpush('averageList', num);
      const list = await redis.lrange('averageList', 0, -1); // 누적 점수 요소 배열

      const reAvg = list.reduce((acc: any, curr: any) => {
        if (Number.isNaN(Number(curr))) {
          return acc;
        } else {
          return acc + Number(curr);
        }
      }, 0);

      await redis.set('average', reAvg / list.length);
      const rate = list.sort((a, b) => Number(b) - Number(a));

      let myRate = 1;
      for (const i in rate) {
        if (Number(rate[Number(i)]) === Number(num)) {
          myRate = Number(i)+1;
          break;
        }
      }

      return {
        success: true,
        average: Math.floor(reAvg / list.length),
        rate: Math.floor((myRate/list.length)*100)
      }
    }
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: err.message,
    }
  }
}

export async function resOpenAI (list: Array<Prompt>): Promise<any> {
  try {
    const response = await openai.createChatCompletion({
      model : 'gpt-3.5-turbo',
      messages : [
        {
          'role' : 'system',
          'content' : 'mbti전문가의 입장으로 유저의 각 질문 Q에 대한 질문인 대답 A 를 보고 전체 A의 내용이 얼마나 이성적이고 논리적, 분석적이며 객관적으로 사실을 판단하는지를, 혹은 얼마나 차갑고 냉정하게 말하고 못되게 말하는지를 몇 퍼센트인지 분석하고 대답해줘. 예를 들어서 T성향이 100%라고 한다면 각 A의 모든 내용들이 욕설이 포함되고 질문인 Q와는 전혀 관련없는 대답뿐이고 차갑고 냉정하고 냉혈한처럼 대답했다는 뜻이야. 어떠한 설명도 하지말고 \'T: %\'이 정규식에 맞게만 숫자로 대답 해줘. '
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

export async function resOpenAIMessage (percent: string) {
  try {
    const response = await openai.createChatCompletion({
      model : 'gpt-3.5-turbo',
      messages : [
        {
          'role' : 'system',
          'content' : 'MBTI 전문가의 입장에서 T 성향이 몇 퍼센트인지 보고 너의 친구에게 말하는 느낌으로 100자 이내로 재미있고 익살스럽고 재수없게 반말로 한 마디해줘.'
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
      message: data.choices[0].message.content,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: err.message,
    };
  }
}
