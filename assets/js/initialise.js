//iniitialise storage
document.write('<script type="text/javascript" src="assets/js/universal.js"></script>');
async function initiateKeys()
{
    requestdata(host + 'api/users/dbkeys',"GET",updateKeys);
}
function updateKeys(data)
{
    if(data.status==200)
    {
        const data_ = data.data;
        localStorage.setItem("dbkeys", JSON.stringify(data_));
        return;
    }
    alert("Data source not initaited");
}
async function initiateData()
{
    requestdata(host + 'api/users/get_all_data',"POST",updateData);
}

async function getSalesData()
{
    requestdata(host + 'api/users/get_sales_data',"POST",updateData);
    console.log('sales data');
}

function updateData(data)
{
    if(data.status==200)
    {
        const data_ = data.data;
        for(var data in data_)
        {
           localStorage.setItem(data, JSON.stringify(data_[data]));
        }
    }
}

//login
function login(login)
{
    const formel = document.getElementById(login);
    const formdata =new FormData();
    const inputs = formel.querySelectorAll(".datainput");
    inputs.forEach(element => {
      formdata.append(element.name, element.value);
    });
    // send form data in AJAX request
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState != 4 || xhr.status != 200) {
            alert("Login failed. Try again");
            return;
          };
            console.log(this.response);
            const rep = JSON.parse(xhr.responseText);
          if(rep.status==200)
          {
                localStorage.setItem("token",rep.data.token);
                location.href = "dashboard.html";
          }
          else
          {
            localStorage.setItem("token","");
            alert(rep.message);
          }
      }
    xhr.open('POST', host + formel.getAttribute("action"));
    xhr.send(formdata);
  }

  function logout()
  {
    localStorage.removeItem("token");
    location.href = "index.html";
  }
const row = document.getElementById("row");
function navigate(target, url,callback=null) {
    jQuery("#loading").fadeIn();
    var r = new XMLHttpRequest();
    r.ontimeout = function () { alert("Request timeout. Try again"); }
      r.onload = function() {
        jQuery("#loading").delay().fadeOut("");
        if (r.readyState != 4 || r.status != 200) {
            alert("Request failed. Try again");
            return;
          };
      }
    r.open("GET", url, true);
    r.onreadystatechange = function () {
      document.getElementById(target).innerHTML = r.responseText;
      callback;
    };
    r.send();
  }
