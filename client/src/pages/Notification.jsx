// Notification.jsx
"use client";

import "./EditorPage.css"; // Make sure this file is imported!

const Notification = ({
  showNotification,
  notificationMessage,
  notificationType,
}) => {
  if (!showNotification) return null;

  return (
    <div className={`notification ${notificationType}`}>
      {notificationMessage}
    </div>
  );
};

export default Notification;
