type FeaturedTalk = {
  title: string
  date: string
  type: 'talk' | 'community'
  link: string
  body: string
  imageUrl: string
}

type Talk = {
  title: string
  date: string
  type: 'talk' | 'community'
  link: string
}

export const getFeaturedTalk = async (): Promise<FeaturedTalk | undefined> => {
  const talk: FeaturedTalk = {
    title: 'FlutterKaigi 2023 登壇',
    date: '2023/11/10',
    type: 'talk',
    link: 'https://youtu.be/EKoI-p1UnNk?si=SPUr5TES8OGbworj',
    body: '国内で最も大きな Flutter のカンファレンスであるFlutterKaigi では、多くのプロポーザルの中から採択され、Dartのコード生成の仕組みとコード生成パッケージを開発する方法について発表しました。',
    imageUrl:
      'https://r2-image-worker.saigusa758cloudy.workers.dev/talks/9e81d7d98aaa44a3894572f494a30563/youtube.jpg',
  }
  return talk
}

export const getTalks = async () => {
  const talks: Talk[] = [
    {
      title: '第 5 回 FlutterGakkai 開催',
      date: '2024/01/26',
      type: 'community',
      link: 'https://fluttergakkai.connpass.com/event/304163/',
    },
    {
      title: 'GDG DevFest Tokyo 2023 LT 登壇',
      date: '2023/11/10',
      type: 'talk',
      link: 'https://gdg-tokyo.connpass.com/event/301690/',
    },
    {
      title: '東京 Flutter ハッカソン優勝',
      date: '2023/10/01',
      type: 'talk',
      link: 'https://hackathon.flutteruniv.com/',
    },
    {
      title: 'LINE DC 勉強会登壇',
      date: '2023/07/28',
      type: 'talk',
      link: 'https://linedevelopercommunity.connpass.com/event/283738/',
    },
    {
      title: 'YOURTRUST x ゆめみ勉強会登壇',
      date: '2023/07/24',
      type: 'talk',
      link: 'https://yumemi.connpass.com/event/287984/',
    },
    {
      title: '第 4 回 FlutterGakkai 開催',
      date: '2023/07/14',
      type: 'community',
      link: 'https://fluttergakkai.connpass.com/event/284732/',
    },
    {
      title: 'Firebase meetup 登壇',
      date: '2023/07/07',
      type: 'talk',
      link: 'https://connpass.com/event/285741/',
    },
    {
      title: '東京.dart 登壇',
      date: '2023/06/09',
      type: 'talk',
      link: 'https://flutteruniv.connpass.com/event/282109/',
    },
    {
      title: '福岡.dart 登壇',
      date: '2023/03/21',
      type: 'talk',
      link: 'https://flutteruniv.connpass.com/event/275584/',
    },
    {
      title: '第 3 回 FlutterGakkai 開催',
      date: '2023/01/28',
      type: 'community',
      link: 'https://fluttergakkai.connpass.com/event/266368/',
    },
  ]

  talks.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return talks
}
