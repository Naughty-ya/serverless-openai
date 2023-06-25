import redis from '../config/redis';

export async function getAverage (data: string) {
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
    const rate = list.sort((a, b) => Number(a) - Number(b));

    let myRate = 1;
    for (const i in rate) {
      if (Number(rate[Number(i)]) === Number(num)) {
        myRate = Number(i)+1;
        break;
      }
    }

    return {
      average: `${Math.floor(reAvg / list.length)}%`,
      rate: `${Math.floor((myRate/list.length)*100)}%`
    }

  }
}
