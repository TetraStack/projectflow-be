const messageElement = document.getElementById("message");
load();
async function load() {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get(searchParams, prop) {
      return searchParams.get(prop);
    },
  });

  const res = await fetch("/api/v1/user/verify", {
    method: "POST",
    body: JSON.stringify({ token: params.token, id: params.id }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  if (!res.ok) {
    const { message } = await res.json();
    if (message) {
      messageElement.textContent = message;
      messageElement.classList.toggle("text-red-500");
      return;
    }
  }

  const { message } = await res.json();
  messageElement.textContent = message;
}
