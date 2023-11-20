// script.js
const form = document.getElementById("form");

form.addEventListener("submit", submitForm);

function submitForm(e) {
  e.preventDefault();

  let file = $("#file")[0].files[0];
  let cloudProvider = $("#cloudProvider").val();
  var ajaxData = new FormData();

  ajaxData.append("virtualUser", 200);
  ajaxData.append("cloudProvider", cloudProvider);
  ajaxData.append("jmxFile", file);

  $.ajax({
    // url: "http://localhost/runTest",
    url: "http://142.93.164.127/runTest",
    type: "POST",
    contentType: false,
    processData: false,
    cache: false,
    dataType: "json",
    enctype: "multipart/form-data",
    data: ajaxData,
    success: function (data) {
      console.log(data);
    },
  });
}
