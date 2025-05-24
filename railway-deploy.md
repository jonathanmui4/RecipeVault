# Railway Deployment Instructions

## Required Railway Environment Variables

Set these in your Railway project dashboard:

### Essential Variables:
```bash
SPRING_PROFILES_ACTIVE=railway
```

### Optional Performance Variables:
```bash
JAVA_OPTS=-Xmx512m -Xms256m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0
```

## Database Setup

1. **Add MySQL service** in Railway dashboard
2. Railway automatically provides these environment variables:
   - `DATABASE_URL` - Full database connection string
   - `MYSQLUSER` - Database username  
   - `MYSQLPASSWORD` - Database password
   - `MYSQLHOST` - Database host
   - `MYSQLPORT` - Database port
   - `MYSQLDATABASE` - Database name

3. **No manual database configuration needed** - Railway handles everything!

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