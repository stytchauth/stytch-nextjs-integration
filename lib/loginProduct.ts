import emlIcon from '/public/eml-icon.svg';
import oauthIcon from '/public/oauth-icon.svg';
import smsIcon from '/public/sms-icon.svg';
import webauthnIcon from '/public/webauthn-icon.svg';
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
};

export default LoginProducts;
