import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import lock from '/public/lock.svg';
import CodeBlock from '../../../components/common/CodeBlock';
import SMSOTPButton from '../../../components/RememberedDeviceIntegrated/SMSOTPButtonRememberedDevice';
import SMSRegister from '../../../components/RememberedDeviceIntegrated/SMSRegisterRememberedDevice';
import { useEffect, useState } from 'react';
import { SuccessData } from '../../api/known_devices_integrated';

const Profile = () => {
  const router = useRouter();
  const [deviceResponse, setDeviceResponse] = useState<SuccessData|undefined>(undefined);
  const [error, setError] = useState<string|undefined>(undefined);

  useEffect(() => {
    const fetchKnownDevices = async () => {
      const resp = await fetch('/api/known_devices_integrated', { method: 'POST' });
      const data = await resp.json();
      if (data.errorString) {
        setError(data.errorString);
      } else {
        setDeviceResponse(data as SuccessData);
      }
    };
    fetchKnownDevices();
  }, []);

  if (error) {
    return (
      <div>
        <p>{`Error: ${error}`}</p>
        <Link href="/">
          <a className="link">Click here to start over</a>
        </Link>
      </div>
    );
  }

  const signOut = async () => {
    try {
      const resp = await fetch('/api/logout', { method: 'POST' });
      if (resp.status === 200) {
        router.push('/recipes/remembered-device-integrated');
      }
    } catch {}
  };

  const clearKnownDevices = async () => {
    try {
      const resp = await fetch('/api/clear_known_devices_integrated', { method: 'POST' });
      if (resp.status === 200) {
        // Refresh the page to show updated state
        router.reload();
      } else {
        const errorData = await resp.json();
        console.error('Failed to clear known devices:', errorData.errorString);
      }
    } catch (error) {
      console.error('Failed to clear known devices:', error);
    }
  };



  if (!deviceResponse || !deviceResponse.user) {
    return <></>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.details}>
        <h2>Welcome to your profile!</h2>

        <div style={styles.secretBox}>
          <h3>Super secret area</h3>
          {deviceResponse.superSecretData ? (
            <div>
              <p>{deviceResponse.superSecretData}</p>
              {deviceResponse.isRememberedDevice && (
                <p style={styles.rememberedDeviceNote}>
                  🎉 <strong>Device remembered!</strong>
                </p>
              )}
            </div>
          ) : (
            <>
              <Image alt="Lock" src={lock} width={100} />
              <p>
                {deviceResponse.requiresMfa
                  ? `Additional authentication required. This appears to be a new device (${deviceResponse.visitorID || 'unknown device'}). Please complete SMS verification to continue.`
                  : 'Super secret profile information is secured by two factor authentication. To unlock this area complete the SMS OTP flow.'
                }
              </p>
              {deviceResponse.hasRegisteredPhone && deviceResponse.phoneNumber ? (
                <SMSOTPButton phoneNumber={deviceResponse.phoneNumber} />
              ) : (
                <SMSRegister />
              )}
            </>
          )}
        </div>

        <button onClick={signOut}>Sign out</button>
      </div>
      <div style={styles.details}>
        <h2>Current State</h2>

        <h3>Visitor ID</h3>
        <div style={styles.sessionInfo}>
          <p style={styles.successNote}>
            { deviceResponse.visitorID || 'No visitor ID found' }
          </p>
        </div>

        <h3>Trusted Devices</h3>
        <div style={styles.userInfo}>
          <div style={styles.metadataHeader}>
            <p style={styles.infoText}>
              Devices where this user has completed MFA
            </p>
          </div>
          <div style={styles.metadataHeader}>
            <div style={styles.knownDevicesList}>
              {deviceResponse.deviceList.map((device: string, index: number) => {
                const currentDevice = device === deviceResponse.visitorID;
                return (
                  <div key={index} style={styles.deviceBox}>
                    💻 {device} {currentDevice ? ' (current device)' : ''}
                  </div>
                )
              })}
            </div>
          </div>
          <div style={styles.metadataHeader}>
            {deviceResponse.deviceList.length > 0 && (
              <button
                onClick={clearKnownDevices}
                style={styles.clearButton}
                title="Clear the list of known devices (useful for testing)"
              >
                🗑️ Clear
              </button>
            )}
          </div>
        </div>

        <h2>Raw Stytch Data</h2>
        <h3>Session</h3>
        <CodeBlock codeString={JSON.stringify(deviceResponse.session, null, 2).replace(' ', '')} />

        <h3>User</h3>
        <CodeBlock codeString={JSON.stringify(deviceResponse.user, null, 2).replace(' ', '')} />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    margin: '48px 24px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '48px',
  },
  details: {
    backgroundColor: '#FFF',
    padding: '48px',
    flexBasis: '900px',
    flexGrow: 1,
  },
  secretBox: {
    display: 'flex',
    backgroundColor: '#ecfaff',
    flexGrow: '1',
    flexDirection: 'column',
    margin: '50px 0px',
    alignItems: 'center',
    padding: '8px 24px',
  },
  rememberedDeviceNote: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '10px',
    borderRadius: '4px',
    marginTop: '10px',
    textAlign: 'center',
  },
  sessionInfo: {
    marginBottom: '20px',
  },
  userInfo: {
    marginBottom: '20px',
  },
  infoText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '10px',
  },
  successNote: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  pendingNote: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '8px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '14px',
  },
  metadataHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '10px',
  },
  knownDevicesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  deviceBox: {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '8px 12px',
    borderRadius: '4px',
    fontSize: '14px',
    border: '1px solid #c3e6cb',
  },
  clearButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
    flexShrink: 0,
    height: 'fit-content',
  },
};

export default Profile;
