import { validate } from 'class-validator';
import { Request, Response, Router } from 'express';
import { User } from '../entities/User';

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

const router = Router();
router.post('/register', register);

export default router;
