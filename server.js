const app = require("./app.js");

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Server is listening on port " + port);
});


// Function to handle graceful shutdown
const gracefulShutdown = () => {
  console.log("Gracefully shutting down...");

  // Close the database connection
  closeConnection().then(() => {
    console.log("Database connection closed.");

    // Close the server
    server.close(() => {
      console.log("Server shut down gracefully.");
      process.exit(0);
    });
  });
};

// Handle termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  gracefulShutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  gracefulShutdown();
});
