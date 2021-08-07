import React from "react";
import styles from "../styles/Home.module.css";
import { sendOTP } from "./SendOTPForm";

type Props = {
  methodId: string;
  phoneNumber: string;
}

const VerifyOTPForm = (props: Props) => {
  const { methodId, phoneNumber } = props;
  const [passcodeArray, setPasscodeArray] = React.useState(['', '', '', '', '', '']);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [currentMethodId, setCurrentMethodId] = React.useState(methodId);
  const [isError, setIsError] = React.useState(false);
  const activeInputId = React.useRef(1);

  const strippedNumber = phoneNumber.replace(/\D/g, "");
  const parsedPhoneNumber = `(${strippedNumber.slice(0, 3)}) ${strippedNumber.slice(3, 6)}-${strippedNumber.slice(6, 10)}`;

  const isValidPasscodeDigit = (digitValue: string) => {
    const regex = /^[0-9]$/g;
    if (digitValue.match(regex)) {
      return true;
    }
    return false;
  }

  const isValidPasscode = () => {
    for (let i = 0; i < passcodeArray.length; i++) {
      if (!isValidPasscodeDigit(passcodeArray[i])) {
        return false;
      }
    }
    return true;
  }

  // Handles auto tabbing to next passcode digit input.
  const autoTab = (e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (activeInputId.current > 0) {
        activeInputId.current = activeInputId.current - 1;
      }
    } else if (isValidPasscodeDigit(e.key)) {
      if (activeInputId.current < 5) {
        activeInputId.current = activeInputId.current + 1;
      }
    }
    document.getElementById(`${activeInputId.current}`)?.focus();
  }

  const onPasscodeDigitChange = (e: React.ChangeEvent<{ id: string; value: string }>) => {
    const currentPasscode = passcodeArray;
    currentPasscode[Number(e.target.id)] = e.target.value;
    setPasscodeArray(currentPasscode);

    if (isValidPasscode()) {
      setIsDisabled(false);
      setIsError(false);
    } else {
      setIsDisabled(true);
    }
  };

  const resetPasscode = () => {
    setPasscodeArray(['', '', '', '', '', '']);
    activeInputId.current = 0;
    document.getElementById('0')?.focus();
  }

  const resendCode = async () => {
    const methodId = await sendOTP(phoneNumber);
    setCurrentMethodId(methodId);
    resetPasscode();
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidPasscode()) {
      const otpInput = passcodeArray.join("");

      try {
        const resp = await fetch("/api/authenticate_otp", {
          method: "POST",
          body: JSON.stringify({ otpInput, methodId: currentMethodId }),
        });

        if (resp.status === 200) {
          window.location.reload();
        } else {
          setIsError(true);
          resetPasscode();
        }
      } catch {
        setIsError(true);
        resetPasscode();
      }
    }
  };

  const renderPasscodeInputs = () => {
    const inputs = [];
    for (let i = 0; i < 6; i += 1) {
      inputs.push(
        <input
          autoFocus={i === 0}
          className={styles.passcodeInput}
          id={`${i}`}
          key={i}
          maxLength={1}
          onChange={onPasscodeDigitChange}
          onKeyUp={autoTab}
          placeholder="0"
          size={1}
          type="text"
          value={passcodeArray[i]}
        />
      )
    }
    return inputs.map(input => input);
  }

  return (
    <div>
      <h2>Enter passcode</h2>
      <p className={styles.smsInstructions}>A 6-digit passcode was sent to you at <strong>{parsedPhoneNumber}</strong>.</p>
      <form onSubmit={onSubmit}>
        <div className={styles.passcodeContainer}>
          <p className={styles.errorText}>{isError ? 'Invalid code. Please try again.' : ''}</p>
          <div className={styles.passcodeInputContainer}>
            {renderPasscodeInputs()}
          </div>
        </div>
        <div className={styles.resendCodeContainer}>
          <p className={styles.resendCodeText}>Didn’t get it? </p>
          <button className={`${styles.resendCodeButton} ${styles.resendCodeText}`} onClick={resendCode}>Resend code</button>
        </div>
        <input
          className={styles.primaryButton}
          disabled={isDisabled}
          id="button"
          type="submit"
          value="Verify OTP Code"
        />
      </form>
    </div>
  );
};

export default VerifyOTPForm;
