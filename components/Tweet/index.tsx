import React, { useCallback, useState } from "react";
import { ITweet } from "../../models/Tweet";
import Link from "next/link";
import { useRouter } from "next/router";

//@ts-ignore
const Tweet = ({ TweetData, tweetIndex, queryClient, tweetPageNum }: { TweetData: ITweet | null, tweetIndex: number, tweetPageNum: number }) => {
  const router = useRouter()
  const btnTypes = ["view", "comment", "retweet", "like"]
  const updateTweet = useCallback((type: "liked" | "retweet" | "") => {
    if (type !== "liked" && type !== "retweet") return
    console.log("Meow \n/n\n/n", type, TweetData, tweetIndex, tweetPageNum);
    console.log(TweetData && tweetIndex && tweetPageNum, typeof tweetIndex, typeof tweetPageNum)
    if (TweetData && queryClient) {
      // UpdateTweet(TweetData._id as string, type, queryClient, tweetIndex, tweetPageNum)
    }
  }, [TweetData, status, tweetIndex, tweetPageNum, queryClient])

  const changePath = useCallback((url: string) => {
    router.push(url)
  }, [router])
  //console.log(TweetData)
  //onClick={(e)=>{e.preventDefault(); router.push(`/tweet/${TweetData._id}?tweetIndex=${tweetIndex}&tweetPageNum=${tweetPageNum}`)}}
  return (
    <>
      {TweetData &&
        <div onClick={(e) => { e.preventDefault(); changePath(`/tweet/${TweetData._id}?tweetIndex=${tweetIndex}&tweetPageNum=${tweetPageNum}`) }} className="hover:cursor-pointer" >
          <div className="py-2 px-1 flex border border-gray-200 text-left" style={{ width: 500 }}>

            <div className="w-fit shrink-0 px-2 py-2">
              <Link onClick={(event) => { event.stopPropagation(); changePath(`/user/${TweetData.author}`) }} href={`/user/${TweetData.author}`} >
                <img className="w-8 h-8 rounded-full bg-black hover:opacity-20" src={TweetData.authorDetails?.avatar} alt={TweetData.authorDetails?.name} />
              </Link>
            </div>
            <div className="w-full">
              <div className="h-fit  w-fit m-0 ">
                <Link onClick={(event) => { event.stopPropagation(); changePath(`/user/${TweetData.author}`) }} href={`/user/${TweetData.author}`} className="">
                  <div className="flex space-x-1 min-w-0 items-center">
                    <p className="text-base font-medium hover:underline text-gray-900 truncate dark:text-white">
                      {TweetData.authorDetails?.name}
                    </p>
                    <p className="text-sm text-gray-500  hover:underline truncate dark:text-gray-400">
                      @{TweetData.authorDetails?.user_name}
                    </p>
                  </div>
                </Link>
              </div>
              <p className="text-sm" >
                {TweetData?.text}
              </p>
              <div className="flex space-x-16 py-1 text-sm w-full">
                {/* {
                            btnTypes.map((btn_type : string )=><div key={`${btn_type}`}>
                                <TweetButtons TweetData={TweetData} updateTweet={updateTweet} btnType={btn_type} />
                                </div>)
                        } */}
                <div className="flex items-center space-x-16 text-sm">
                  <button className={`group flex p-2 space-x-0.5 text-gray-500 hover:text-blue-400 items-center`}
                    onClick={(event) => { event.preventDefault(); event.stopPropagation() }}
                  >
                    <div className="group-hover:bg-blue-100 p-1.5 w-fit h-fit rounded-full">
                      {/* <ChartBarSvg hoverColor="" fillColor="none" /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                      </svg>
                    </div>
                    <div>
                      {TweetData.num_views}
                    </div>
                  </button>
                  <button className="group flex p-2 space-x-0.5 text-gray-500 hover:text-blue-400 items-center"
                    onClick={(event) => { event.preventDefault(); event.stopPropagation() }}
                  >
                    <div className="group-hover:bg-blue-100 p-1.5 w-fit h-fit rounded-full">
                      {/* <ChatBubbleSvg hoverColor="text-blue-400" fillColor="white" /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                      </svg>
                    </div>
                    <div>
                      {TweetData.num_comments}
                    </div>
                  </button>
                  <button
                    onClick={(event) => { event.preventDefault(); updateTweet("retweet"); event.stopPropagation() }}
                    className={`group flex p-2 space-x-0.5 ${(TweetData.has_retweet) ? "text-green-500" : "text-gray-500"} hover:text-green-500 items-center`}>
                    <div className="group-hover:bg-green-50 p-1.5 w-fit h-fit rounded-full">
                      {/* <DoubeArrowSvg hoverColor="" fillColor="none" /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
                      </svg>
                    </div>
                    <div>
                      {TweetData.num_retweet}
                    </div>
                  </button>
                  <button
                    onClick={(event) => { event.preventDefault(); updateTweet("liked"); event.stopPropagation() }}
                    className={`group flex p-2 space-x-0.5 ${(TweetData.has_liked) ? "text-red-500" : "text-gray-500"} hover:text-red-500 items-center`}>
                    <div className="group-hover:bg-red-100 p-1.5 w-fit h-fit rounded-full">
                      {/* <HeartSvg hoverColor="" fillColor={(TweetData.has_liked) ? "red" : "none"} /> */}
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    </div>
                    <div>
                      {TweetData.num_likes}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </>
  );
}

interface IBtnFeature {
  num_count_var: "num_retweet" | "num_likes" | "num_comments" | "num_views",
  hover_color: string,
  fill_color: string,
  update_tweet_param: "retweet" | "" | "liked"
  svg_path: string,
}
type IBtnTypes = "view" | "comment" | "retweet" | "like"
type IUpdateTweet = (type: "liked" | "retweet" | "") => void


export function TweetButtons({ TweetData, btnType, updateTweet }: { TweetData: ITweet, btnType: string, updateTweet: IUpdateTweet }) {
  var BtnTypesAndFeatures: { [key: string]: IBtnFeature } = {
    "retweet": {
      num_count_var: "num_retweet",
      hover_color: "text-red-500",
      fill_color: "text-red-500",
      update_tweet_param: "retweet",
      svg_path: "/tweet_icons/retweeted.svg"
    }, "comment": {
      num_count_var: "num_comments",
      hover_color: "text-red-500",
      fill_color: "none",
      update_tweet_param: "",
      svg_path: "/tweet_icons/comment.svg"
    }, "like": {
      num_count_var: "num_likes",
      hover_color: "text-red-500",
      fill_color: "text-red-500",
      update_tweet_param: "liked",
      svg_path: "/tweet_icons/liked.svg"
    }, "view": {
      num_count_var: "num_views",
      hover_color: "text-red-500",
      fill_color: "none",
      update_tweet_param: "",
      svg_path: "/tweet_icons/view.svg"
    },
  }

  const btnFea: IBtnFeature = BtnTypesAndFeatures[btnType]
  return (
    <button className={`flex group space-x-1  hover:${btnFea.hover_color}  items-center`}
      onClick={(event) => { event.preventDefault(); updateTweet(btnFea.update_tweet_param) }}
    >
      <div className="p-1 w-fit h-fit group-hover:bg-red-300 rounded-full ">
        <img src={btnFea.svg_path} className="w-4 h-4 fill-red-900 " />
      </div>
      <div>
        {TweetData[btnFea.num_count_var]}
      </div>
    </button>
  )
}
export default Tweet