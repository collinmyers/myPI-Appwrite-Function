## Important Notes
1. Due to the nature of these edge functions you must add your own hardcoded values used here, as the backend cannot use env packages
2. Where you need to add information to the file you will see **<your-info-here>**
3. This edge function runs on the cron expression of `0 1 * * *` to execute at 9:00PM every night, the backend uses UTC time not local time
4. This edge function needs an API key with the following permissions: 
      Database : database.read, collections.read, attributes.read, indexes.read, documents.read, documents.write