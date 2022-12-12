import { isEmpty, validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { User } from '../entities/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const mapErrors = (errors: Object[]) => {
  return errors.reduce((prev: any, err: any) => {
    prev[err.property] = Object.entries(err.constraints)[0][1];
    return prev;
  }, {});
};

const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body as {
    email: string;
    username: string;
    password: string;
  };

  try {
    let errors: any = {};

    const emailUser = await User.findOne({ where: { email } });
    const usernameUser = await User.findOne({ where: { username } });

    // 이미 있다면 errors 객체에 넣어줌.
    if (emailUser) errors.email = '이미 해당 이메일 주소가 사용되었습니다.';
    if (usernameUser) errors.username = '이미 이 사용자 이름이 사용되었습니다.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // 유저 정보와 함께 user 인스턴스를 생성
    const user = new User();
    user.email = email;
    user.username = username;
    user.password = password;

    // 엔티티에 정해 놓은 조건으로 user 데이터의 유효성 검사를 해줌
    errors = await validate(user);

    if (errors.length > 0) return res.status(400).json(mapErrors(errors));

    // 유저 정보를 user table 에 저장해줌
    await user.save();

    // 저장된 유저 정보를 response 로 보내줌
    return res.json(user);
  } catch (error) {
    console.error(error);
    // 에러를 response 로 보내줌
    return res.status(500).json({ error });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let errors: any = {};
    // 비워져있다면 에러를 프론트엔드로 보내주기
    if (isEmpty(username))
      errors.username = '사용자 이름은 비워둘 수 없습니다.';
    if (isEmpty(password)) errors.password = '비밀번호는 비워둘 수 없습니다.';

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // DB에서 유저 찾기
    const user = await User.findOneBy({ username });

    if (!user) {
      return res
        .status(404)
        .json({ username: '사용자 이름이 등록되지 않았습니다.' });
    }

    // 유저가 있다면 비밀번호 비교하기
    const passwordMatches = await bcrypt.compare(password, user.password);

    // 비밀번호가 다르다면 에러 내보내기
    if (!passwordMatches) {
      return res.status(401).json({ password: '비밀번호가 잘못되었습니다.' });
    }

    // 비밀번호가 맞다면 토큰 생성
    const token = jwt.sign({ username }, process.env.JWT_SECRET);

    // 쿠키 저장
    res.set(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: (60 * 60) ^ (24 * 7), // 1 week
        path: '/',
      })
    );

    return res.json({ user, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

const router = Router();
router.post('/register', register);
router.post('/login', login);

export default router;
