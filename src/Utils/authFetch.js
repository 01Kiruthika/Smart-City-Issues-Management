const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // HANDLE TOKEN EXPIRY PROPERLY
  if (response.status === 401) {
    console.log("Token expired or invalid");

    localStorage.removeItem("token");

    window.location.href = "/login"; // force logout only here
  }

  return response;
};

export default authFetch;