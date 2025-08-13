import React, { useState } from 'react';
import { sendOTP, authOTPIntegrated } from '../../lib/otpUtilsRememberedDevice';
import { useRouter } from 'next/router';

interface SMSOTPButtonProps {
  phoneNumber: string;
}

function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '').replace(/^1/, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

function SMSOTPButton({ phoneNumber }: SMSOTPButtonProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false); // State variable to control the modal visibility
  const [otp, setOTP] = useState(''); // State variable to store the OTP input by the user
  const [methodId, setMethodId] = useState(''); // State variable to store the method ID

  const authenticate = async () => {
    try {
      const response = await sendOTP(phoneNumber);

      // Check if response is empty
      if (!response) {
        console.error('Empty response received from sendOTP');
        return;
      }

      const responseData = await response;
      setMethodId(responseData.phone_id);

      // Set state to open the modal
      setOpenModal(true);

    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('Failed to send OTP:', error);
    }
  };

  const handleModalClose = () => {
    // Clear OTP input and close the modal
    setOTP('');
    setOpenModal(false);
  };

  const handleOTPSubmit = async () => {
    try {
      // Call the authOTP function with methodID and otp
      console.log('METHOD', methodId);
      await authOTPIntegrated(methodId, otp);
      router.reload();
    } catch (error) {
      // Handle errors here, e.g., display an error message
      console.error('Failed to authenticate OTP:', error);
    }
  };

  const handleResend = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    authenticate();
  };

  return (
    <div>
      <button className="full-width" onClick={authenticate}>
        Authenticate
      </button>

      {/* Modal for OTP input */}
      {openModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <span style={styles.close} onClick={handleModalClose}>&times;</span>
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
            <p style={styles.smsDisclaimer}>
            Didn&apos;t receive a code? <a style={styles.smsDisclaimer} href="#" onClick={handleResend}>Resend</a>
            </p>
            <button className="full-width" onClick={handleOTPSubmit}>Submit</button>
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
  }
};

export default SMSOTPButton;
