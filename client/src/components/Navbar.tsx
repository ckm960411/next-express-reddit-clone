import axios from 'axios';
import Link from 'next/link';
import { useAuthDispatch, useAuthState } from '../context/auth';

const Navbar = () => {
  const { authenticated, loading } = useAuthState();
  const dispatch = useAuthDispatch();

  const logout = async () => {
    axios
      .post('/auth/logout')
      .then(() => {
        dispatch('LOGOUT');
        window.location.reload();
      })
      .catch(console.log);
  };

  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between h-16 px-5 bg-white">
      <span className="text-2xl font-semibold text-gray-400">
        <Link href="/">Community</Link>
      </span>

      <div className="max-w-full px-4">
        <div className="relative flex items-center bg-gray-100 border rounded hover:border-gray-700 hover:bg-white">
          <i className="pl-4 pr-3 text-gray-400 fas fa-search"></i>
          <input
            type="text"
            placeholder="Search"
            className="px-3 py-1 bg-transparent rounded focus:outline-none"
          />
        </div>
      </div>

      <div className="flex">
        {!loading &&
          (authenticated ? (
            <button
              onClick={logout}
              className="w-20 p-2 mr-2 te-xt-center text-white bg-gray-400 rounded"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="w-20 p-2 mr-2 text-center text-blue-500 border border-blue-500 rounded"
              >
                log in
              </Link>
              <Link
                href="/register"
                className="w-20 p-2 mr-2 text-center text-white border bg-gray-400 rounded"
              >
                sign up
              </Link>
            </>
          ))}
      </div>
    </div>
  );
};

export default Navbar;
