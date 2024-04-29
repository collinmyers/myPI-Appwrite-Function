## Important Notes
1. Due to the nature of these edge functions you must add your own hardcoded values used here, as the backend cannot use env packages
2. Where you need to add information to the file you will see **<your-info-here>**
3. Unlike the other edge function here, this one is using the normal Appwrite SDK, as when this edge functio was created some features were not yet available in the serverside node sdk. In src there is an appwrite config that will need cofigured with your information on top of what was placed in main.js. In appwrite.json there will be a project id and name that need configured, this will be the project id and name in the appwrite console.
4. The execution permission that should be added to this edge function is "ManageNotifications"