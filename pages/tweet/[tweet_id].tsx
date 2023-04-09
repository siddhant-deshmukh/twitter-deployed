import Head from 'next/head'
import { TweetComponent } from '../../components/Tweet/TweetComponent'
import { useRouter } from 'next/router'
import { CommentFeedCommentEditor } from '@/components/Tweet/FeedEditor'
import useTweetsCache from '@/hooks/useTweetsCache'
import { useCallback, useContext } from 'react'
import { AuthContext } from '@/context/authContext'
import useSWR, { useSWRConfig } from 'swr'
import useSWRInfinite from "swr/infinite";
import Tweet from '@/components/Tweet/FeedTweetComponent'
import { ITweet } from '@/models/Tweet'


export default function TweetPage() {
    const router = useRouter()
    const { tweet_id } = router.query
    const { tweet, loading, updateTweet } = useTweetsCache(tweet_id)

    if (tweet && tweet._id && tweet_id && typeof tweet_id === 'string') {
        return (
            <div className='w-full'>
                <div className="">
                    <h1 className='flex w-full space-x-10 p-3 sticky top-0 opacity-90 bg-white'>
                        <button
                            onClick={(event) => { event.preventDefault(); router.back() }}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                            </svg>
                        </button>
                        <span className='text-xl font-semibold'>
                            Tweet
                            {/* {tweet_id} */}
                        </span>
                    </h1>

                    <div>
                        {/* {
                            JSON.stringify(tweet)
                        } */}
                        <TweetComponent tweet_id={tweet_id} tweet={tweet} updateTweet={updateTweet} />
                        <CommentFeedCommentEditor user_id={tweet?.author} parent_tweet_id={tweet_id} />
                        <CommentFeed tweet_id={tweet_id} />
                    </div>


                </div>
                {/* {
            JSON.stringify(TweetFeed)
          } */}
            </div>
        )
    } else {
        return <div> Loading</div>
    }
}

const CommentFeed = ({ tweet_id }: { tweet_id: string }) => {
    const { refreshInterval, cache, mutate } = useSWRConfig()
    const { authState } = useContext(AuthContext)
    const pageLength = 5
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
        // console.log("data", url, tweetIds)
        return tweetIds
    }, [cache])

    // const { data: ownComments } = useSWR(`/own_comment/${tweet_id}`, (str: string) => {


    //     const feed = cache.get(str)
    //     console.log(str, feed)
    //     return feed

    // })
    const { data: ownComments } = useSWR(`/own_comment/${tweet_id}`, (str: string) => {
        const feed = cache.get(`own_comment/${tweet_id}`)
        return feed
    })
    const { data: CommentsFeed, mutate: mutateTweetFeed, size, setSize, isValidating, isLoading } = useSWRInfinite(
        (index) => `/api/tweet/${tweet_id}/comment?skip=${index * pageLength}&limit=${pageLength}`,
        fetchTweetFeed,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )
    return (
        <>
            <div>
                {
                    //@ts-ignore
                    ownComments !== undefined && Array.isArray(ownComments) && <div>
                        {ownComments.map((tweet_id: string, indexNum) => {
                            return <div key={tweet_id}>

                                {tweet_id && <Tweet tweet_id={tweet_id} />}
                            </div>
                        })}
                        {/* {
                JSON.stringify(ownComments)
            } */}
                    </div>
                }
                {
                    CommentsFeed &&
                    CommentsFeed.map((page: string[] | [], pageNum) => {
                        if (!page) return <div></div>
                        return page.map((tweet_id: string, indexNum) => {
                            return <div key={tweet_id}>

                                {tweet_id && <Tweet tweet_id={tweet_id} />}
                            </div>
                        })
                    })
                }
            </div>

        </>
    )
}