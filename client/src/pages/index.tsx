import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import useSWR from 'swr';
import { Sub } from '../types';

const Home: NextPage = () => {
  const fetcher = async (url: string) => {
    return await axios.get(url).then((res) => res.data);
  };
  const address = '/subs/sub/topSubs';
  const { data: topSubs } = useSWR<Sub[]>(address, fetcher);

  return (
    <div>
      <h1 className="flex max-w-5xl px-4 pt-5 mx-auto">
        {/* 포스트 리스트 */}
        <div className="w-full md:mr-3 md:w-8/12"></div>

        {/* 사이드바 */}
        <div className="hidden w-4/12 ml-3 md:block">
          <div className="bg-white border rounded">
            <div className="p-4 border-b">
              <p className="text-lg font-semibold text-center">상위 커뮤니티</p>
            </div>
            {/* 커뮤니티 목록 */}
            <div></div>

            <div className="w-full py-6 text-center">
              <Link
                href="/subs/create"
                className="w-full p-2 text-center text-white bg-gray-400 rounded"
              >
                커뮤니티 만들기
              </Link>
            </div>
          </div>
        </div>
      </h1>
    </div>
  );
};

export default Home;
