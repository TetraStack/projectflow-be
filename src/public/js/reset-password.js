const notificationElement = document.getElementById("notification");
const submitBtn = document.getElementById("submit");
const formDiv = document.getElementById("form");
const verificationMessage = document.getElementById("verificationMessage");

const params = new Proxy(new URLSearchParams(window.location.search), {
  get(searchParams, prop) {
    return searchParams.get(prop);
  },
});

submitBtn.addEventListener("click", async function () {
  const password = document.getElementById("password").value.toString().trim();
  const confirmPassword = document
    .getElementById("confirm-password")
    .value.toString()
    .trim();

  if (!password) {
    displatNotification(notificationElement, "Please Enter New password");
    return;
  }

  if (!confirmPassword) {
    displatNotification(notificationElement, "Please Enter confirm password");
    return;
  }

  if (password !== confirmPassword) {
    displatNotification(notificationElement, "Password  do not match");
    return;
  }

  submitBtn.classList.add("disable");
  submitBtn.textContent = "Please wait";

  const res = await fetch("/api/v1/user/reset-password", {
    method: "POST",
    body: JSON.stringify({ password, id: params.id, token: params.token }),
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });

  const { message } = await res.json();
  if (!res.ok) {
    if (message) {
      displatNotification(notificationElement, message);
      submitBtn.classList.remove("disable");
      submitBtn.textContent = "Update password";
      return;
    }
  }

  displatNotification(notificationElement, message, "success");
});

function displatNotification(target, message, type = null) {
  target.classList.add("flex");
  target.classList.remove("hidden");
  type === "success"
    ? target.classList.add("text-green-500")
    : target.classList.add("text-red-500");

  target.textContent = message;
}
