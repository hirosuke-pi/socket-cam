import React from 'react'
import { useNavigate, NavigateFunction } from "react-router-dom";

import Header from '../components/Layouts/Header'
import Footer from '../components/Layouts/Footer'
import Logo from '../assets/images/logo.svg'

const createDashboard = (navigate: NavigateFunction) => {
  const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const N = 32
  const dashboardId = Array.from(crypto.getRandomValues(new Uint8Array(N))).map((n:number)=>S[n%S.length]).join('')
  console.log(dashboardId)

  navigate(`/dashboard/${dashboardId}`)
}

const backDashboard = () => {

}

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header/>
      <main className='flex flex-row flex-wrap-reverse justify-center text-zinc-800'>
        <article className='p-2 m-2 w-full md:w-2/5 flex justify-center items-center'>
          <section>
            <span className='text-3xl font-bold md:text-4xl lg:md:text-5xl xl:md:text-6xl'>
              あなたのスマホを、
            </span><br/>
            <span className='text-4xl font-bold text-sky-400 md:text-5xl lg:md:text-6xl xl:text-7xl'>
              監視カメラ代わりに。
            </span><br/><br/><br/>
            <span className='text-2xl flex flex-wrap justify-center items-center'>
              <button onClick={() => createDashboard(navigate)} className="m-2 w-full lg:w-fit bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded">
                <svg className="h-8 w-8 text-white inline-block" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <circle cx="12" cy="13" r="3" />  <path d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h2m9 7v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />  <line x1="15" y1="6" x2="21" y2="6" />  <line x1="18" y1="3" x2="18" y2="9" /></svg> 今すぐカメラを追加
              </button>
              <button onClick={backDashboard} className="m-2 w-full lg:w-fit bg-sky-400 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded">
              <svg className="h-8 w-8 text-white inline-block"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M9 13l-4 -4l4 -4m-4 4h11a4 4 0 0 1 0 8h-1" /></svg> 以前のカメラ
              </button>
            </span>
          </section>
        </article>
        <article className='p-2 m-2 w-full md:w-2/5'>
          <img src={Logo} alt='アイコン'></img>
        </article>
      </main>
      <Footer/>
    </>
  );
}

export default Home;
