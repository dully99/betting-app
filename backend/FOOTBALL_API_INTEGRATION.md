# Football Prediction Provider Integration

## Overview
This integration adds automatic syncing of football fixtures from external API providers (e.g., RapidAPI Football API) into your existing SmartBet prediction system.

## What Was Added

### 1. Database Changes
- **Prediction Entity**: Added `providerFixtureId` field (unique constraint) to prevent duplicate imports

### 2. New Configuration
- **FootballProviderConfig.java**: Configuration class for provider API settings
- **application.properties**: Added provider API credentials and sync settings

### 3. New Services
- **FootballProviderService**: Handles API calls to external football data provider
- **PredictionSyncService**: Maps external fixtures to your Prediction entity and saves them
- **PredictionSyncScheduler**: Automatic daily sync job (runs at 6 AM by default)

### 4. New DTOs
- **FootballApiResponse**: Generic wrapper for API responses
- **FixtureDTO**: Maps external fixture data structure

### 5. Updated Controllers
- **AdminController**: Added two new endpoints for manual sync

## Configuration

### Step 1: Get RapidAPI Key
1. Go to https://rapidapi.com/api-sports/api/api-football
2. Subscribe to a plan (free tier available)
3. Copy your API key

### Step 2: Update application.properties
```properties
football.provider.api.key=YOUR_RAPIDAPI_KEY_HERE
```

Replace `YOUR_RAPIDAPI_KEY_HERE` with your actual key.

### Step 3: Configure Sync Schedule (Optional)
```properties
# Cron format: second minute hour day month weekday
football.provider.sync.cron=0 0 6 * * ?  # Daily at 6 AM
football.provider.sync.enabled=true      # Enable/disable auto-sync
```

## API Endpoints

### Manual Sync Endpoints

#### Sync Today's Fixtures
```bash
POST /api/admin/sync/today
```

**Response:**
```json
{
  "success": true,
  "message": "Today's predictions synced successfully",
  "data": {
    "synced": 15
  },
  "timestamp": "2026-06-12T16:30:00"
}
```

#### Sync Tomorrow's Fixtures
```bash
POST /api/admin/sync/tomorrow
```

**Response:**
```json
{
  "success": true,
  "message": "Tomorrow's predictions synced successfully",
  "data": {
    "synced": 12
  },
  "timestamp": "2026-06-12T16:30:00"
}
```

## How It Works

### Automatic Sync (Scheduled)
1. Runs daily at 6 AM (configurable via `football.provider.sync.cron`)
2. Fetches today's and tomorrow's fixtures from the provider API
3. Filters out fixtures that have already started
4. Checks for duplicates using `providerFixtureId`
5. Generates predictions with realistic odds and confidence levels
6. Saves new predictions to the database

### Manual Sync (Admin Endpoints)
- Use the admin endpoints to manually trigger sync
- Useful for testing or immediate updates
- Same duplicate prevention logic applies

### Duplicate Prevention
- Each fixture has a unique `providerFixtureId` (format: `fixture_{externalId}`)
- Database constraint prevents duplicate entries
- Sync service checks existence before saving

### Prediction Generation
The sync service automatically generates:
- **Prediction Type**: Random selection from common bet types (Home Win, Over 2.5, BTTS, etc.)
- **Odds**: Realistic odds based on prediction type (1.5 - 4.0 range)
- **Confidence**: Random value between 65-95%
- **Analysis**: Auto-generated text based on teams and league
- **Category**: Defaults to FREE category
- **Status**: Always PENDING for new fixtures

## Testing

### 1. Test Provider Connection
```bash
curl -X POST http://localhost:8080/api/admin/sync/today
```

### 2. Check Logs
Look for:
```
INFO - Fetched 25 fixtures for date 2026-06-12
INFO - Synced prediction: Liverpool vs Chelsea
INFO - Sync completed. 15 new predictions added
```

### 3. Verify Database
```sql
SELECT * FROM predictions WHERE provider_fixture_id IS NOT NULL;
```

## Customization

### Change Prediction Logic
Edit `PredictionSyncService.java`:
- `generatePrediction()`: Modify prediction types
- `generateOdds()`: Adjust odds calculation
- `generateConfidence()`: Change confidence range
- `generateAnalysis()`: Customize analysis text

### Filter Fixtures
In `PredictionSyncService.syncFixtures()`, add filters:
```java
// Example: Only sync Premier League
if (!"Premier League".equals(fixture.getLeague().getName())) {
    continue;
}
```

### Change Sync Schedule
Update `application.properties`:
```properties
# Every 6 hours
football.provider.sync.cron=0 0 */6 * * ?

# Every day at 8 AM and 8 PM
football.provider.sync.cron=0 0 8,20 * * ?
```

## Troubleshooting

### No Fixtures Synced
- Check API key is correct
- Verify API quota hasn't been exceeded
- Check logs for error messages
- Ensure `football.provider.sync.enabled=true`

### Duplicate Key Errors
- Normal behavior - means fixture already exists
- Sync service will skip and continue with next fixture

### Wrong Timezone
- Fixtures are converted to system default timezone
- Adjust in `mapFixtureToPrediction()` if needed

## Cost Considerations

**RapidAPI Football API Pricing:**
- Free tier: 100 requests/day
- Basic: $10/month - 3,000 requests/day
- Pro: $30/month - 10,000 requests/day

**Estimated Usage:**
- Daily auto-sync: ~2 requests/day (today + tomorrow)
- Manual syncs: varies
- Recommended: Basic plan for production

## Files Modified

### Existing Files Updated:
1. `Prediction.java` - Added `providerFixtureId` field
2. `PredictionRepository.java` - Added duplicate check methods
3. `AdminController.java` - Added sync endpoints
4. `SmartBetApplication.java` - Enabled scheduling
5. `application.properties` - Added provider configuration

### New Files Created:
1. `config/FootballProviderConfig.java`
2. `dto/provider/FootballApiResponse.java`
3. `dto/provider/FixtureDTO.java`
4. `service/FootballProviderService.java`
5. `service/PredictionSyncService.java`
6. `scheduler/PredictionSyncScheduler.java`

## Next Steps

1. Get your RapidAPI key
2. Update `application.properties` with the key
3. Restart the backend server
4. Test manual sync: `POST /api/admin/sync/today`
5. Monitor logs for successful sync
6. Check predictions appear in your app
