import React, {useState} from 'react';
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


const PasskeyRegistration = () => {
    const [displayRegistration, setDisplayRegistration] = useState(false);
    const { session } = useStytchSession();
    const { user, isInitialized } = useStytchUser();
    const sessionHasPasskeyFactor = session?.authentication_factors?.some(
        (factor: AuthenticationFactor) => factor.delivery_method === "webauthn_registration",
    );
    const sessionHasEmailFactor = session?.authentication_factors?.some(
        (factor: AuthenticationFactor) => factor.delivery_method === "email",
    );

    const displayPasskeyStepUp = sessionHasEmailFactor && !sessionHasPasskeyFactor &&  user?.webauthn_registrations?.length! > 0;
    const displayEmailStepUp = !sessionHasEmailFactor && sessionHasPasskeyFactor;

    const callbackConfig = {
        onEvent: (message: StytchEvent) => {
            console.log(message)
            if (message.type === StytchEventType.PasskeySkip || message.type === StytchEventType.PasskeyDone) {
                setDisplayRegistration(false);
            }
        },
        onError: (error: StytchError) => console.log(error),
    }

    return (
        <>
            {!displayRegistration && (
                <button style={styles.registerButton} onClick={() => setDisplayRegistration(true)}>
                    Register a Passkey
                </button>
            )}
            {
                displayRegistration && (
                    <>
                        {displayPasskeyStepUp && <StepUp type={StepUpType.webauthn} />}
                        {displayEmailStepUp && <StepUp type={StepUpType.email} />}
                        {
                            !displayPasskeyStepUp && !displayEmailStepUp &&
                            <StytchPasskeyRegistration
                                styles={{ container: { width: "400px" } }}
                                config={{ products: [Products.passkeys]}}
                                callbacks={callbackConfig}
                            />
                        }

                    </>
                )
            }
        </>
    );
};

export default PasskeyRegistration;
