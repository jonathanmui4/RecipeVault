# Railway Deployment Instructions

## Required Railway Environment Variables

Set these in your Railway project dashboard:

```bash
SPRING_PROFILES_ACTIVE=railway
JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
```

## Database Setup

1. Add MySQL service in Railway dashboard
2. Railway will automatically provide `DATABASE_URL` environment variable
3. No need to set individual MySQL variables - Railway handles this

## Deploy Steps

1. Connect your GitHub repository to Railway
2. Set the environment variables above
3. Add MySQL service
4. Deploy will happen automatically on each push to main branch

## Health Check

Railway will use the health check endpoint: `/actuator/health`

## Notes

- Port is automatically provided by Railway via `PORT` environment variable
- Database URL is automatically provided via `DATABASE_URL`
- Application will run with `railway` Spring profile
- Logs will output to stdout (Railway console)