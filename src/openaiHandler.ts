import { Context, APIGatewayProxyResult, APIGatewayEvent } from 'aws-lambda';
import { chatGPT } from './openaiService';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  try {
    if (typeof event.body === 'string') {
      const { list } = JSON.parse(event.body);
      const result = await chatGPT(list);

      return {
        statusCode : 200,
        body :JSON.stringify( result ? result.data.choices[0].message.content : result.message),
      };
    } else {
      const { list } = event.body;
      const result = await chatGPT(list);

      return {
        statusCode : 200,
        body : JSON.stringify(result ? result.data.choices[0].message.content : result.message),
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
