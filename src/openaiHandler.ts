import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { chatGPT } from './openaiService';
import { getAverage } from './redisService';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    if (typeof event.body === 'string') {
      const { list } = JSON.parse(event.body);
      const result = await chatGPT(list);
      if (!result) {
        return {
          statusCode : 200,
          body :JSON.stringify( 'openAI server error.'),
        };
      }
      const {average, rate} = await getAverage(result.percent);

      return {
        statusCode : 200,
        body : JSON.stringify(result.success ? {
          percent: result.percent,
          message: result.message,
          average,
          rate
        } : result.message),
      };
    } else {
      const { list } = event.body;
      const result = await chatGPT(list);
      if (!result) {
        return {
          statusCode : 200,
          body :JSON.stringify( 'openAI server error.'),
        };
      }
      const {average, rate} = await getAverage(result.percent);

      return {
        statusCode : 200,
        body : JSON.stringify(result.success ? {
          percent: result.percent,
          message: result.message,
          average,
          rate
        } : result.message),
      };
    }

  } catch (err) {
    console.error(err);
    return {
      statusCode : 400,
      body : JSON.stringify({ message : err instanceof Error ? err.message : err }),
    };
  }
};
