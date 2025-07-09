# Pixel Tracking Setup Guide

This guide will help you set up Facebook Pixel and Google Analytics tracking for your blog website.

## 1. Facebook Pixel Setup

### Step 1: Get Your Facebook Pixel ID
1. Go to [Facebook Business Manager](https://business.facebook.com/)
2. Navigate to Events Manager
3. Click on "Connect Data Sources" and select "Web"
4. Choose "Facebook Pixel"
5. Copy your Pixel ID (it looks like: 1234567890123456)

### Step 2: Add Pixel ID to Your Website
1. Create a `.env` file in the `client` directory (if not exists)
2. Add your Facebook Pixel ID:
```
REACT_APP_FACEBOOK_PIXEL_ID=your_pixel_id_here
```

## 2. Google Analytics Setup

### Step 1: Get Your Google Analytics ID
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Go to Admin > Data Streams
4. Click on your web stream
5. Copy your Measurement ID (it looks like: G-XXXXXXXXXX)

### Step 2: Add Google Analytics ID to Your Website
1. In the same `.env` file in the `client` directory
2. Add your Google Analytics ID:
```
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id_here
```

## 3. Complete Example .env File

Create `client/.env` file with:
```
# Facebook Pixel
REACT_APP_FACEBOOK_PIXEL_ID=1234567890123456

# Google Analytics
REACT_APP_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX

# API URL
REACT_APP_API_URL=http://localhost:5000/api
```

## 4. Testing Your Pixel Setup

### Facebook Pixel Testing:
1. Install [Facebook Pixel Helper Chrome Extension](https://chrome.google.com/webstore/detail/facebook-pixel-helper/)
2. Visit your website
3. The extension should show your pixel firing

### Google Analytics Testing:
1. Go to Google Analytics Real-Time reports
2. Visit your website in another tab
3. You should see yourself as an active user

## 5. Events You Can Track

The pixel tracking is already set up to track:
- Page Views (automatic)
- Blog Post Views (automatic)

You can add custom events like:
- Form Submissions
- Button Clicks
- Scroll Depth
- Time on Page

## 6. Privacy Considerations

Make sure to:
1. Update your Privacy Policy to mention tracking
2. Consider adding a cookie consent banner
3. Comply with GDPR/CCPA regulations

## 7. Troubleshooting

If pixels are not working:
1. Check if `.env` file is in the correct location (`client/.env`)
2. Restart the React development server after adding environment variables
3. Check browser console for any errors
4. Verify pixel IDs are correct
5. Make sure ad blockers are disabled for testing

## Need Help?

For more detailed setup:
- [Facebook Pixel Documentation](https://developers.facebook.com/docs/facebook-pixel/)
- [Google Analytics Documentation](https://support.google.com/analytics/) 