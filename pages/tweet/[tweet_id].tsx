import Head from 'next/head'
import  { TweetComponent } from '../../components/Tweet/TweetComponent'
import { useRouter } from 'next/router'


export default function TweetPage() {
    const router = useRouter()
    const { tweet_id } = router.query
    
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
                    </span>
                </h1>
                {
                    tweet_id && typeof tweet_id === 'string' &&
                    <div>
                        <Head>
                            <title>Home</title>
                            <meta name="description" content="Generated by create next app" />
                            <meta name="viewport" content="width=device-width, initial-scale=1" />
                            <link rel="icon" href="/favicon.ico" />
                        </Head>

                        <TweetComponent tweet_id={tweet_id} />
                    </div>
                }
            </div>
            {/* {
        JSON.stringify(TweetFeed)
      } */}
        </div>
    )
}
