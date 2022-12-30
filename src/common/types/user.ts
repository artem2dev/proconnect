enum SupportedUserLanguages {
  en = 'en',
}

export interface IGetUserInfoRequest extends Request {
  user: IGetUserInfo;
}

export interface IGetUserInfo extends Request {
  id: string;
  email: string;
}

export interface IGetUser {
  id: string;
}

export interface IUpdateUserInfo extends Body {
  id: string;
  email?: string;
  userName?: string;
  firstName?: string;
  lastName?: string;
}
