import React from "react";
import { sendOTP } from "../lib/otpUtils";
import styles from "../styles/Home.module.css";

type Props = {
  phoneNumber: string;
  setMethodId: (methodId: string) => void;
  setOTPSubmitted: (submitted: boolean) => void;
  setPhoneNumber: (phoneNumber: string) => void;
}

const SendOTPForm = (props: Props): JSX.Element => {
  const { phoneNumber, setMethodId, setOTPSubmitted, setPhoneNumber } = props;

  const isValidNumber = () => {
    // Regex validates phone numbers in (xxx)xxx-xxxx, xxx-xxx-xxxx, xxxxxxxxxx, and xxx.xxx.xxxx format
    const regex = /^[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/g;
    if (phoneNumber.match(regex)) {
      return true;
    }
    return false;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidNumber()) {
      const methodId = await sendOTP(phoneNumber);
      setMethodId(methodId);
      setOTPSubmitted(true);
    }
  };

  return (
    <div>
      <h2>Enter phone number</h2>
      <p className={styles.smsInstructions}>Enter your phone number to receive a passcode for authentication.</p>
      <form onSubmit={onSubmit}>
        <div className={styles.telInput}>
          <input
            className={styles.flag}
            name="intlCode"
            type="text"
            value="+1"
            readOnly
          />
          <input
            id={styles.phoneNumber}
            className={styles.phoneNumber}
            placeholder="(123) 456-7890"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            type="tel"
          />
        </div>
        <p className={styles.smsDisclaimer}>By continuing, you consent to receive an SMS for verification. Message and data rates may apply.</p>
        <input
          className={styles.primaryButton}
          disabled={!isValidNumber()}
          id="button"
          type="submit"
          value="Send OTP Code"
        />
      </form>
    </div>
  );
};

export default SendOTPForm;
