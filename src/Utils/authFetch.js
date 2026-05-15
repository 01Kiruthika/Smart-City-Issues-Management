const authFetch = async (
  url,
  options = {}
) => {

  const token =
    localStorage.getItem("token");



  const headers = {

    ...(options.headers || {}),

  };



  // ADD TOKEN
  if (token) {

    headers["Authorization"] =
      `Bearer ${token}`;
  }



  // ONLY FOR JSON REQUEST
  if (
    !(options.body instanceof FormData)
  ) {

    headers["Content-Type"] =
      "application/json";
  }



  const response =
    await fetch(url, {

      ...options,

      headers,
    });



  // TOKEN EXPIRED
  if (response.status === 401) {

    console.log(
      "Token expired or invalid"
    );

    localStorage.removeItem(
      "token"
    );

    window.location.href = "/login";
  }



  return response;
};

export default authFetch;