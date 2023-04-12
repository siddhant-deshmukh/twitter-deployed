import Head from 'next/head'
import Tweet from '../components/Tweet/FeedTweetComponent'
import { ITweet } from '@/models/Tweet'
import { useCallback, useContext, useEffect, useState } from 'react'
import useSWRInfinite from "swr/infinite";
import { useSWRConfig } from 'swr'
import useSWR from 'swr'
// import useSWRInfinite from "swr/infinite";
import { FeedTweetEditor } from '@/components/Tweet/FeedEditor'
import { AuthContext } from '@/context/authContext';
// import { SWRConfig } from 'swr'

const pageLength = 5
export default function Home() {
  const { refreshInterval, cache, mutate } = useSWRConfig()
  const { setAuthState } = useContext(AuthContext)

  const fetchTweetFeed = useCallback(async (url: string) => {
    const data = await fetch(url, {
      credentials: 'include',
      method: 'GET'
    }).then((res) => {
      if (res.status === 401) {
        setAuthState(null)
        return null;
      }
      return res.json()
    });
    const tweetIds = data.map((tweet: ITweet) => {

      const exist_ = cache
      //@ts-ignore
      if (!exist_ || !exist_._id) {
        //@ts-ignore
        cache.set(`tweet/${tweet._id}`, tweet)
      }
      return tweet._id
    })
    console.log("data", url, tweetIds)
    return tweetIds
  }, [cache])

  const { data: ownTweets, mutate: mutateOwnTweets } = useSWR('/own/tweetfeed', (str: string) => {
    const feed = cache.get('own/tweetfeed')
    return feed
  }, {
    revalidateOnFocus: true,
  })
  const { data: TweetFeed, mutate: mutateTweetFeed, size, setSize, isValidating, isLoading } = useSWRInfinite(
    (index) => `/api/tweet?skip=${index * pageLength}&limit=${pageLength}`,
    fetchTweetFeed,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false
    }
  )
  // const TweetFeed = data ? data.concat(...data) : [];
  const updateTweet = useCallback((tweet_id: string, what: 'liked' | 'retweet') => {
    let prev = cache.get(`tweet/${tweet_id}`) as ITweet
    if (!prev || !prev._id) return;
    let updated_tweet = { ...prev };
    if (what === 'liked') {
      updated_tweet = {
        ...updated_tweet,
        have_liked: (prev.have_liked) ? (false) : true,
        num_likes: (!prev.have_liked) ? (prev.num_likes + 1) : (prev.num_likes - 1)
      }
      console.log('liked')
    }
    if (what === 'retweet') {
      updated_tweet = {
        ...updated_tweet,
        have_retweeted: (prev.have_retweeted) ? (false) : true,
        num_retweet: (!prev.have_retweeted) ? (prev.num_retweet + 1) : (prev.num_retweet - 1)
      }
    }
    //@ts-ignore
    cache.set(`tweet/${tweet_id}`, updated_tweet)

  }, [cache])

  useEffect(() => {
    console.log('Cache', cache)

  }, [cache])
  return (
    <div className='w-full'>
      <Head>
        <title>Twitter</title>
      </Head>
      <h1 className='flex w-full space-x-10 p-3 sticky top-0 z-50 bg-opacity-90 bg-white'>

        <span className='text-xl font-semibold'>
          Home
        </span>
      </h1>
      <div className="w-full">
        < FeedTweetEditor mutateOwnTweets={mutateOwnTweets} />
        {/* {
          JSON.stringify(ownTweets)
        } */}
        {
          ownTweets &&
          //@ts-ignore
          ownTweets.map((tweet_id: string, indexNum) => {
            return <div key={tweet_id}>

              {tweet_id && <Tweet tweet_id={tweet_id} />}
            </div>
          })
        }
        {
          TweetFeed &&
          TweetFeed.map((page: string[] | [], pageNum) => {
            if (!page) return <div></div>
            return page.map((tweet_id: string, indexNum) => {
              return <div key={tweet_id}>

                {tweet_id && <Tweet tweet_id={tweet_id} />}
              </div>
            })
          })
        }
      </div>
      <button onClick={() => setSize(size + 1)}>Load More</button>
      {/* {
        JSON.stringify(TweetFeed)
      } */}
    </div>
  )
}
