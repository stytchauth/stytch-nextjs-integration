import React, { useState } from 'react';
import SendOTPForm from './SendOTPForm';
import VerifyOTPForm from './VerifyOTPForm';

const LoginWithSMS = () => {
  const [otpSent, setOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [methodId, setMethodId] = useState('');

  return (
    <div>
      {!otpSent ? (
        <SendOTPForm
          phoneNumber={phoneNumber}
          setMethodId={setMethodId}
          setOTPSent={setOTPSent}
          setPhoneNumber={setPhoneNumber}
        />
      ) : (
        <VerifyOTPForm methodId={methodId} phoneNumber={phoneNumber} />
      )}
    </div>
  );
};

export default LoginWithSMS;
