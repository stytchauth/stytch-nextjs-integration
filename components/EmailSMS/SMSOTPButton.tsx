import React, { useState } from 'react';
import SendOTPForm from './SendOTPForm';
import VerifyOTPForm from './VerifyOTPForm';

type Props = {
  user: {
    phone_numbers: {
      phone_number: string
    }[]
  };
}

const SMSOTPButton = (props: Props) => {
  const { user } = props;
  const [otpSent, setOTPSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [methodId, setMethodId] = useState('');

  if (!phoneNumber && user.phone_numbers.length > 0) {
    setPhoneNumber(user.phone_numbers[0].phone_number);
  }

  return (
    <div>
      {otpSent || user.phone_numbers.length > 0 ? ( 
        <VerifyOTPForm
          otpSent={otpSent}
          methodId={methodId}
          phoneNumber={phoneNumber}
          setOTPSent={setOTPSent}
        />
      ) : (
        <SendOTPForm
          phoneNumber={phoneNumber}
          setMethodId={setMethodId}
          setOTPSent={setOTPSent}
          setPhoneNumber={setPhoneNumber}
        />
      )}
    </div>
  );
};

export default SMSOTPButton;