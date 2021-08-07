import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import Image from 'next/image';
import lockup from '/public/powered-by-stytch.svg';
import SendOTPForm from './SendOTPForm';
import VerifyOTPForm from './VerifyOTPForm';

const LoginWithSMS = () => {
  const [otpSubmitted, setOTPSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [methodId, setMethodId] = useState("");

  return (
    <div className={styles.container}>
      {!otpSubmitted
        ? (
          <SendOTPForm
            phoneNumber={phoneNumber}
            setMethodId={setMethodId}
            setOTPSubmitted={setOTPSubmitted}
            setPhoneNumber={setPhoneNumber}
          />
        )
        : (
          <VerifyOTPForm
            methodId={methodId}
            phoneNumber={phoneNumber}
          />
        )}
      <Image height={15} src={lockup} width={150} />
    </div>
  );
};

export default LoginWithSMS;
