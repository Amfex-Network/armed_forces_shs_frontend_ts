import { FaClock } from "react-icons/fa";

export const notifications = [
  {
    type: "alert",
    iconBg: "bg-red-100 border-l-4 border-red-500",
    title: "System Maintenance Scheduled",
    desc: "Scheduled for Saturday, 2:00 AM - 4:00 AM",
    action: { label: "Dismiss", style: "border border-gray-400 text-gray-700" },
  },
  {
    type: "info",
    iconBg: "bg-blue-50 border-l-4 border-blue-500",
    title: "New Feature Available",
    desc: "Bulk SMS messaging now supports attachments",
    action: {
      label: "Learn More",
      style: "border border-gray-400 text-gray-700",
    },
  },
  {
    type: "clock",
    icon: FaClock,
    iconBg: "bg-yellow-50 border-l-4 border-yellow-500",
    title: "License Renewal Required",
    desc: "System license expires in 15 days",
    action: {
      label: "Renew Now",
      style: "border border-gray-400 text-gray-700",
    },
  },
];
