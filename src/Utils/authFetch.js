const authFetch = async (url, options = {}) => {

const token = localStorage.getItem("token");

console.log("TOKEN:", token);

const headers = {
...(options.headers || {})
};

if (token) {
headers.Authorization = `Bearer ${token}`;
}

if (!(options.body instanceof FormData)) {
headers["Content-Type"] = "application/json";
}

const response = await fetch(url, {
...options,
headers
});

if (response.status === 401) {

```
localStorage.removeItem("token");
localStorage.removeItem("userId");
localStorage.removeItem("name");
localStorage.removeItem("role");

window.location.href = "/login";
```

}

return response;
};

export default authFetch;
