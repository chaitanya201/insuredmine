# Node.js Insurance Policy Uploader and API Service

This Node.js application allows you to upload insurance policy data from Excel or CSV files and store it into MongoDB using worker threads. It includes APIs to search policies by username, aggregate policies per user, monitor real-time CPU usage, and schedule message insertions. The app is managed using PM2 for production reliability.

Step 1: Clone the repository to your machine using `git clone https://github.com/chaitanya201/insuredmine.git` and navigate into the project folder using `cd insuredmine`.

Step 2: Run `npm install` to install all the necessary dependencies.

Step 3: Make sure MongoDB is running locally on `mongodb://localhost:27017/insuredmine`. No .env setup is required.

Step 4: To start the application using PM2, run `npm run dev`. This will start the server and register the app as `my-app` under PM2.

Step 5: To monitor the running app, use `npm run status`. To restart the app if needed, use `npm run restart`. To stop it, use `npm run stop`. To remove the app from PM2 entirely, use `npm run delete`. You can also view live logs using `npm run logs`.

Step 6: To upload policy data, send a POST request to `localhost:3000/api/v1/policy/upload` with a form-data body containing a `policyFile` field. The file should be a `.xlsx` or `.csv` file containing policy records.

Step 7: To search policies by user’s first name, send a GET request to `localhost:3000/api/v1/policy/info/:username`. For example, `localhost:3000/api/v1/policy/info/Bunny` will return all policy info related to that user.

Step 8: To get policy aggregation per user, send a GET request to `localhost:3000/api/v1/policy/aggregate/users`. This will return grouped results by each user with their policy details.

Step 9: To enable automatic server restart based on CPU load, start the monitor script using `npm run dev`. This script checks CPU usage and restarts `my-app` if usage exceeds 70%.

Step 10: To schedule a message insertion into the database, send a POST request to `localhost:3000/api/v1/message/save` with a JSON body like:
{
"message": "Policy renewal reminder",
"day": "2025-07-08",
"time": "15:30"
}
This message will be stored in the database and will be inserted at the specified time.

Step 11: Once the app has started it will keep checking every minute and insert messages when their time is due.

This project was built and is maintained by Chaitanya Sawant. You can reach me via LinkedIn at https://www.linkedin.com/in/im-chaitanya-sawant or check out my work at https://github.com/chaitanya201.
