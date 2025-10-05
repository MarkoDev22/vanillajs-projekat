const API_URL = "http://localhost:3333/api";

const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const response = await fetch(`${API_URL}/${endpoint}`, {
      ...options,
      headers,
      credentials: "include", // If using cookies
    });

    // Handle unauthorized (401) responses
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
      return;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    // Handle empty responses (like 204 No Content)
    const contentLength = response.headers.get("content-length");
    if (contentLength === "0" || response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`API request failed: ${error.message}`);
    throw error;
  }
};
