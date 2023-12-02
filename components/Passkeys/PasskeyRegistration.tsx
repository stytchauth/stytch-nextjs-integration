import React, {useEffect, useState} from 'react';
import {AuthenticationFactor, Products, StytchError, StytchEvent, StytchEventType} from '@stytch/vanilla-js';
import {StytchPasskeyRegistration, useStytch, useStytchSession, useStytchUser} from '@stytch/nextjs';

const styles: Record<string, React.CSSProperties> = {
    registerButton: {
        margin: 'auto'
    }
};

enum StepUpType {
    email = "email",
    webauthn = "webauthn",
}

const StepUp = ({ type }: { type: StepUpType }) => {
    const [inputValue, setInputValue] = useState("");
    const [methodID, setMethodID] = useState("");
    const { user } = useStytchUser();
    const [error, setError] = useState("");
    const stytch = useStytch();

    const validateOTPButtonClick = () => {
        stytch.otps.authenticate(inputValue, methodID, {
            session_duration_minutes: 30,
        }).catch((e) => {
            setError("Error occurred validating OTP: " + e);
        });
    };

    const handleSendOTPButtonClick = () => {
            stytch.otps.email
                .send(user?.emails?.at(0)?.email as string, {
                    expiration_minutes: 5,
                })
                .then((resp) => {
                    setMethodID(resp.method_id);
                })
                .catch((e) => {
                    setError("Error occurred sending email: " + e);
                });
    };

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    if (type === StepUpType.webauthn) {
        return (
            <>
                <h3>You need to step up {type} before creating Passkeys!</h3>
                <button
                    color="primary"
                    onClick={() => {
                        stytch.webauthn.authenticate({
                            session_duration_minutes: 30,
                        });
                    }}
                >
                    Step Up WebAuthn
                </button>
            </>
        );
    }

    return (
        <div>
            <h3>You need to step up {type} before creating Passkeys!</h3>
            <button
                className="mt2"
                onClick={handleSendOTPButtonClick}
            >
                Send OTP to{" "}
                {user?.emails?.at(0)?.email as string}
            </button>
            <br/>
            <br/>
            <input
                placeholder="123456"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
            />
            <br/>
            <button
                className="mt2"
                color="primary"
                onClick={validateOTPButtonClick}
            >
                Validate OTP
            </button>
            {error}
        </div>
    );
};


enum PasskeyRegViews {
    Start = "START",
    Register = "REGISTER",
    Success = "SUCCESS",
    StepUpWebAuthn = "STEP_UP_WEBAUTHN",
    StepUpEmail = "STEP_UP_EMAIL",
}

const PasskeyRegistration = () => {
    const [displayView, setDisplayView] = useState(PasskeyRegViews.Start);
    const { session } = useStytchSession();
    const { user, isInitialized } = useStytchUser();

    useEffect(() => {
        const sessionHasPasskeyFactor = session?.authentication_factors?.some(
            (factor: AuthenticationFactor) => factor.delivery_method === "webauthn_registration",
        );
        const sessionHasEmailFactor = session?.authentication_factors?.some(
            (factor: AuthenticationFactor) => factor.delivery_method === "email",
        );
        const displayPasskeyStepUp = sessionHasEmailFactor && !sessionHasPasskeyFactor &&  user?.webauthn_registrations?.length! > 0;
        const displayEmailStepUp = !sessionHasEmailFactor && sessionHasPasskeyFactor;
        if (displayEmailStepUp) {
            setDisplayView(PasskeyRegViews.StepUpEmail);
        } else if (displayPasskeyStepUp){
            setDisplayView(PasskeyRegViews.StepUpWebAuthn);
        }

    },[session, user]);

    const callbackConfig = {
        onEvent: (message: StytchEvent) => {
            console.log(message)
            if (message.type === StytchEventType.PasskeySkip) {
                setDisplayView(PasskeyRegViews.Start);
            }
            if (message.type === StytchEventType.PasskeyRegister) {
                setDisplayView(PasskeyRegViews.Success);
            }
        },
        onError: (error: StytchError) => console.log(error),
    }

    return (
        <>
            {displayView === PasskeyRegViews.Start && (
                <button style={styles.registerButton} onClick={() => setDisplayView(PasskeyRegViews.Register)}>
                    Register a Passkey
                </button>
            )}
            {displayView === PasskeyRegViews.StepUpWebAuthn && (
                <StepUp type={StepUpType.webauthn} />
            )}
            {displayView === PasskeyRegViews.StepUpEmail && (
                <StepUp type={StepUpType.email} />
            )}
            {displayView === PasskeyRegViews.Register && (
                <StytchPasskeyRegistration
                    styles={{ container: { width: "400px" } }}
                    config={{ products: [Products.passkeys]}}
                    callbacks={callbackConfig}
                />
            )}
            {displayView === PasskeyRegViews.Success && (
                <div>
                    <h3>Passkey created!</h3>
                    <p>
                        You can now use your Passkey to sign in to your account.
                    </p>
                    <button
                        className="mt2"
                        onClick={() => {
                            setDisplayView(PasskeyRegViews.Register);
                        }}>
                        Register Another Passkey
                    </button>
                </div>
            )}
        </>
    );
};

export default PasskeyRegistration;
