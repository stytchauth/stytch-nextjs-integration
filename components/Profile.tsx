import React from "react";
import styles from "../styles/Home.module.css";
import StytchContainer from "./StytchContainer";

type Props = {
  user: any;
}

const Profile = (props: Props) => {
  const { user } = props;
  return (
    <StytchContainer>
      <>
        <h2>{"Welcome!"}</h2>
        <p className={styles.profileSubHeader}>Thank you for using Stytch! Here’s your user info.</p>
        <pre className={styles.code}>{JSON.stringify(user, null, ' ').replace(' ', '')}</pre>
        <button
          className={styles.primaryButton}
          onClick={async () => {
            const resp = await fetch("/api/logout", { method: "POST" });
            if (resp.status === 200) {
              window.location.reload();
            }
          }}
        >
          Sign out
        </button>
      </>
    </StytchContainer>
  )
};

export default Profile;
