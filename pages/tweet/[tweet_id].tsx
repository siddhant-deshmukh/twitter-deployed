import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Tweet from '../../components/Tweet'
import { ITweet } from '@/models/Tweet'
import { useCallback, useEffect, useState } from 'react'
import useSWRInfinite from "swr/infinite";
import { useSWRConfig } from 'swr'
import { useRouter } from 'next/router'
// import { SWRConfig } from 'swr'

const inter = Inter({ subsets: ['latin'] })

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const pageLength = 5
export default function TweetPage() {
    const router = useRouter()
    const { refreshInterval, cache, ...restConfig } = useSWRConfig()
    const { data: TweetFeed, mutate, size, setSize, isValidating, isLoading } = useSWRInfinite(
        (index) => `/api/tweet?skip=${index * pageLength}&limit=${pageLength}`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        }
    )
    // const TweetFeed = data ? data.concat(...data) : [];
    const updateTweet = useCallback((pageNum: number, indexNum: number, what: 'liked' | 'retweet') => {
        //@ts-ignore
        mutate((data) => {
            let new_ = data?.slice()
            // console.log("data in mutate",pageNum , indexNum,pageNum >= 0, indexNum >= 0 , new_, new_[pageNum], new_[pageNum][indexNum])

            if (pageNum >= 0 && indexNum >= 0 && new_ && new_[pageNum] && new_[pageNum][indexNum]) {
                let prev = { ...new_[pageNum][indexNum] }
                if (what === 'liked') {
                    new_[pageNum][indexNum] = {
                        ...new_[pageNum][indexNum],
                        have_liked: (prev.have_liked) ? (false) : true,
                        num_likes: (!prev.have_liked) ? (prev.num_likes + 1) : (prev.num_likes - 1)
                    }
                    console.log('liked')
                }
                if (what === 'retweet') {
                    new_[pageNum][indexNum] = {
                        ...new_[pageNum][indexNum],
                        have_retweeted: (prev.have_retweeted) ? (false) : true,
                        num_retweet: (!prev.have_retweeted) ? (prev.num_retweet + 1) : (prev.num_retweet - 1)
                    }
                }
                console.log("data in mutate", new_)
            }
            return new_
        })
    }, [mutate])
    useEffect(() => {
        console.log('Cache', cache)

    }, [cache])
    return (
        <div>
            <Head>
                <title>Home</title>
                <meta name="description" content="Generated by create next app" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="">
                <h1 className='flex w-full space-x-10 p-3 sticky top-0 opacity-90 bg-white'>
                    <button
                        onClick={(event)=>{event.preventDefault(); router.back()}}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                    </button>
                    <span className='text-xl font-semibold'>
                        Tweet
                    </span>
                </h1>
                {
                    TweetFeed &&
                    TweetFeed.map((page: ITweet[] | [], pageNum) => {
                        if (!page) return <div></div>

                        return page.map((tweet: ITweet, indexNum) => {
                            return <div key={tweet._id}>

                                {tweet._id && <Tweet tweet={tweet} updateTweet={updateTweet} pageNum={pageNum} indexNum={indexNum} />}
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
