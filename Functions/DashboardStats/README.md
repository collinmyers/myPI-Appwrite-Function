## Important Notes
1. Due to the nature of these edge functions you must add your own hardcoded values used here, as the backend cannot use env packages
2. Where you need to add information to the file you will see **<your-info-here>**
3. There is one pre-condition to this, the admin must create a collection for Dashboard Stats and create attributes with TotalUsers, RegisteredUsers, TotalEvents, TotalPoints, and TotalNotifications. All of these must be of type Integer. You need to create a Document with initial values of 0 for all categories
4. This edge function will use a cron expression to periodically check the tables for updates. We used every 3 hours, which can be represented by `0 */3 * * *`
5. This edge function needs an API key with the following permissions: 
      Auth: users.read
      Database : database.read, collections.read, attributes.read, indexes.read, documents.read, documents.write