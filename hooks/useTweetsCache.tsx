import { ITweet } from '@/models/Tweet'
import React, { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

const useTweetsCache = (
    tweet_id: string
) => {
    const [tweet, setTweet] = useState<ITweet | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const { cache } = useSWRConfig()
    const updateTweet = (what: 'liked' | 'retweeted' | 'add-comment') => {
        setTweet((prev_tweet) => {
            let new_ = { ...prev_tweet } as ITweet | undefined
            if (!new_) return
            if (what === 'liked') {
                new_ = {
                    ...new_,
                    have_liked: (new_.have_liked) ? (false) : true,
                    num_likes: (!new_.have_liked) ? (new_.num_likes  + 1) : (new_.num_likes - 1)
                }
                console.log('liked')
            }
            if (what === 'retweeted') {
                new_ = {
                    ...new_,
                    have_retweeted: (new_.have_retweeted) ? (false) : true,
                    num_retweet: (!new_.have_retweeted) ? (new_.num_retweet  + 1) : (new_.num_retweet - 1)
                }
            }
            //@ts-ignore
            cache.set(`tweet/${new_._id}`, new_)
            return new_
        })
    }
    useEffect(() => {
        setLoading(true)
        //@ts-ignore
        let check: ITweet | undefined = cache.get(`tweet/${tweet_id}`)
        if (check && check._id) {
            setTweet(check)
            setLoading(false)
        } else {
            fetch(`/api/tweet/${tweet_id}`)
                .then((res) => res.json())
                .then(data => {
                    if (data && data._id) {
                        setTweet(data)
                        //@ts-ignore
                        cache.set(`tweet/${data._id}`, data)
                    }else{
                        setError('Some error occured')
                    }
                })
                .catch((err)=>{
                    setError(err.msg || 'Some error occured')
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [])
    return {
        tweet,
        updateTweet,
        loading,
        error
    }
}

export default useTweetsCache