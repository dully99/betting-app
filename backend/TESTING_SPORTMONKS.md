# Testing Sportmonks Integration

## Quick Verification Steps

### 1. Check Configuration

Verify your Sportmonks API token is set:

```bash
echo $SPORTMONKS_API_TOKEN
```

If not set:
```bash
export SPORTMONKS_API_TOKEN=your_actual_token_here
```

### 2. Restart Backend

```bash
cd /Users/mac/Codes/smart-bet/backend
mvn spring-boot:run
```

### 3. Test Manual Sync

```bash
curl -X POST http://localhost:8080/api/admin/sync/today
```

### 4. Check Logs

Look for these log messages:

**✅ Success - Sportmonks API Called:**
```
INFO - Fetching fixtures from Sportmonks: https://api.sportmonks.com/v3/football/fixtures/date/2026-06-12?api_token=***TOKEN***&include=participants;league;predictions
INFO - Fetched 25 fixtures for date 2026-06-12 from Sportmonks
```

**✅ Success - Using Sportmonks Predictions:**
```
DEBUG - Using Sportmonks prediction for Arsenal vs Chelsea: HOME_WIN (type: MATCH_RESULT)
INFO - Synced new prediction: Arsenal vs Chelsea
```

**⚠️ Fallback - No Sportmonks Predictions:**
```
DEBUG - Generated prediction for Liverpool vs Man City (no Sportmonks data): Over 2.5 Goals (type: OVER_UNDER)
```

**❌ Error - API Token Invalid:**
```
ERROR - Error fetching fixtures from Sportmonks for date 2026-06-12: 401 Unauthorized
```

**❌ Error - No Fixtures Available:**
```
WARN - Empty response from Sportmonks for date 2026-06-12
```

### 5. Verify Database

Check if predictions were created:

```bash
mysql -u root smartbet_db -e "SELECT id, home_team, away_team, prediction_type, prediction_value, confidence, is_vip, provider_fixture_id FROM predictions WHERE provider_fixture_id LIKE 'sportmonks_%' LIMIT 5;"
```

Expected output:
```
+----+-------------+-------------+-----------------+-------------------+------------+--------+----------------------+
| id | home_team   | away_team   | prediction_type | prediction_value  | confidence | is_vip | provider_fixture_id  |
+----+-------------+-------------+-----------------+-------------------+------------+--------+----------------------+
|  1 | Arsenal     | Chelsea     | MATCH_RESULT    | Home Win          |         92 |      1 | sportmonks_12345     |
|  2 | Liverpool   | Man City    | OVER_UNDER      | Over 2.5 Goals    |         87 |      0 | sportmonks_12346     |
+----+-------------+-------------+-----------------+-------------------+------------+--------+----------------------+
```

### 6. Test API Endpoints

**Get Free Predictions:**
```bash
curl http://localhost:8080/api/predictions/free | jq '.data[] | {homeTeam, awayTeam, predictionType, predictionValue, confidence, isVip}'
```

Expected:
```json
{
  "homeTeam": "Liverpool",
  "awayTeam": "Man City",
  "predictionType": "OVER_UNDER",
  "predictionValue": "Over 2.5 Goals",
  "confidence": 87,
  "isVip": false
}
```

**Get VIP Predictions:**
```bash
curl http://localhost:8080/api/predictions/vip | jq '.data[] | {homeTeam, awayTeam, confidence, isVip}'
```

Expected (only predictions with confidence >= 90):
```json
{
  "homeTeam": "Arsenal",
  "awayTeam": "Chelsea",
  "confidence": 92,
  "isVip": true
}
```

## Troubleshooting

### Issue: "No fixtures synced"

**Check 1: API Token**
```bash
# Test Sportmonks API directly
curl "https://api.sportmonks.com/v3/football/fixtures/date/$(date +%Y-%m-%d)?api_token=$SPORTMONKS_API_TOKEN&include=participants;league;predictions"
```

If you get `401 Unauthorized`, your token is invalid.

**Check 2: Date Format**
Sportmonks might not have fixtures for today. Try tomorrow:
```bash
curl -X POST http://localhost:8080/api/admin/sync/tomorrow
```

**Check 3: Subscription Plan**
Free tier might not include predictions. Check your Sportmonks dashboard.

### Issue: "All predictions are generated, not from Sportmonks"

**Reason:** Sportmonks might not provide predictions for all fixtures.

**Check logs for:**
```
DEBUG - Generated prediction for ... (no Sportmonks data)
```

This is **normal** - not all fixtures have predictions. The system falls back to generated predictions.

### Issue: "Cannot reach Sportmonks API"

**Check network:**
```bash
ping api.sportmonks.com
```

**Check firewall/proxy settings**

### Issue: "Predictions exist but predictionType is null"

**Cause:** Old predictions created before adding predictionType field.

**Solution:** Re-sync:
```bash
# Delete old predictions
mysql -u root smartbet_db -e "DELETE FROM predictions WHERE prediction_type IS NULL;"

# Sync again
curl -X POST http://localhost:8080/api/admin/sync/all
```

## Expected Behavior

### With Sportmonks Predictions Available

1. System fetches fixtures from Sportmonks
2. Extracts prediction data from `fixture.predictions[]`
3. Uses Sportmonks prediction value
4. Assigns confidence 85-95 (high confidence for provider data)
5. Categorizes as FREE or VIP based on confidence

**Log:**
```
DEBUG - Using Sportmonks prediction for Arsenal vs Chelsea: HOME_WIN (type: MATCH_RESULT)
```

### Without Sportmonks Predictions

1. System fetches fixtures from Sportmonks
2. No predictions in fixture data
3. Generates prediction using algorithm
4. Assigns random confidence 65-95
5. Categorizes as FREE or VIP based on confidence

**Log:**
```
DEBUG - Generated prediction for Liverpool vs Man City (no Sportmonks data): Over 2.5 Goals (type: OVER_UNDER)
```

## Success Criteria

✅ Backend starts without errors  
✅ Sportmonks API is called (check logs)  
✅ Fixtures are fetched (count > 0)  
✅ Predictions are created in database  
✅ `provider_fixture_id` starts with "sportmonks_"  
✅ `predictionType` and `predictionValue` are populated  
✅ FREE/VIP categorization works (confidence-based)  
✅ Mobile app can fetch predictions via API  

## Next Steps

1. ✅ Verify Sportmonks integration works
2. ⏳ Monitor scheduled jobs (6 AM & 8 PM)
3. ⏳ Test with real Sportmonks predictions
4. ⏳ Implement result verification
5. ⏳ Add more prediction types based on Sportmonks data
