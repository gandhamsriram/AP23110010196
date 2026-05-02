# Logging Middleware

This directory contains middleware for logging API requests and responses in the Campus Notification System.

## Purpose

- Log all incoming HTTP requests (method, URL, timestamp)
- Log response status codes and durations
- Track API errors for debugging

## Usage

The logging middleware can be integrated into the backend Express server:

```javascript
import morgan from 'morgan';

// Log all requests to console
app.use(morgan('combined'));
```

## Frontend Console Logging

The frontend API service (`services/api.js`) includes `console.log` / `console.warn` statements for:
- Every API request with parameters
- Successful responses with data shape
- Failed requests with error details
- Mock data fallback activation

Check the browser DevTools console (F12 → Console) to see request logs.
