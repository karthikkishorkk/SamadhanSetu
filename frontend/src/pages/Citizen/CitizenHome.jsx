import { useEffect, useState } from "react";
import { api, getAccessToken } from "../Auth/auth.js";
import {
  Volume2,
  FileText,
  PlusCircle,
  ClipboardList,
  Bell,
  Calendar,
  TrendingUp,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function CitizenHome() {
  const [announcements, setAnnouncements] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  // ✅ Load user from JWT
  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("🔑 Decoded JWT:", decoded);
        setUser(decoded);

        // Optional: check expiry
        if (decoded.exp * 1000 < Date.now()) {
          console.error("⚠️ Token expired → redirecting to login");
          navigate("/login");
        }
      } catch (err) {
        console.error("Invalid token:", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ Fetch announcements with token
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.error("No token found");
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:8000/api/announcements/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          console.error("Unauthorized → redirecting to login");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch announcements: ${res.status}`);
        }

        const data = await res.json();
        console.log("📢 Announcements:", data);
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };

    fetchAnnouncements();
  }, [navigate]);

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "border-l-[#d97706] bg-gradient-to-r from-[#d97706]/10 to-[#f59e0b]/5";
      case "medium":
        return "border-l-[#f59e0b] bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/5";
      case "low":
        return "border-l-[#134e42] bg-gradient-to-r from-[#134e42]/10 to-[#0b3f35]/5";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3f35] via-[#134e42] to-[#1a5a4e] relative overflow-hidden">
      
      {/* Floating Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-orange-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-teal-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-orange-300 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0b3f35] to-[#134e42] shadow-2xl border-b border-orange-300/20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <span className="bg-gradient-to-r from-orange-200 to-orange-100 bg-clip-text text-transparent">
                  Welcome Back, {user?.full_name || user?.username || "Citizen"}
                </span>
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 hover:shadow-orange-200/20 hover:shadow-2xl transition-all duration-500 border border-orange-200/20 hover:scale-105"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#0b3f35] text-sm font-semibold uppercase tracking-wide">{stat.label}</p>
                  <p className="text-4xl font-bold text-[#134e42] mt-3">
                    {stat.value}
                  </p>
                  {/* {stat.trend && (
                    <p className="text-[#f59e0b] text-sm font-medium mt-2">{stat.trend}</p>
                  )} */}
                </div>
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                    stat.color === "blue"
                      ? "bg-gradient-to-br from-[#0b3f35] to-[#134e42]"
                      : stat.color === "green"
                      ? "bg-gradient-to-br from-[#134e42] to-[#1a5a4e]"
                      : "bg-gradient-to-br from-[#f59e0b] to-[#d97706]"
                  }`}
                >
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Announcements */}
          <div className="lg:col-span-2">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/20 overflow-hidden">
              <div className="bg-gradient-to-r from-[#0b3f35] via-[#134e42] to-[#f59e0b] p-5 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    Latest Announcements
                  </h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                {announcements.length > 0 ? (
                  announcements.map((announcement, idx) => (
                    <div
                      key={idx}
                      className={`p-4 border-l-4 rounded-lg hover:shadow-md transition-all duration-300 cursor-pointer backdrop-blur-sm ${getPriorityColor(
                        announcement.priority
                      )}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-[#0b3f35] mb-2 text-base">
                            {announcement.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-[#134e42]">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(announcement.date).toLocaleDateString()}
                            </span>
                            <span className="px-2 py-1 bg-[#0b3f35]/10 rounded-full text-xs font-semibold text-[#0b3f35]">
                              {announcement.category}
                            </span>
                          </div>
                        </div>
                        <div
                          className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                            announcement.priority === "high"
                              ? "bg-gradient-to-r from-[#d97706] to-[#92400e] text-white"
                              : announcement.priority === "medium"
                              ? "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white"
                              : "bg-gradient-to-r from-[#134e42] to-[#0b3f35] text-white"
                          }`}
                        >
                          {announcement.priority}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Bell className="w-12 h-12 text-[#134e42]/30 mx-auto mb-3" />
                    <p className="text-[#0b3f35] text-base">No announcements at this time</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions + Status */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-200/20">
              <h3 className="text-lg font-bold text-[#0b3f35] mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg"></div>
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate("/report")}
                  className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-lg hover:shadow-orange-400/30 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <PlusCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Report New Issue</span>
                </button>
                <button 
                  onClick={() => navigate("/mycomplaints")}
                  className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#0b3f35] to-[#134e42] text-white shadow-lg hover:shadow-teal-400/20 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">My Complaints</span>
                </button>
                <button 
                  onClick={() => navigate("/feedback")}
                  className="w-full group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[#134e42] to-[#1a5a4e] text-white shadow-lg hover:shadow-teal-400/20 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center group-hover:bg-white/30 transition-colors">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">Submit Feedback</span>
                </button>
              </div>
            </div>

            {/* Status Summary */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-orange-200/20">
              <h3 className="text-lg font-bold text-[#0b3f35] mb-4 flex items-center gap-2">
                <div className="w-5 h-5 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg"></div>
                Issue Status
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#134e42]/10 to-[#0b3f35]/5 rounded-xl border border-[#134e42]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#134e42] to-[#0b3f35] rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-[#0b3f35]">
                      Resolved
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#0b3f35]">
                    {complaints.filter((c) => c.status === "Resolved").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-gray-700">
                      In Progress
                    </span>
                  </div>
                  <span className="text-xl font-bold text-gray-700">
                    {complaints.filter((c) => c.status === "In Progress").length}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#f59e0b]/10 to-[#d97706]/5 rounded-xl border border-[#f59e0b]/20">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-base font-semibold text-[#d97706]">
                      Pending
                    </span>
                  </div>
                  <span className="text-xl font-bold text-[#d97706]">
                    {complaints.filter((c) => c.status === "Pending").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="mt-12 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-orange-200/20 overflow-hidden">
          <div className="bg-gradient-to-r from-[#0b3f35] via-[#134e42] to-[#f59e0b] p-8 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <ClipboardList className="w-5 h-5" />
                </div>
                Recent Complaints
              </h2>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
                  <Search className="w-4 h-4" />
                  Search
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-xl text-sm font-semibold hover:bg-white/30 transition-colors">
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#0b3f35]/10 to-[#f59e0b]/10">
                <tr>
                  <th className="px-8 py-6 text-left text-sm font-bold text-[#0b3f35] uppercase tracking-wide">
                    Issue Description
                  </th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-[#0b3f35] uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-[#0b3f35] uppercase tracking-wide">
                    Date Submitted
                  </th>
                  <th className="px-8 py-6 text-center text-sm font-bold text-[#0b3f35] uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {complaints.length > 0 ? (
                  complaints.map((complaint, idx) => (
                    <tr key={idx} className="hover:bg-gradient-to-r hover:from-[#0b3f35]/5 hover:to-[#f59e0b]/5 transition-all duration-200">
                      <td className="px-8 py-6">
                        <p className="text-sm font-semibold text-[#0b3f35]">
                          {complaint.issue}
                        </p>
                        <p className="text-xs text-[#134e42] mt-1 font-medium">
                          ID: #{complaint.id?.toString().padStart(4, "0")}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span
                          className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide ${
                            complaint.status === "Resolved"
                              ? "bg-gradient-to-r from-[#134e42] to-[#0b3f35] text-white"
                              : complaint.status === "In Progress"
                              ? "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                              : "bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white"
                          }`}
                        >
                          {complaint.status === "Resolved" && (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          )}
                          {complaint.status === "In Progress" && (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          {complaint.status === "Pending" && (
                            <AlertTriangle className="w-3 h-3 mr-1" />
                          )}
                          {complaint.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center text-sm text-[#134e42] font-medium">
                        {complaint.date
                          ? new Date(complaint.date).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <button className="text-[#f59e0b] hover:text-[#d97706] text-sm font-bold hover:underline transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <ClipboardList className="w-16 h-16 text-[#134e42]/30 mx-auto mb-4" />
                      <p className="text-[#0b3f35] text-lg font-medium">No complaints found</p>
                      <p className="text-[#134e42] text-sm mt-2">Submit your first complaint to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="px-8 py-6 bg-gradient-to-r from-[#0b3f35]/5 to-[#f59e0b]/5 border-t border-orange-200/30">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#134e42] font-medium">
                Showing {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
              </p>
              <button 
                onClick={() => navigate("/mycomplaints")}
                className="text-[#f59e0b] hover:text-[#d97706] text-sm font-bold hover:underline transition-colors"
              >
                View All Complaints →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}