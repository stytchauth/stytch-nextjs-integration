import { Dispatch, SetStateAction, useState } from "react";
import styles from "../styles/Home.module.css";

const SendOTPForm = (
  setOTPSubmitted: Dispatch<SetStateAction<boolean>>,
  phoneNumber: string,
  setPhoneNumber: Dispatch<SetStateAction<string>>,
  setMethodId: Dispatch<SetStateAction<string>>
) => {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const resp = await fetch("/api/send_otp", {
          method: "POST",
          body: JSON.stringify({
            intlCode: "+1",
            phoneNumber,
          }),
        });
        const data = await resp.json();
        const methodId = data.methodId;
        setMethodId(methodId);
        setOTPSubmitted(true);
      }}
    >
      <div className="telInput">
        <input
          className={styles.flag}
          name="intlCode"
          type="text"
          value="+1"
          readOnly
        />
        <input
          id="phoneNumber"
          className={styles.phoneNumber}
          placeholder="(123) 456-7890"
          value={phoneNumber}
          onChange={(event) => {
            setPhoneNumber(event.target.value);
          }}
          type="tel"
        />
      </div>
      <input
        className={styles.sendOTPButton}
        id="button"
        type="submit"
        value="Send OTP Code"
      />
    </form>
  );
};

const VerifyOTPForm = (
  otpInput: string,
  setOTPInput: Dispatch<SetStateAction<string>>,
  methodId: string
) => {
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const resp = await fetch("/api/authenticate_otp", {
          method: "POST",
          body: JSON.stringify({ otpInput, methodId }),
        });

        if (resp.status === 200) {
          window.location.reload();
        }
      }}
    >
      <div className={"telInput"}>
        <input
          className={styles.telInput}
          value={otpInput}
          placeholder={"Enter 6 digit code"}
          onChange={(event) => setOTPInput(event.target.value)}
        />
        <input
          className={styles.sendOTPButton}
          id="button"
          type="submit"
          value="Verify OTP Code"
        />
      </div>
    </form>
  );
};

const LoginWithSMS = () => {
  const [otpSubmitted, setOTPSubmitted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [methodId, setMethodId] = useState("");
  const [otpInput, setOTPInput] = useState("");

  return (
    <div className={styles.title}>
      <h1 style={{ textAlign: "left" }}>Log in with phone number</h1>
      <p style={{ textAlign: "left", fontSize: "15px", marginBottom: "40px" }}>
        {"This is a direct API integration."}
      </p>
      {!otpSubmitted
        ? SendOTPForm(setOTPSubmitted, phoneNumber, setPhoneNumber, setMethodId)
        : VerifyOTPForm(otpInput, setOTPInput, methodId)}
    </div>
  );
};

export default LoginWithSMS;
