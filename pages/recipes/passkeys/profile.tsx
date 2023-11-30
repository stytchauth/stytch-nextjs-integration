import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import {useStytchUser, useStytch, useStytchSession, StytchPasskeyRegistration} from '@stytch/nextjs';
import CodeBlock from '../../../components/common/CodeBlock';
import PasskeyRegistration from "../../../components/Passkeys/PasskeyRegistration";

const Profile = () => {
    const { user, isInitialized } = useStytchUser();
    const stytch = useStytch();
    const router = useRouter();

    useEffect(() => {
        if (isInitialized && !user) {
            router.replace('/');
        }
    }, [user, isInitialized, router]);

    const signOut = async () => {
        await stytch.session.revoke();
    };

    return (
        <div style={styles.container}>
            <div style={styles.details}>
                <h2>Welcome to your profile!</h2>
                <p>Below is your Stytch user object.</p>
                <CodeBlock codeString={JSON.stringify(user, null, 2).replace(' ', '')} maxHeight="500px" />

                <button className="mt2" onClick={signOut}>
                    Sign out
                </button>
            </div>
            <div style={styles.registrationDetails}>
                <PasskeyRegistration />
            </div>
        </div>
    );
};

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        margin: '48px 24px',
        justifyContent: 'center',
        gap: '48px',
        flexWrap: 'wrap',
    },
    details: {
        backgroundColor: '#FFF',
        padding: '24px',
        flexBasis: '450px',
        flexGrow: 1,
        flexShrink: 1,
    },
    registrationDetails: {
        backgroundColor: '#FFF',
        display: 'flex',
        padding: '24px',
        width: '500px',
        flexShrink: 1,
        justifyContent: 'center',
    },
};

export default Profile;
