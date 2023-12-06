// script.js
const form = document.getElementById("form");
const btnCheckServer = document.getElementById("checkServer");
const connectWebsocketbtn = document.getElementById("connectWebsocket");

form.addEventListener("submit", submitForm);
btnCheckServer.addEventListener("click", checkServer);
connectWebsocketbtn.addEventListener("click", connectWebsocket);

// const domain = "localhost";
const domain = "167.99.140.168";
const url = `http://${domain}:3000`;

function checkServer(e) {
  e.preventDefault();
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

function submitForm(e) {
  e.preventDefault();

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

function connectWebsocket(e) {
  e.preventDefault();

  const webSocket = new WebSocket(`ws://${domain}:8080`);

  webSocket.onopen = () => {
    webSocket.send("Client connected and send message.");
  };

  try {
    webSocket.onmessage = (message) => {
      const incomingMessage = message.data;
      if ($("#websocketResponse").hasClass("border-danger")) {
        $("#websocketResponse").addClass("border-info");
        $("#websocketResponse").removeClass("border-danger");
      }

      $("#websocketResponse").append(`
            <li class="list-group-item fs-5">${incomingMessage}</li>
      `);

      if (incomingMessage.toLowerCase().includes("error")) {
        $("#websocketResponse").removeClass("border-info");
        $("#websocketResponse").addClass("border-danger");
      }

      console.log("Gelen websocket mesajı", incomingMessage);
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
