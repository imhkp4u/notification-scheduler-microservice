**Notification Scheduler Microservice**

_A microservice for scheduling and sending email notifications at specific time based on data provided. We can use 3rd party libraries as well (eg: node-cron) for the same task, but we have used built-in method._

We can have mongoDB for storing data, but for assignment perspective we are using a simple json file.

To schedule a notification, make a POST request to the /schedule endpoint with the following JSON data:
{
`  "message": "Your notification message here",`
` "scheduledTime": "YYYY-MM-DDTHH:mm:ss.sssZ"`
}

Before running the application, we may need to configure our email settings and other options.
