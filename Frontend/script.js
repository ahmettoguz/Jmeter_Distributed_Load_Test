// script.js

const domain = "127.0.0.1";
// const domain = "ahmetproje.com.tr";
// const domain = "167.99.140.168";
const url = `http://${domain}:80`;

const btnCheckServer = document.getElementById("checkServer");
btnCheckServer.addEventListener("click", checkServer);
function checkServer(e) {
  e.preventDefault();
  console.log("check server");

  $.ajax({
    url: url,
    type: "GET",
    contentType: false,
    processData: false,
    followRedirects: true,
    cache: false,
    dataType: "json",
    success: function (response) {
      console.log(response);
      const out = JSON.stringify(response, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-danger");
      $("#httpResponse").addClass("border-success");
    },
    error: function (response) {
      console.log(response);
      const out = JSON.stringify(response, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-success");
      $("#httpResponse").addClass("border-danger");
    },
  });
}

const runTestForm = document.getElementById("runTestForm");
runTestForm.addEventListener("submit", runTestSubmitForm);
function runTestSubmitForm(e) {
  e.preventDefault();
  console.log("runtest");

  let file = $("#file")[0].files[0];
  let cloudProvider = $("#cloudProvider").val();
  let virtualUser = $("#virtualUser").val();
  var ajaxData = new FormData();

  ajaxData.append("virtualUser", virtualUser);
  ajaxData.append("cloudProvider", cloudProvider);
  ajaxData.append("jmxFile", file);

  $.ajax({
    url: `${url}/api/runTest`,
    type: "POST",
    contentType: false,
    processData: false,
    cache: false,

    followRedirects: true,
    dataType: "json",
    enctype: "multipart/form-data",
    data: ajaxData,
    success: function (response) {
      console.log(response);
      const out = JSON.stringify(response, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-danger");
      $("#httpResponse").addClass("border-success");
    },
    error: function (response) {
      console.log(response);
      const out = JSON.stringify(response.responseJSON, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-success");
      $("#httpResponse").addClass("border-danger");
    },
  });
}

const connectWebsocketbtn = document.getElementById("connectWebsocket");
connectWebsocketbtn.addEventListener("click", connectWebsocket);
function connectWebsocket(e) {
  e.preventDefault();
  console.log("websocket");

  const webSocket = new WebSocket(`ws://${domain}:8080`);

  webSocket.onopen = () => {
    webSocket.send("Client connected and send message.");
  };

  try {
    webSocket.onmessage = (message) => {
      const incomingMessage = JSON.parse(message.data);
      if ($("#websocketResponse").hasClass("border-danger")) {
        $("#websocketResponse").addClass("border-info");
        $("#websocketResponse").removeClass("border-danger");
      }

      $("#websocketResponse").append(`
            <li class="list-group-item fs-5">${incomingMessage.socketMessage}</li>
      `);

      if (incomingMessage.socketMessage.toLowerCase().includes("error")) {
        $("#websocketResponse").removeClass("border-info");
        $("#websocketResponse").addClass("border-danger");
      }

      console.log(
        "Incoming websocket message: ",
        incomingMessage.socketMessage
      );
    };
    webSocket.onclose = () => {
      $("#websocketResponse").append(
        `<li class="list-group-item fs-5">Websocket connection not found!</li>`
      );
      $("#websocketResponse").removeClass("border-info");
      $("#websocketResponse").addClass("border-danger");

      console.log("Websocket is closed.");
      webSocket.close();
    };
    webSocket.onerror = (error) => {
      console.log("Websocket is errored.", error);
      webSocket.close();
    };
  } catch (err) {
    console.error("Error: record Websocket Notifications \n", err);
  }
}

const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", signUpSubmitForm);
function signUpSubmitForm(e) {
  e.preventDefault();
  console.log("signup");

  let singUpuserName = $("#singUpuserName").val();
  let singUpfirstName = $("#singUpfirstName").val();
  let singUplastName = $("#singUplastName").val();
  let singUpphone = $("#singUpphone").val();
  let singUpemail = $("#singUpemail").val();
  let singUppassword = $("#singUppassword").val();

  const ajaxData = {
    userName: singUpuserName,
    firstName: singUpfirstName,
    lastName: singUplastName,
    phone: singUpphone,
    email: singUpemail,
    password: singUppassword,
  };

  $.ajax({
    url: `${url}/api/signUp`,
    type: "POST",
    data: JSON.stringify(ajaxData),
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      const out = JSON.stringify(response, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-danger");
      $("#httpResponse").addClass("border-success");
    },
    error: function (response) {
      console.log(response);
      const out = JSON.stringify(response.responseJSON, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-success");
      $("#httpResponse").addClass("border-danger");
    },
  });
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", loginFormSubmit);
function loginFormSubmit(e) {
  e.preventDefault();
  console.log("login");

  const ajaxData = {
    userName: $("#loginuserName").val(),
    password: $("#loginpassword").val(),
  };

  $.ajax({
    url: `${url}/api/login`,
    type: "POST",
    xhrFields: {
      withCredentials: true,
    },
    data: JSON.stringify(ajaxData),
    contentType: "application/json",
    success: function (response) {
      console.log(response);
      const out = JSON.stringify(response, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-danger");
      $("#httpResponse").addClass("border-success");
    },
    error: function (response) {
      console.log(response);
      const out = JSON.stringify(response.responseJSON, null, 3);
      $("#httpResponse").html(
        "<pre class='p-2 m-0 fs-5 border'>" + out + "</pre>"
      );

      $("#httpResponse").removeClass("border-success");
      $("#httpResponse").addClass("border-danger");
    },
  });
}
