import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState } from "react"
import { HomeSVG, ExploreSVG, NotificationSVG, MsgsSVG, BookmarksSVG, ProfileSVG, MoreSVG, DangerSVG, TweetIcon } from "./svgElemets"


export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" fixed  top-0 left-0 h-screen w-screen overflow-y-auto">
      <main className="w-fit mx-auto flex h-full ">
        <TopNavBar />
        <SideNavbar />
        <main className="pt-8 sm:pt-0">{children}</main>
        <BottomNavBar />
      </main>
    </div>
  )
}
function SideNavbar() {
  const NavBarElements: {
    href?: string,
    text: string,
    svg_path: ({ strokeWidth, fill }: { strokeWidth: string; fill: "none" | "white"; }) => JSX.Element
  }[] = [
      { href: "/home", text: "Home", svg_path: HomeSVG },
      { href: "/#", text: "Explore", svg_path: ExploreSVG },
      { href: "/#", text: "Notifications", svg_path: NotificationSVG },
      { href: "/#", text: "Messages", svg_path: MsgsSVG },
      { href: "/#", text: "Bookmarks", svg_path: BookmarksSVG },
      { href: "/profile", text: "Profile", svg_path: ProfileSVG },
      { href: "/#", text: "More", svg_path: MoreSVG },
    ]
  const router = useRouter();

  return (
    <div className="hidden sm:flex flex-col px-2 md:px-4 py-2  sticky top-0 h-full justify-between  sm:w-[68px] md:w-60 ">
      <div className="flex flex-col">
        <Link href={'/home'} className="p-2 mx-1 hover:bg-blue-50 w-fit rounded-full">
          <TweetIcon fill={'#1D9BF0'} />
        </Link>
        <ul className="my-3 px-1 flex flex-col space-y-2">
          <Link href='/home' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <HomeSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >Home</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <ExploreSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >Explore</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <NotificationSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >Notifications</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <MsgsSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >Messages</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <BookmarksSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >Bookmarks</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <ProfileSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block">Profile</span>
          </Link>
          <Link href='/#' className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
            <MoreSVG fill='none' strokeWidth="1.75" />
            <span className="px-3 hidden lg:block" >More</span>
          </Link>
        </ul>
        <Link className="lg:flex  items-center py-2.5 px-3 w-fit rounded-full font-medium  text-white   bg-[#1D9BF0] lg:w-full" href="?compose=tweet" as="/compose/tweet">
          <span className="hidden w-full lg:block lg:px-6 text-center">Tweet</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="white" className="block lg:hidden w-6 h-6  mx-auto">
            <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z">
            </path>
          </svg>
        </Link>
      </div>

      <div className="flex flex-col px-1 space-y-2">
        <button className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>

          <span className="px-3 hidden lg:block" >Dark Mode</span>
        </button>
        <button className="flex group text-base items-center hover:bg-gray-200 w-fit p-2 rounded-full text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          <span className="px-3 hidden lg:block" >Logout</span>
        </button>
      </div>
    </div>
  )
}
function BottomNavBar() {
  return (
    <>
      <ul className="absolute flex border-t shadow justify-between  w-full sm:hidden bottom-0 left-0  h-12 ">
        <Link href='/home' className="flex place-content-center  group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <HomeSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <ExploreSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <NotificationSVG fill='none' strokeWidth="1.75" />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center hover:bg-gray-200 w-full  text-gray-900">
          <MsgsSVG fill='none' strokeWidth="1.75" />
        </Link>
      </ul>
      <Link className="absolute right-2 bottom-16 block sm:hidden   py-3 px-3 w-fit rounded-full font-medium  text-white   bg-[#1D9BF0] md:w-full" href="?compose=tweet" as="/compose/tweet">
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="white" className="block md:hidden w-7 h-7  mx-auto">
          <path d="M23 3c-6.62-.1-10.38 2.421-13.05 6.03C7.29 12.61 6 17.331 6 22h2c0-1.007.07-2.012.19-3H12c4.1 0 7.48-3.082 7.94-7.054C22.79 10.147 23.17 6.359 23 3zm-7 8h-1.5v2H16c.63-.016 1.2-.08 1.72-.188C16.95 15.24 14.68 17 12 17H8.55c.57-2.512 1.57-4.851 3-6.78 2.16-2.912 5.29-4.911 9.45-5.187C20.95 8.079 19.9 11 16 11zM4 9V6H1V4h3V1h2v3h3v2H6v3H4z">
          </path>
        </svg>
      </Link>
    </>
  )
}
export function TopNavBar() {
  const [drawerToggle, setDrawerToggle] = useState(false)
  return (
    <>
      <ul className="absolute flex border-t shadow justify-between  w-full sm:hidden top-0 left-0  h-8 ">
        <button
          onClick={(event) => {
            event.preventDefault();
            setDrawerToggle(true)
          }}
          className="flex place-content-center  group text-base items-center  w-fit  text-gray-900 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
        <Link href='/#' className="flex place-`${}``${}`nt-center group text-base items-centerw-fit  text-gray-900 px-2">
          <TweetIcon fill={'#1D9BF0'} />
        </Link>
        <Link href='/#' className="flex place-content-center group text-base items-center  w-fit  text-gray-900 px-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </Link>
      </ul>
      {/* Drawer */}
      {
        drawerToggle &&
        <div className="fixed w-screen h-screen left-0 top-0 bg-opacity-20 bg-black">
          <div className={`${drawerToggle ? 'block sm:hidden' : 'hidden'} py-4 px-2 absolute  left-0 top-0 z-20 bg-white border h-full w-56`}>
            <div className="flex w-full items-center">
              <div className="w-full font-medium">
                Account Info
              </div>
              <button
                onClick={(event => { event.preventDefault(); setDrawerToggle(false) })}
                className=" hover:bg-gray-200 rounded-full px-2 py-1">
                X
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}