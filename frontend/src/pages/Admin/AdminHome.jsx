import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
} from "lucide-react";

export default function AdminHome() {
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const initialComplaints = [
    {
      id: 1,
      citizen: "Arjun",
      issue: "Streetlight not working",
      status: "Pending",
      description: "Streetlight near house no. 23 is not working for 3 days.",
      image: "/mocks/streetlight.jpg",
    },
    {
      id: 2,
      citizen: "Meera",
      issue: "Garbage not collected",
      status: "In Progress",
      description: "Garbage piled up near park gate, attracting stray dogs.",
      image: "/mocks/garbage.jpg",
    },
  ];

  const [complaints, setComplaints] = useState(() =>
    initialComplaints.map((c) => {
      const stored = localStorage.getItem(`complaint-${c.id}`);
      return stored ? JSON.parse(stored) : c;
    })
  );

  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Water Supply Alert",
      description: "No supply tomorrow from 9AM–2PM",
      date: "2025-09-12 10:30",
      priority: "High",
    },
  ]);

  const [feedbacks] = useState([
    { id: 1, citizen: "Rahul", message: "Quick resolution on road issue. Thanks!" },
    { id: 2, citizen: "Sneha", message: "Garbage pickup needs to be more frequent." },
  ]);

  useEffect(() => {
    const onFocus = () => {
      setComplaints((prev) =>
        prev.map((c) => {
          const stored = localStorage.getItem(`complaint-${c.id}`);
          return stored ? JSON.parse(stored) : c;
        })
      );
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/api/announcements/")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data))
      .catch((err) => console.error("Error fetching announcements:", err));
  }, []);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/api/announcements/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAnnouncement),
      });
      if (res.ok) {
        const saved = await res.json();
        setAnnouncements([saved, ...announcements]);
        setNewAnnouncement({ title: "", description: "", priority: "Medium" });
        setSuccessMessage("✅ Announcement added successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        console.error("Failed to save announcement");
      }
    } catch (err) {
      console.error("Error saving announcement:", err);
    }
  };

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const stats = [
    {
      label: "Total Complaints",
      value: complaints.length,
      icon: ClipboardList,
      color: "blue",
    },
    {
      label: "Resolved Issues",
      value: complaints.filter((c) => c.status === "Resolved").length,
      icon: CheckCircle,
      // trend: "+8 this month",
      color: "green",
    },
    {
      label: "Pending Issues",
      value: complaints.filter((c) => c.status !== "Resolved").length,
      icon: Clock,
      // trend: "-2 from last week",
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3f35] via-[#134e42] to-[#1a5a4e] p-8 sm:p-6">
      <h1 className="text-4xl font-extrabold mb-8 text-white tracking-wide flex items-center gap-3">
        <Users className="w-10 h-10 text-yellow-400" />
        Officer Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white/90 rounded-3xl shadow-xl p-8 transition-transform duration-500 hover:scale-105 border border-transparent hover:border-yellow-400`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-gray-700">
                  {stat.label}
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{stat.value}</p>
                {/* {stat.trend && (
                  <p className="text-sm font-medium text-yellow-500 mt-2">{stat.trend}</p>
                )} */}
              </div>
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                  stat.color === "blue"
                    ? "bg-gradient-to-br from-[#0b3f35] to-[#134e42]"
                    : stat.color === "green"
                    ? "bg-gradient-to-br from-[#134e42] to-[#1a5a4e]"
                    : "bg-gradient-to-br from-yellow-400 to-yellow-600"
                }`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Complaints Section */}
      <section className="bg-white/90 rounded-3xl shadow-lg p-8 mb-8 border border-yellow-400">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 tracking-wide">
          Complaints
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="w-full border-collapse text-gray-700 shadow-sm">
            <thead>
              <tr className="bg-yellow-100 text-left text-yellow-900 font-semibold uppercase tracking-wide">
                <th className="py-3 px-4">Citizen</th>
                <th className="py-3 px-4">Issue</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-200 cursor-pointer hover:bg-yellow-50 transition-colors duration-150"
                  onClick={() =>
                    navigate(`/officer/complaints/${c.id}`, { state: { complaint: c } })
                  }
                >
                  <td className="py-3 px-4 font-medium">{c.citizen}</td>
                  <td className="py-3 px-4">{c.issue}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        c.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : c.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : c.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Announcements Section */}
      <section className="bg-white/90 rounded-3xl shadow-lg p-8 mb-8 border border-yellow-400">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 tracking-wide">
          Announcements
        </h2>
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-800 font-semibold shadow">
            {successMessage}
          </div>
        )}
        <form
          onSubmit={handleAnnouncementSubmit}
          className="space-y-5 mb-8 border-b border-yellow-300 pb-6"
        >
          <input
            type="text"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, title: e.target.value })
            }
            className="w-full p-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 placeholder-yellow-600 transition"
            required
          />
          <textarea
            placeholder="Description"
            value={newAnnouncement.description}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, description: e.target.value })
            }
            className="w-full p-3 border border-yellow-300 rounded-lg h-24 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 placeholder-yellow-600 transition"
            required
          />
          <select
            value={newAnnouncement.priority}
            onChange={(e) =>
              setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })
            }
            className="w-full max-w-xs p-3 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-yellow-900 transition"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <button
            type="submit"
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 focus:outline-none focus:ring-4 focus:ring-yellow-500 transition"
          >
            Add Announcement
          </button>
        </form>

        <div className="space-y-6">
          {announcements.map((a) => (
            <div
              key={a.id}
              className="border border-yellow-300 p-6 rounded-xl bg-yellow-50 shadow-sm hover:shadow-md transition"
            >
              <h3 className="font-extrabold text-xl text-yellow-900 mb-1 tracking-wide">
                {a.title}
              </h3>
              <p className="text-yellow-800 mb-3 leading-relaxed">{a.description}</p>
              <div className="flex flex-wrap items-center justify-between text-sm text-yellow-700 font-medium">
                <span>Date: {a.date}</span>
                <span
                  className={`inline-block px-3 py-1 rounded-full font-semibold tracking-wide ${
                    priorityColors[a.priority] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  Priority: {a.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-white/90 rounded-3xl shadow-lg p-8 border border-yellow-400">
        <h2 className="text-2xl font-semibold mb-6 text-yellow-600 tracking-wide">
          Citizen Feedback
        </h2>
        <ul className="space-y-5">
          {feedbacks.map((f) => (
            <li
              key={f.id}
              className="border border-yellow-300 p-5 rounded-xl bg-yellow-50 shadow-inner hover:shadow-md transition"
            >
              <p className="font-semibold text-yellow-900 mb-2">{f.citizen}</p>
              <p className="text-yellow-800">{f.message}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
