const host = 'http://localhost/distriAPI/';
const token = localStorage.getItem("token");
function requestdata(url,method,callback) {
    var r = new XMLHttpRequest();
      r.onload = function() {
        if (r.readyState != 4 || r.status != 200) {
            alert("Request failed. Try again");
            localStorage.setItem("token","");
            location.href = "index.html";
            return;
          };
          //console.log(JSON.parse(r.responseText));
          callback(JSON.parse(r.responseText));
      }
    r.open(method, url, true);
    /*r.onreadystatechange = function () {
      console.log(r.responseText)
    };*/
    r.setRequestHeader("token",token);
    r.send();
  }


  function submitdata(dataAr,url)
  {
    const formdata =new FormData();
    console.log(dataAr);
    dataAr.forEach(element => {
      formdata.append(element[0], element[1]);
    });
    // send form data in AJAX request
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState != 4 || xhr.status != 200) {
            alert("Data submit failed. Try again");
            return;
          };
          formel.reset();
          alert("Data saved");
      }
    xhr.open('POST', host + formel.getAttribute("action"));
    xhr.setRequestHeader("token",token);
    xhr.send(formdata);
  }
    function checkInternet()
    {
        return navigator.onLine;
    }

    function uuidv4() {
      return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    }