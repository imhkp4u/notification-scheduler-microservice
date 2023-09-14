const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create an empty array to store notifications (in-memory storage)
let notifications = [];

// function to load notifications from JSON file
const loadNotifications = () => {
  try {
    const data = fs.readFileSync("notifications.json", "utf8");
    notifications = JSON.parse(data);
  } catch (err) {
    console.error("Error loading notifications:", err);
  }
};

// Load initial notifications from the JSON file
loadNotifications();

const sendEmailNotification = (message) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "imhkp4u@gmail.com",
      pass: "<googleAppPassword>", //need to use 'Google app password' not your gmail password
    },
  });

  const mailOptions = {
    from: "imhkp4u@gmail.com",
    to: "hemantprasad99.hp@gmail.com",
    subject: "Notification",
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email notification sent:", info.response);
    }
  });
};

const sendPendingNotifications = () => {
  const currentTime = new Date();

  notifications.forEach((notification) => {
    const scheduledTime = new Date(notification.scheduledTime);

    const currentTimeUTC = new Date(currentTime.toISOString());
    const scheduledTimeUTC = new Date(scheduledTime.toISOString());

    if (scheduledTimeUTC <= currentTimeUTC && !notification.sent) {
      console.log(`Sending notification: ${notification.message}`);
      sendEmailNotification(notification.message);

      // Mark the notification as sent to avoid resending it
      notification.sent = true;
    }
  });
};

setInterval(sendPendingNotifications, 60000); // we can modify frequency as per our need

// API endpoint to schedule a notification
app.post("/schedule", (req, res) => {
  try {
    const { message, scheduledTime } = req.body;
    const notification = { message, scheduledTime };

    // Add the new notification to the in-memory array
    notifications.push(notification);

    // Save the updated notifications array to the JSON file
    fs.writeFileSync("notifications.json", JSON.stringify(notifications));

    res.status(201).json(notification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
