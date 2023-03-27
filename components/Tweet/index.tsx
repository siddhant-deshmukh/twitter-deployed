import React, { memo, SyntheticEvent, useCallback, useState } from "react";
import { ITweet } from "../../models/Tweet";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSWRConfig } from "swr";

const FeedTweetComponent = ({ tweet , updateTweet, pageNum, indexNum}: { 
  tweet: ITweet,  
  updateTweet: (pageNum: number, indexNum: number, what: 'liked' | 'retweet') => void
  pageNum: number, 
  indexNum: number
}) => {
  const router = useRouter()

  // console.log("Here!!!!!!!")
  
  return (
    <div 
      id={`${tweet._id}`}
      className="flex w-full px-2 py-1 border-b border-b-gray-200 border-r hover:cursor-pointer border-r-gray-200  hover:bg-gray-100"
      onClick={(event : SyntheticEvent)=>{
        //@ts-ignore
        if(event.target && typeof event.target.className === 'string' && !event.target.className.includes('tweet-btn') && !event.target.className.includes('user-link')){
          // console.log("Clicked here!! Liked this!!!",event)
          router.push(`/tweet/${tweet._id}`)
        }
        // else{
        //   console.log("Clicked here!!",event)
        // }

      }}>
      <Link href={`#`} className="w-[72px] z-20 h-fit px-3 user-link">
        {
          tweet.authorDetails.avatar
          && <img className="rounded-full w-12 h-12 user-link" src={tweet.authorDetails.avatar} />
        }
        {
          !tweet.authorDetails.avatar && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 user-link">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        }

      </Link>
      <div className="w-full flex flex-col ">
        <div className="flex items-center space-x-1">
          <Link href={`/uesr/${tweet.author}`} className="user-link w-fit text-base font-bold hover:underline">{tweet.authorDetails.name}</Link>
          <Link href={`/uesr/${tweet.author}`} className="user-link w-fit text-sm  text-gray-500">@{tweet.authorDetails.user_name}</Link>
        </div>
        <div className="text-base font-normal text-left">
          {tweet.text}
        </div>
        <ul className="flex justify-between ">
          <li className="w-full">
            <button className="w-fit items-center flex justify-start space-x-1 pr-4  group hover:text-blue-700 tweet-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-500 rounded-full group-hover:text-blue-700 group-hover:bg-blue-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
              <span className="text-blue">{tweet.num_comments}</span>
            </button>
          </li>
          <li className="w-full">
            <button 
              className="w-fit items-center flex justify-start space-x-1 pr-4  group hover:text-green-700 tweet-btn"
              onClick={(event :  React.MouseEvent<HTMLButtonElement> )=>{
                event.preventDefault();
                updateTweet(pageNum, indexNum, 'retweet')
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-500 rounded-full group-hover:text-green-700 group-hover:bg-green-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              <span className="text-blue">{tweet.num_retweet}</span>
            </button>
          </li>
          <li className="w-full">
            <button 
              className="w-fit items-center flex justify-start space-x-1 pr-4  group hover:text-red-700 tweet-btn"
              onClick={(event :  React.MouseEvent<HTMLButtonElement> )=>{
                event.preventDefault();
                updateTweet(pageNum, indexNum, 'liked')
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-500 rounded-full group-hover:text-red-700 group-hover:bg-red-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="text-blue">{tweet.num_likes}</span>
            </button>
          </li>
          <li className="w-full">
            <button className="w-fit items-center flex justify-start space-x-1 pr-4  group hover:text-blue-700 tweet-btn">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-500 rounded-full group-hover:text-blue-700 group-hover:bg-blue-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              <span className="text-blue">{tweet.num_views}</span>
            </button>
          </li>
          <li className="w-full">
            <button 
              className="w-fit items-center flex justify-start space-x-1 pr-4  group hover:text-blue-700 tweet-btn"
              onClick={(event)=>{
                console.log("Here")
                
                event.preventDefault();
              }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="p-1.5 w-8 h-8 text-gray-500 rounded-full group-hover:text-blue-700 group-hover:bg-blue-100">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15" />
              </svg>
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default FeedTweetComponent