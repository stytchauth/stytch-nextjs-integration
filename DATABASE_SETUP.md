# Database Setup for Free Credit Abuse Prevention

This guide explains how to set up the PostgreSQL database for the free credit abuse prevention system.

## Prerequisites

- Vercel Postgres database already set up
- `@vercel/postgres` package installed in your project

## Database Schema

The system uses a simple table to track user devices and prevent free credit abuse:

```sql
CREATE TABLE user_devices (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  visitor_fingerprint TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, visitor_fingerprint)
);
```

## Setup Steps

### 1. Run the Migration

Copy and paste the SQL from `migrations/create_user_devices_table.sql` into your Vercel Postgres database:

- Go to your Vercel dashboard
- Navigate to Storage → Postgres
- Click on your database
- Go to the "SQL" tab
- Paste and run the migration SQL

### 2. Environment Variables

Make sure you have these environment variables set in your Vercel project:

```env
POSTGRES_URL="your_postgres_connection_string"
POSTGRES_HOST="your_postgres_host"
POSTGRES_DATABASE="your_postgres_database"
POSTGRES_USERNAME="your_postgres_username"
POSTGRES_PASSWORD="your_postgres_password"
```

## How It Works

### Device Tracking
Within the Free Credit Abuse recipe:

- When a user authenticates, the system generates a `visitor_fingerprint` using Stytch DFP
- The system checks if this device has been used before for this user
- If it's a new device, free credits are authorized and the device is recorded
- If it's a repeat device, the user is flagged for review

Devices are not tracked in other recipes. 

### Database Functions

The system provides these database functions:

- `addUserDevice(userId, visitorFingerprint)` - Records a new device for a user
- `getUserDevices(userId)` - Gets all devices for a user
- `isNewDevice(userId, visitorFingerprint)` - Checks if a device is new for a user
- `getDeviceCount(userId)` - Gets the total device count for a user

### Session Claims

The system stores device information in session custom claims:

- `visitor_fingerprint` - The device fingerprint
- `flagged_for_review` - Whether the account was flagged for review
- `abuse_reason` - Reason for flagging (e.g., 'device_already_associated_with_different_user')
- `existing_owner` - User ID of the existing device owner (if applicable)
- `credits_granted` - Number of credits granted this session
- `device_owner` - User ID who owns this device

### User Trusted Metadata

The system tracks free credits in user trusted metadata:

- `free_credits` - Total number of free credits available
- `last_credit_grant` - Timestamp of last credit grant

## Testing

1. Create a new account and authenticate
2. Check that the device is recorded in the database
3. Try to authenticate from the same device again
4. Verify that repeat devices are flagged for review

## Monitoring

You can monitor the system by:

- Checking the `user_devices` table for new entries
- Reviewing session custom claims for fraud detection results
- Monitoring logs for fraud detection decisions

## Customization

The fraud detection logic in `pages/api/authenticate_eml_free_credit_abuse.ts` can be customized:

- Modify the `isNewDevice` check to implement your business rules
- Add additional fraud detection criteria
- Implement rate limiting or other abuse prevention measures
