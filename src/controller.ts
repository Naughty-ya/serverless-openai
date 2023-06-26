import { Request, Response } from 'express';
import { getAverage, resOpenAI, resOpenAIMessage } from './module';

export async function openAICtr (req: Request, res: Response) {
  const { list } = req.body;
  try {
    const percent = await resOpenAI(list);
    const message = await resOpenAIMessage(percent);
    const rate = await getAverage(percent);

    if (!percent || !message.success || !rate.success) {
      return res.status(200).json({
        success : false,
        message : !percent && 'Failed to open AI' ||
          !message.success && message.message ||
          !rate.success && rate.message || 'Server error.'
      });
    }
    res.status(200).json({
      success : true,
      percent,
      message : message.message,
      average : rate.average,
      rate : rate.rate
    });
  } catch (err) {
    console.error(err);
    res.status(200).json({
      success : false,
      message : err.message,
    });
  }
}
