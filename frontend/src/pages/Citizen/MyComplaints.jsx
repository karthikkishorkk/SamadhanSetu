import { useEffect, useState } from "react";
import { api, getAccessToken } from "../Auth/auth.js";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { ClipboardList, CheckCircle, Clock, AlertTriangle, Loader2 } from "lucide-react";

export default function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      api
        .get(`/complaints?userId=${decoded.id}`)
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : res.data?.complaints || [];
          setComplaints(data);
        })
        .catch((err) => {
          console.error("Error fetching complaints:", err);
          setError("Failed to load complaints. Please try again later.");
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Invalid token:", err);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b3f35] via-[#134e42] to-[#1a5a4e] p-8 sm:p-6 relative overflow-hidden">
      {/* Floating blurred circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-400 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-24 h-24 bg-green-500 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-teal-400 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-green-300 rounded-full blur-2xl animate-pulse delay-3000"></div>
      </div>

      {/* Container */}
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-green-300/30 overflow-hidden relative z-10">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0b3f35] to-[#134e42] p-6 text-green-400 font-bold text-2xl flex items-center gap-3 rounded-t-3xl">
          <ClipboardList className="w-6 h-6" />
          My Complaints
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16 text-green-700">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-3 text-lg">Loading complaints...</span>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
        ) : (
          <>
            {/* Complaints Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-[#0b3f35] border-separate border-spacing-y-3">
                <thead>
                  <tr className="bg-green-100 rounded-t-2xl">
                    <th className="text-left px-6 py-4 rounded-l-2xl font-semibold uppercase tracking-wide text-sm">
                      Issue Description
                    </th>
                    <th className="text-center px-6 py-4 font-semibold uppercase tracking-wide text-sm">
                      Status
                    </th>
                    <th className="text-center px-6 py-4 font-semibold uppercase tracking-wide text-sm">
                      Date Submitted
                    </th>
                    <th className="text-center px-6 py-4 rounded-r-2xl font-semibold uppercase tracking-wide text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.length > 0 ? (
                    complaints.map((complaint, idx) => (
                      <tr
                        key={complaint.id || idx}
                        className={`cursor-pointer shadow-sm rounded-xl ${
                          idx % 2 === 0 ? "bg-green-50" : "bg-white"
                        } hover:bg-green-100 transition-colors`}
                      >
                        <td className="px-6 py-5 max-w-xs truncate" title={complaint.issue}>
                          <p className="font-semibold">{complaint.issue}</p>
                          <p className="text-xs text-green-700 mt-1">
                            ID: #{complaint.id?.toString().padStart(4, "0")}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              complaint.status === "Resolved"
                                ? "bg-green-100 text-green-700"
                                : complaint.status === "In Progress"
                                ? "bg-teal-100 text-teal-700"
                                : "bg-red-100 text-red-700"
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
                        <td className="px-6 py-5 text-center text-sm text-green-800 font-medium">
                          {complaint.date ? new Date(complaint.date).toLocaleDateString() : "-"}
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button
                            onClick={() => navigate(`/complaints/${complaint.id}`)}
                            className="text-teal-600 hover:text-teal-800 font-semibold text-sm underline"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center text-green-700 italic">
                        No complaints reported yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-green-50 border-t border-green-200/50 text-right text-green-800 font-semibold">
              Total Complaints: {complaints.length}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
