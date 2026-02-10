import emlIcon from '/public/eml-icon.svg';
import oauthIcon from '/public/oauth-icon.svg';
import smsIcon from '/public/sms-icon.svg';
import webauthnIcon from '/public/webauthn-icon.svg';
import web3Icon from '/public/web3-icon.svg';
import passwordsIcon from '/public/passwords-icon.svg';
import { LoginProduct } from './types';

const LoginProducts: Record<string, LoginProduct> = {
  EML: {
    icon: emlIcon,
    name: 'Email magic links',
  },
  SMS: {
    icon: smsIcon,
    name: 'SMS passcodes',
  },
  OAUTH: {
    icon: oauthIcon,
    name: 'OAuth logins',
  },
  WEBAUTHN: {
    icon: webauthnIcon,
    name: 'WebAuthn',
  },
  WEB3: {
    icon: web3Icon,
    name: 'Web3 login',
  },
  PASSWORDS: {
    icon: passwordsIcon,
    name: 'Passwords',
  },
};

export default LoginProducts;
