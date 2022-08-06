import React from 'react';
import { useStytch } from '@stytch/nextjs';
import styles from '../../styles/Home.module.css';

type Props = {
  phoneNumber: string;
  setMethodId: (methodId: string) => void;
  setOTPSent: (submitted: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
};

const SendOTPForm = (props: Props): JSX.Element => {
  const stytchClient = useStytch();
  const { phoneNumber, setMethodId, setOTPSent, setPhoneNumber } = props;
  const [isDisabled, setIsDisabled] = React.useState(true);

  const isValidNumber = (phoneNumberValue: string) => {
    // Regex validates phone numbers in (xxx)xxx-xxxx, xxx-xxx-xxxx, xxxxxxxxxx, and xxx.xxx.xxxx format
    const regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/g;
    if (phoneNumberValue.match(regex)) {
      return true;
    }
    return false;
  };

  const onPhoneNumberChange = (e: React.ChangeEvent<{ value: string }>) => {
    setPhoneNumber(e.target.value);
    if (isValidNumber(e.target.value)) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidNumber(phoneNumber)) {
      const { method_id } = await stytchClient.otps.sms.loginOrCreate('+1' + phoneNumber);
      setMethodId(method_id);
      setOTPSent(true);
    }
  };

  return (
    <div>
      <h2>Enter phone number</h2>
      <p>Enter your phone number to receive a passcode for authentication.</p>
      <form onSubmit={onSubmit}>
        <div className={styles.telInput}>
          <input className={styles.flag} name="intlCode" type="text" value="+1" readOnly />
          <input
            id={styles.phoneNumber}
            className={styles.phoneNumber}
            placeholder="(123) 456-7890"
            value={phoneNumber}
            onChange={onPhoneNumberChange}
            type="tel"
          />
        </div>
        <p className={styles.smsDisclaimer}>
          By continuing, you consent to receive an SMS for verification. Message and data rates may apply.
        </p>
        <input className={styles.primaryButton} disabled={isDisabled} id="button" type="submit" value="Continue" />
      </form>
    </div>
  );
};

export default SendOTPForm;
