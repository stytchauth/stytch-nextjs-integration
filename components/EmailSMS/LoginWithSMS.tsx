import React, { useState } from 'react';
import SMSRegister from './SMSRegister';
import VerifyOTPForm from './VerifyOTPForm';

const LoginWithSMS = () => {
  const [otpSent, setOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [methodId, setMethodId] = useState('');

  return (
    <div>
      {!otpSent ? (
        <SMSRegister
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
