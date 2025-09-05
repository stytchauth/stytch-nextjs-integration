# Vercel Analytics Setup

This project now includes Vercel Analytics for tracking user interactions and page views across the entire application.

## What's Included

### 1. **Automatic Page Views**
- All pages automatically track page views
- Analytics component is included in `pages/_app.tsx`

### 2. **Custom Event Tracking**

#### **Page Views**
- **Home Page**: Tracks when users visit the main page
- **Recipe Pages**: Tracks which recipes users are viewing

#### **Free Credit Abuse Recipe**
- **Credit Usage**: Tracks when users attempt to use credits
- **Success/Failure**: Tracks successful and failed credit usage
- **Error Tracking**: Captures specific error messages

### 3. **Event Examples**

```typescript
// Page view tracking
track('page_view', {
  page: 'home',
  userAuthenticated: !!user
});

// Recipe view tracking
track('recipe_view', {
  recipeId: recipe_id.toString(),
  recipeName: recipe.title,
  recipeType: recipe.id
});

// Credit usage tracking
track('credit_used', {
  userId: user?.user_id,
  currentCredits: credits,
  recipe: 'free-credit-abuse'
});

track('credit_used_success', {
  userId: user?.user_id,
  creditsUsed: data.creditsUsed,
  remainingCredits: data.remainingCredits,
  recipe: 'free-credit-abuse'
});
```

## Setup Requirements

### 1. **Next.js Version**
- Upgraded from Next.js 12 to Next.js 13+ to support Vercel Analytics
- All existing functionality preserved

### 2. **Dependencies**
```json
{
  "@vercel/analytics": "^1.5.0",
  "next": "^13.0.0"
}
```

### 3. **Configuration**
- Analytics component added to `pages/_app.tsx`
- Custom tracking functions imported where needed

## Viewing Analytics

1. **Deploy to Vercel** - Analytics only work on Vercel deployments
2. **Visit Analytics Dashboard** - Go to your Vercel project dashboard
3. **Navigate to Analytics** - Click on the "Analytics" tab
4. **View Events** - See page views and custom events

## Custom Events Available

### **Page Views**
- `page_view` - Home page visits
- `recipe_view` - Recipe page visits

### **Free Credit Abuse Events**
- `credit_used` - Credit usage attempts
- `credit_used_success` - Successful credit usage
- `credit_used_error` - Failed credit usage

## Adding More Tracking

To add tracking to other parts of the app:

```typescript
import { track } from '@vercel/analytics';

// Track any custom event
track('event_name', {
  property1: 'value1',
  property2: 'value2'
});
```

## Benefits

1. **User Behavior Insights** - Understand how users interact with recipes
2. **Error Monitoring** - Track and debug issues with credit usage
3. **Performance Monitoring** - Monitor page load times and user experience
4. **Conversion Tracking** - See which recipes are most popular
5. **Fraud Detection** - Monitor patterns in credit usage attempts

## Privacy

- Vercel Analytics is privacy-focused
- No personal data is collected without explicit tracking
- User IDs are only tracked when explicitly included in events
- Complies with GDPR and other privacy regulations
