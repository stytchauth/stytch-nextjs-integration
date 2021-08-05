import styles from "../styles/Home.module.css";

const Profile = (user: object) => (
  <>
    <h1 className={styles.header}>{"Welcome! You're logged in"}</h1>
    <h1 className={styles.title}>Your user info</h1>
    <pre className={styles.code}>{JSON.stringify(user, null, 2)}</pre>
    <button
      className={styles.logoutButton}
      onClick={async () => {
        const resp = await fetch("/api/logout", { method: "POST" });
        if (resp.status === 200) {
          window.location.reload();
        }
      }}
    >
      Logout
    </button>
  </>
);

export default Profile;
