async function editdata(formel)
{
  if(!checkInternet)
  {
    alert("This operation requires internet connection");
    return;
  }
  const formdata =new FormData();
  const inputAr = formel.querySelectorAll(".datainput");
  const editID = formel.querySelector(".edit_id").value;
  inputAr.forEach(element => {
    formdata.append(element.name, element.value);
  });
  // send form data in AJAX request
  const xhr = new XMLHttpRequest();
  xhr.onload = function() {
      if (xhr.readyState != 4 || xhr.status != 200) {
          alert("Data submit failed. Try again");
          return;
        };
        const returnData =JSON.parse(xhr.responseText);
         //updated local storage with key
      const key = returnData.key;
      if(key!=null)
      {
        localStorage.setItem(key, JSON.stringify(returnData.data[key]));
      }
        alert("Data updated");
    }
  xhr.open('POST', host + formel.getAttribute("action")+ "/"+editID);
  xhr.setRequestHeader("token",token);
  xhr.send(formdata);
}
  function checkInternet()
  {
      return navigator.onLine;
  }
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

  function navigateEdit(target, url,callback=null,id) {
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
            callback(id);
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
  var timerID=0;
  var timerStart =false;
  //console.log(newdata)
  //localStorage.setItem("newdata", JSON.stringify(new Array()));
         if(!newdata)
         {
            localStorage.setItem("newdata", JSON.stringify(new Array()));
         }
         else
         {
          if(checkInternet() && timerStart===false)
          {
            timerID = setInterval(() => {
              try
              {
                timerStart =true;
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
              timerStart =false;
            console.log(Exception);
            }
            }, 30000);
          }
         }
}
let neworders =JSON.parse(localStorage.getItem("neworders"));
async function initialiseNewOrder(callback)
  {
    let orderUrl ='api/IV_supply/addneworder';
  var timerID1=0;
  var timerStart1 =false;
  //localStorage.setItem("newdata", JSON.stringify(new Array()));
         if(!neworders)
         {
            localStorage.setItem("neworders", JSON.stringify(new Array()));
         }
         else
         {
          if(checkInternet() && timerStart1===false)
          {
            timerID1 = setInterval(() => {
              try
              {
                neworders =JSON.parse(localStorage.getItem("neworders"));
                console.log('upload new order')
                timerStart1 =true;
              const newOrder_ = neworders;
              newOrder_.forEach(data_=>{
                $.ajax({
                  type: 'POST',
                  url: host + orderUrl,
                  headers: {"TOKEN" : token},
                  data: data_.body,
                  dataType: 'json',
                  success: function(data) {
                    if (data != '' && data.status==200) {
                      console.log("found");
                    neworders = neworders.filter((order)=>{
                      order.uuid != data.uuid;
                    });
                    localStorage.setItem("neworders",JSON.stringify(neworders));
                    console.log("after order delete");
                    console.log(localStorage.getItem("neworders"));
                    console.log('orders uploaded');
                    } else {
                      console.log(data)
                    }
                  },
                  error: function(error) {
                    console.log(error);
                  }
                });    
              });
            }
            catch(Exception){
              clearInterval(timerID1);
              timerStart1 =false;
            console.log(Exception);
            }
            finally{
              callback();
            }
            }, 30000);
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
  function loadaccountedit(id)
  {
        const data =returnData("account");
        const cdata =returnData("customers");
        const account = data.find((account)=>account.account_id==id);
        document.getElementsByClassName("edit_id")[0].value= account.account_id;
        document.getElementsByClassName("edit_transaction")[0].value= account.transaction_no;
        document.getElementsByClassName("edit_tdate")[0].value=account.created_at;
        document.getElementsByClassName("edit_tamount")[0].value= account.amount;
        const customer = cdata.find((customer)=>customer.id===account.customer_id);
        const p = document.getElementsByClassName("edit_customer")[0];
        if(customer)
        {      
          p.innerHTML = `<option selected value="${customer.customer_id}">${customer.firstname} ${customer.lastname}</option>`;
        }
        let options ='';
        cdata.forEach(el=>{
            options += '<option value = "'+el.id+'">' + el.firstname + " " + el.lastname+ '</option>';
        });
        p.innerHTML += options;
  }

  function loadsupplyedit(id)
  {
        const sdata =returnData("supply");
        const idata =returnData("inventory");
        const supply = sdata.find((supply)=>supply.supply_id==id);
        document.getElementsByClassName("edit_description")[0].value= supply.description;
        document.getElementsByClassName("edit_samount")[0].value= supply.amount;
        document.getElementsByClassName("edit_sdate")[0].value= supply.created_at;
        const products = idata.filter((products)=>products.supply_id ==id);
        let rows ='';
        if(products)
        {
          let count =1000;
            products.forEach(product=>{
              count = count + 1;
              rows += "<tr id='row_" + count + "'><td>";
              rows += "<input type='hidden' id='product_id_"+count+"' value ='" +product.product_id+ "'><input type ='text' list='products_name' id ='product_name_" + count + "' readonly value ='"+product.product_name+"' data-id ='" + count + "' class='product form-control' required></td>";
              rows += "<td>";
              rows += "<input type ='text' id ='rate' onchange ='update_rate(this)' value ='"+product.unitprice+"' class='form-control' required></td><td>";
              rows += "<input type ='number' min = '1' onchange ='update_rate(this)' id ='qty' value ='"+product.quantity_supplied+"' class='form-control' required></td><td>";
              rows += "<input type ='text' readonly id ='total' value ='"+(product.quantity_supplied * product.unitprice)+"' class='form-control' required></td><td>";
              rows += "<button type='button' name='remove' id ='remove" + count + "' title ='Click to delete' data-row='row_" + count + "' class='btn btn-danger btn-md remove icofont-trash'>x</button></td>";
              rows += "</tr>";
            });
            document.getElementById("products").innerHTML = rows;
        }
  }
  function loadcategoryedit(id)
  {
        const data =returnData("categories");
        const category = data.find((category)=>category.category_id==id);
        document.getElementsByClassName("edit_category")[0].value = category.category;
        document.getElementsByClassName("edit_id")[0].value= category.category_id;
        const parent_cat = data.find((parent_cat)=>parent_cat.parent===category.category_id);
        const p = document.getElementsByClassName("edit_parent")[0];
        if(parent_cat)
        {      
          p.innerHTML = `<option selected value="${parent_cat.category_id}">${parent_cat.category}</option>`;
        }
        let options ='<option value="0">Main</option>';
        data.forEach(el=>{
            options += '<option value = "'+el.category_id+'">' + el.category + '</option>';
        });
        p.innerHTML += options;
  }

  function loadcustomeredit(id)
  {
        const data =returnData("customers");
        const customer = data.find((customer)=>customer.id==id);
        document.getElementsByClassName("edit_firstname")[0].value = customer.firstname;
        document.getElementsByClassName("edit_lastname")[0].value = customer.lastname;
        document.getElementsByClassName("edit_id")[0].value= customer.id;
        document.getElementsByClassName("edit_phone")[0].value = customer.phone;
        document.getElementsByClassName("edit_email")[0].value = customer.email;
        document.getElementsByClassName("edit_address")[0].value = customer.address;
  }
  function loadproductedit(id)
  {
        const data =returnData("products");
        const product = data.find((product)=>product.product_id==id);
        document.getElementsByClassName("edit_product_name")[0].value = product.product_name;
        document.getElementsByClassName("edit_cost")[0].value = product.cost_price;
        document.getElementsByClassName("edit_id")[0].value= product.product_id;
        document.getElementsByClassName("edit_selling")[0].value = product.selling_price;
        const cdata =returnData("categories");
        const parent_cat = cdata.find((parent_cat)=>parent_cat.category_id===product.product_id);
        const p = document.getElementsByClassName("edit_category")[0];
        if(parent_cat)
        {      
          p.innerHTML = `<option selected value="${parent_cat.category_id}">${parent_cat.category}</option>`;
        }
        let options='';
        cdata.forEach(el=>{
            options += '<option value = "'+el.category_id+'">' + el.category + '</option>';
        });
        p.innerHTML += options;

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
          const prt = data.find((category)=>category.category_id===el.parent);
          let p = 'Main';
          if(prt)
          {
            p =prt.category ;
          }
            rows += '<tr><td>'+el.category+'</td><td>' + p+ '</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
             rows += `<a onclick ="navigateEdit('row','edit-category.html',loadcategoryedit,${el.category_id});" class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   `href="#"><i class="ri-pencil-line mr-0"></i></a>`;
             rows +=    `</div></td></tr>`;
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
            rows += '<a class="badge bg-danger mr-2" data-toggle="tooltip" data-placement="top" title="View Account" data-original-title="Account"';
             rows +=   'href="customer-account.html?customer_id='+el.id+'"><i class="ri-book-line mr-0"></i></a>'; 
             rows += `<a onclick ="navigateEdit('row','edit-customer.html',loadcustomeredit,${el.id});" class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=    '</div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtableproducts()
  {
        const data =returnData("products");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.product_name  + '</td><td>' + el.category+'</td><td>' + el.cost_price + '</td><td>' + el.selling_price + '</td><td>' + el.available +'</td><td>' + el.created_at +'</td>';
            rows += '<td><div class="d-flex align-items-center list-action">';
            rows += `<a onclick ="navigateEdit('row','edit-product.html',loadproductedit,${el.product_id});" class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=    '</div></td></tr>';
        });
        parent_.innerHTML = rows;
  }

  function loadtableinventory()
  {
        const data =returnData("inventory");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(el=>{
            rows += '<tr><td>'+el.product_name  + '</td><td>' + el.description+'</td><td>' + el.SumQ + '</td><td>' + el.selling_price + '</td><td>' + el.quantity_supplied +'</td></tr>';
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
                          rows += `<a class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   'href="edit-supply.html?supply_id='+el.supply_id+'"><i class="ri-pencil-line mr-0"></i></a>';
            // rows +=  '<a class="badge bg-warning mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Delete" href="#"><i class="ri-delete-bin-line mr-0"></i></a>';
             rows +=    '</div></td></tr>';
        });
        parent_.innerHTML = rows;
  }
  function loadtablecaccount(customer_id)
  {
        const data =returnData("account");
        const c_data = data.filter((account)=>account.customer_id ==customer_id);
        if(c_data)
        {
          let customer_name ='';
          let balance =0;
          let totalDebit = 0;
          let totalCredit =0;
        const parent_ = document.getElementById("catRow");
        let rows ='';
        c_data.forEach(acc=>{
          customer_name = `${acc.firstname } ${acc.lastname}`;
          let debit = 0;
          let credit =0;
            if(acc.type === 'C')
            {
              credit = Number.parseFloat(acc.amount);
              balance +=credit;
              totalCredit +=credit;
            }
            else if(acc.type==='D')
            {
              debit = Number.parseFloat(acc.amount);
              balance -= debit;
              totalDebit +=debit;
            }
            rows += `<tr><td>${acc.transaction_no}</td><td>${acc.created_at}</td><td>${credit}</td><td>${debit}</td><td>${balance}</td></tr>`;
        });
        rows +=`<tfoot><tr style="background-color:red;font-weight:bold;"><td></td><td style="color:white;">Total: </td><td style="color:white;">${totalCredit}</td><td style="color:white;">${totalDebit}</td><td style="color:white;">${balance}</td></tr></tfoot>`;
        parent_.innerHTML = rows;
        document.getElementById("customer_name").innerText = customer_name + "'s account statement";
        }
  }
  
  function loadtablecustomeraccount()
  {
    const data =returnData("account");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(acc=>{
            rows += `<tr><td>${acc.firstname} ${acc.lastname}</td><td>${acc.transaction_no}</td><td>${acc.created_at}</td><td>${acc.amount}</td><td>${acc.type}</td>`;
            rows += '<td><div class="d-flex align-items-center list-action">';
            rows += `<a onclick ="navigateEdit('row','edit-customer-payment.html',loadaccountedit,${acc.account_id});" class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=    '</div></td></tr>';
        });
        parent_.innerHTML = rows;
    }


    function loadtableorder()
  {
    const data =returnData("orders");
        const parent_ = document.getElementById("catRow");
        let rows ='';
        data.forEach(ord=>{
            rows += `<tr><td>${ord.firstname} ${ord.lastname}</td><td>${ord.created_at}</td><td>${ord.amount}</td><td>${ord.description}</td>`;
            rows += '<td><div class="d-flex align-items-center list-action">';
            rows += '<a class="badge bg-danger mr-2" data-toggle="tooltip" data-placement="top" title="View Order" data-original-title="Order"';
             rows +=   'href="view-order-sales.html?uuid='+ord.uuid+'"><i class="ri-book-line mr-0"></i></a>'; 
            rows += `<a onclick ="navigateEdit('row','edit-order-sales.html',loadorderedit,${ord.uuid});" class="badge bg-success mr-2" data-toggle="tooltip" data-placement="top" title="" data-original-title="Edit"`;
             rows +=   'href="#"><i class="ri-pencil-line mr-0"></i></a>';
             rows +=    '</div></td></tr>';
        });
        parent_.innerHTML = rows;
    }
    function loadorderinvoice(uuid)
    {
      const data =returnData("orders");
      const o_data = data.find((order)=> order.uuid == uuid);
      const sdata =returnData("sales");
      const salesorder = sdata.filter((sales)=> sales.order_uuid == uuid);
      let rows='';
      console.log(salesorder)
      salesorder.forEach(sale=>{
          rows += ` <tr>
          <td class="description">${sale.product_name}</td>
          <td class="quantity">${sale.quantity}</td>
          <td class="price">${sale.selling_price}</td>
          <td class="total">${(sale.selling_price*sale.quantity)}</td>
      </tr>`;
      });
        rows +=` <tr>
        <td class="description">TOTAL:</td>
        <td colspan="3" class="price"><div id="total" style="font-weight: bold; text-align:right;">${o_data.amount}</div></td>
    </tr>`;
    document.getElementById("row").innerHTML =rows;
    document.getElementById('customer').innerText = o_data.firstname + " " + o_data.lastname;
    document.getElementById('orderid').innerText = o_data.uuid;
    document.getElementById('description').innerText = o_data.description;
    document.getElementById('date').innerText = o_data.created_at;
    }

    function loadsalesinvoice(obj)
    {
      console.log(obj)
      obj.products.forEach(sale=>{
          rows += ` <tr>
          <td class="description">${sale.product_name}</td>
          <td class="quantity">${sale.quantity}</td>
          <td class="price">${sale.rate}</td>
          <td class="total">${(sale.rate*sale.quantity)}</td>
      </tr>`;
      });
        rows +=` <tr>
        <td class="description">TOTAL:</td>
        <td colspan="3" class="price"><div id="total" style="font-weight: bold; text-align:right;">${obj.amount}</div></td>
    </tr>`;
    document.getElementById("row").innerHTML =rows;
    document.getElementById('customer').innerText = obj.customer;
    document.getElementById('description').innerText = obj.description;
    document.getElementById('orderid').innerText = obj.uuid;
    document.getElementById('date').innerText = obj.date;
    }

    function loadsales(uuid)
    {
      const sdata =returnData("sales");
      let rows='';
      console.log(sdata)
      sdata.forEach(sale=>{
          rows += ` <tr>
          <td class="description">${sale.product_name}</td>
          <td class="quantity">${sale.quantity}</td>
          <td class="price">${sale.selling_price}</td>
          <td class="total">${(sale.selling_price*sale.quantity)}</td>
          <td class="price">${sale.created_at}</td>
      </tr>`;
      });
        //rows +=` <tr>
        //<td class="description">TOTAL:</td>
        //<td colspan="3" class="price"><div id="total" style="font-weight: bold; text-align:right;">${o_data.amount}</div></td>
    //</tr>`;
    document.getElementById("catRow").innerHTML =rows;
    }