import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useAuthDispatch, useAuthState } from '../context/auth';

const Login = () => {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<any>({});

  const dispatch = useAuthDispatch();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        '/auth/login',
        { username, password },
        { withCredentials: true }
      );
      dispatch('LOGIN', response.data?.user);
      router.push('/');
    } catch (error: any) {
      console.error(error);
      setErrors(error?.response?.data || {});
    }
  };

  return (
    <div className="bg-white">
      <div className="flex flex-col items-center justify-center h-screen p-6">
        <h1 className="mb-2 text-lg font-medium">로그인</h1>
        <form onSubmit={handleSubmit}>
          <InputGroup
            placeholder="Username"
            value={username}
            setValue={setUsername}
            error={errors.username}
          />
          <InputGroup
            placeholder="Password"
            value={password}
            type="password"
            setValue={setPassword}
            error={errors.password}
          />
          <button className="w-full py-2 mb-1 text-xs font-bold text-white uppercase bg-gray-400 border border-gray-400 rounded">
            로그인
          </button>
        </form>
        <small>
          아직 아이디가 없나요?
          <Link href="/register" className="ml-1 text-blue-500 uppeacase">
            회원가입
          </Link>
        </small>
      </div>
    </div>
  );
};

export default Login;
