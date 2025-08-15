import React, { useState } from 'react';
import { sendOTP, authOTPIntegrated } from '../../lib/otpUtilsRememberedDevice';
import { useRouter } from 'next/router';


function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '').replace(/^1/, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

function SMSRegister() {
  const router = useRouter();
  const [openModalPhone, setOpenModalPhone] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [otp, setOTP] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [methodId, setMethodId] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const phoneModalOpen = async () => {
    setOpenModalPhone(true);
  };

  const handlePhoneModalClose = () => {
    setOpenModalPhone(false);
    setPhoneError('');
    setPhoneNumber('');
  };

  const handleOTPModalClose = () => {
    setOTP('');
    setOpenModal(false);
    setOtpError('');
  };

  const handleOTPSubmit = async () => {
    if (!otp.trim()) {
      setOtpError('Please enter the passcode');
      return;
    }

    setIsLoading(true);
    setOtpError('');

    try {
      await authOTPIntegrated(methodId, otp);
      router.reload();
    } catch (error) {
      console.error('Failed to authenticate OTP:', error);
      setOtpError('Invalid passcode. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim()) {
      setPhoneError('Please enter a phone number');
      return;
    }

    setIsLoading(true);
    setPhoneError('');

    try {
      const response = await sendOTP('+1' + phoneNumber);

      if (!response) {
        console.error('Empty response received from sendOTP');
        setPhoneError('Failed to send passcode. Please try again.');
        return;
      }

      const responseData = await response;
      setMethodId(responseData.phone_id);

      setOpenModalPhone(false);
      setOpenModal(true);
    } catch (error: any) {
      console.error('Failed to send OTP:', error);
      // Use the error message from the backend if available
      const errorMessage = error.message || 'Failed to send passcode. Please check your phone number and try again.';
      setPhoneError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button className="full-width" onClick={phoneModalOpen}>
        Register
      </button>

      {/* Modal for phone number input */}
      {openModalPhone && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <span style={styles.close} onClick={handlePhoneModalClose}>&times;</span>
            <h2>Enter phone number</h2>
            <p>Enter your phone number to receive a passcode for authentication.</p>
            <div style={styles.telInput}>
              <input style={styles.flag} name="intlCode" type="text" value="+1" readOnly />
              <input
                style={styles.phoneNumber}
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="(123) 456-7890"
              />
            </div>
            {phoneError && (
              <p style={styles.errorText}>
                ❌ {phoneError}
              </p>
            )}
            <p style={styles.smsDisclaimer}>
              By continuing, you consent to receive an SMS for verification. Message and data rates may apply.
            </p>
            <button
              className="full-width"
              onClick={handlePhoneSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Modal for OTP input */}
      {openModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <span style={styles.close} onClick={handleOTPModalClose}>&times;</span>
            <h2>Enter Passcode</h2>
            <p>
              A 6-digit passcode was sent to you at <strong>{formatPhoneNumber(phoneNumber)}</strong>.
            </p>
            <input
              style={styles.otpInput}
              type="text"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              placeholder="Enter OTP"
            />
            {otpError && (
              <p style={styles.errorText}>
                ❌ {otpError}
              </p>
            )}
            <p style={styles.smsDisclaimer}>
              Didn&apos;t receive a code? <a style={styles.smsDisclaimer} href="#" onClick={(e) => { e.preventDefault(); handlePhoneSubmit(); }}>Resend</a>
            </p>
            <button
              className="full-width"
              onClick={handleOTPSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    position: 'relative',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: '0 3px 3px 0',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
  },
  close: {
    position: 'absolute',
    top: 10,
    right: 18,
    cursor: 'pointer',
  },
  telInput: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
  },
  flag: {
    background: 'url("/stars-and-stripes.png") no-repeat scroll 8px 16px',
    paddingLeft: 40,
    borderRadius: 0,
    width: 75,
    border: 'none',
  },
  phoneNumber: {
    border: 'none',
    paddingLeft: 10,
    fontSize: 18,
    flexGrow: 1,
    width: 'calc(100%)',
  },
  smsDisclaimer: {
    color: '#5c727d',
    fontSize: 14,
    marginBottom: 16,
    marginTop: 15,
  },
  otpInput: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #ccc',
    borderRadius: '3px',
    marginBottom: '10px',
    width: '100%',
  },
  errorText: {
    color: '#dc3545',
    fontSize: '14px',
    marginBottom: '10px',
    marginTop: '5px',
  }
};

export default SMSRegister;
