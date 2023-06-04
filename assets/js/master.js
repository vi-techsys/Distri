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
          document.getElementById(target).innerHTML = r.responseText;
          if(callback!=null)
          {
            callback();
          }
      }
    r.open("GET", url, true);
    r.send();
  }
  let newdata =JSON.parse(localStorage.getItem("newdata"));
  async function submitdata(formid)
  {
    const formel = document.getElementById(formid);
    const inputs = formel.querySelectorAll(".datainput");
    const formdata = new Array();
    inputs.forEach(element => {
      formdata.push({"name":element.name,"value":element.value});
    });
    newdata =JSON.parse(localStorage.getItem("newdata"));
    const freshdata = {'url':host + formel.getAttribute("action"),
                        'data':JSON.stringify(formdata),
                        'uuid':uuidv4()
                      }
              newdata.push(freshdata);
              localStorage.setItem("newdata",JSON.stringify(newdata));
              formel.reset();
              newdata =JSON.parse(localStorage.getItem("newdata"));
              //console.log(newdata);
              alert("Data saved");
              return false;
  }

  function upload(url,formdata,callback)
  {
    // send form data in AJAX request
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.readyState != 4 || xhr.status != 200) {
            console.log(url + " Data submit failed. Try again");
            return;
          };
          callback(JSON.parse(xhr.responseText));
          console.log(url + " Data saved");
      }
    xhr.open('POST', url);
    xhr.setRequestHeader("token",token);
    xhr.send(formdata);
  }
  function removeFromLocal(returnData)
  {
    if(returnData.status==200){
      //updated local storage with key
      const key = returnData.key;
      if(key!=null)
      {
        localStorage.setItem(key, JSON.stringify(returnData.data[key]));
      }
    let objIndex = newdata.findIndex(ob=> ob.uuid === returnData.uuid);
    console.log("found");
    console.log(returnData.uuid)
    console.log(objIndex);
    if(objIndex > -1) {
      newdata.splice(objIndex, 1);
      localStorage.setItem("newdata",JSON.stringify(newdata));
      console.log("after delete");
      console.log(localStorage.getItem("newdata"));
    }
  }
  }
  async function initialiseNew()
{
  console.log(newdata)
  localStorage.setItem("newdata", JSON.stringify(new Array()));
         if(!newdata)
         {
            localStorage.setItem("newdata", JSON.stringify(new Array()));
         }
         else
         {
          if(checkInternet())
          {
            let timerID = setInterval(() => {
              try
              {
              const newData_ = newdata;
              newData_.forEach(data_=>{
                //console.log(data_)
                    let url = data_.url;
                    let fdata = JSON.parse(data_.data);
                    let formdata = new FormData();
                    formdata.append("uuid",data_.uuid);
                    fdata.forEach(inputdata=>{
                        formdata.append(inputdata.name,inputdata.value);
                    });
                  upload(url,formdata,removeFromLocal);
              });
            }
            catch(Exception){
              clearInterval(timerID);
            console.log(Exception);
            }
            }, 60000);
          }
         }
}

function returnData(key)
{
    return JSON.parse(localStorage.getItem(key));
}
  function loadcategories()
  {
        const data =returnData("categories");
        const parent_ = document.getElementById("parent");
        let options ='<option value="">Select parent</option><option value="0">Main</option>';
        data.forEach(el=>{
            options += '<option value = "'+el.category_id+'">' + el.category + '</option>';
        });
        parent_.innerHTML = options;
  }
  
  function loadproducts()
  {
        const data =returnData("products");
        if(data==null) {
          return;
        }
        let  p_names ='';
        data.forEach(function(el){
         p_names += '<option value ="' + el.product_name + '">';
        });
        document.getElementById("products_name").innerHTML = p_names;
  }
  function loadcustomers()
  {
        const data =returnData("customers");
        if(data==null) {
          return;
        }
        let  c_names ='<option value=""></option>';
        data.forEach(function(el){
         c_names += '<option value ="' + el.id + '">'+el.firstname + " " +el.lastname+'</option>';
        });
        document.getElementById("customer_id").innerHTML = c_names;
  }
  function loadtablecategories()
  {
        const data =returnData("categories");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.category+'</td><td>' + el.category + '</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += '<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"';
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"';
             rows +=    'href="#"><i class="ri-delete-bin-line mr-0"></i></a></div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtablecustomers()
  {
        const data =returnData("customers");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.firstname + " " + el.lastname+'</td><td>' + el.email + '</td><td>' + el.phone + "</td><td>"+el.address+"</td>";
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += '<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"';
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"';
             rows +=    'href="#"><i class="ri-delete-bin-line mr-0"></i></a></div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtableproducts()
  {
        const data =returnData("products");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.product_name  + '</td><td>' + el.category+'</td><td>' + el.cost_price + '</td><td>' + el.selling_price + '</td><td>' + el.created_at +'</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += '<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"';
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"';
             rows +=    'href="#"><i class="ri-delete-bin-line mr-0"></i></a></div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtableinventory()
  {
        const data =returnData("inventory");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.product_name  + '</td><td>' + el.description+'</td><td>' + el.SumQ + '</td><td>' + el.selling_price + '</td><td>' + el.quantity_supplied +'</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += '<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"';
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"';
             rows +=    'href="#"><i class="ri-delete-bin-line mr-0"></i></a></div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtablesupplies()
  {
        const data =returnData("supply");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.description  + '</td><td>' + el.amount+'</td><td>' + el.created_at + '</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += '<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"';
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete"';
             rows +=    'href="#"><i class="ri-delete-bin-line mr-0"></i></a></div></td></tr>';
        });
        parent_.innerHTML = rows;
  }
  