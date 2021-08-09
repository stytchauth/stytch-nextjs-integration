import { Stytch } from "@stytch/stytch-react";
import styles from "../styles/Home.module.css";
import withSession, { ServerSideProps } from "../lib/withSession";
import LoginWithSMS from "../components/LoginWithSMS";
import Profile from "../components/Profile";
import React from "react";

type AppProps = { publicToken: string; user?: object };

const stytchProps = {
  config: {
    loginConfig: {
      magicLinkUrl: "http://localhost:3000/api/authenticate_magic_link",
      expirationMinutes: 30,
    },
    createUserConfig: {
      magicLinkUrl: "http://localhost:3000/api/authenticate_magic_link",
      expirationMinutes: 30,
    },
  },
  style: {
    fontFamily: '"Helvetica New", Helvetica, sans-serif',
    button: {
      backgroundColor: "#0577CA",
    },
    input: {
      textColor: "#090909",
    },
    width: "321px",
  },
  publicToken: process.env.STYTCH_PUBLIC_TOKEN || "",
  callbacks: {
    onEvent: (data: any) => {
      // TODO: check whether the user exists in your DB
      if (data.eventData.type === "USER_EVENT_TYPE") {
        console.log({
          userId: data.eventData.userId,
          email: data.eventData.email,
        });
      }
    },
    onSuccess: (data: any) => console.log(data),
    onError: (data: any) => console.log(data),
  },
};

const getServerSidePropsHandler: ServerSideProps = async ({ req }) => {
  // Get the user's session based on the request
  const user = req.session.get("user");
  const props: AppProps = {
    publicToken: stytchProps.publicToken,
  };
  if (user) {
    props.user = user;
  }
  return {
    props,
  };
};

export const getServerSideProps = withSession(getServerSidePropsHandler);

const App = ({ user, publicToken }: any) => {
  return (
    <div className={styles.root}>
      {!user ? (
        <React.Fragment>
          <div className={styles.container}>
            <Stytch
              publicToken={publicToken || ""}
              config={stytchProps.config}
              style={stytchProps.style}
              callbacks={stytchProps.callbacks}
            />
          </div>
          <LoginWithSMS />
        </React.Fragment>
      ) : (
        <Profile user={user} />
      )}
    </div>
  );
};

export default App;
