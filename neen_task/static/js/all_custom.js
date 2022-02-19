function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function registration() {
    let first_name = document.getElementById('id_first_name').value;
    let last_name = document.getElementById('id_last_name').value;
    let username = document.getElementById('id_email').value;
    let password = document.getElementById('id_password').value;
    let password2 = document.getElementById('id_con_password').value;
    let csrftoken = readCookie('csrftoken');
    var formData = new FormData();
    formData.append("first_name", first_name);
    formData.append("last_name", last_name);
    formData.append("username", username);
    formData.append("password", password);
    if (username == '')
        alert("Email can't be blank.");
    else if (first_name == '')
        alert("First name can't be blank.");
    else if (password == '')
        alert("Password can't be blank.");
    else if (password2 == '')
        alert("Confirm Password can't be blank.");
    else if (password != password2)
        alert("Password and Confirm Password must be same.");
    else {
        fetch(document.location.origin + '/api/registration/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,

            },
            body: formData
        }).then(response => {
            if (!response.ok) throw response;
            return response.json();
        }).then(data => {
            console.log(data);
            if (data.mssage == "A user is already registered with this e-mail address.")
                alert("A user is already registered with this e-mail address.");
            else {
                alert("Registered Successfully");
                document.location.href = document.location.origin + '/';
            }
        })


    }
}

function login() {
    let username = document.getElementById('id_log_email').value;
    let password = document.getElementById('id_log_password').value;
    let csrftoken = readCookie('csrftoken');
    var formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    if (username == '')
        alert("username can't be blank.");
    else if (password == '')
        alert("Password can't be blank.");
    else {
        fetch(document.location.origin + '/api/login/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,

            },
            body: formData
        }).then(response => {
            if(response.status===400){
                alert("Username & Password does not match.");
            }
            if (!response.ok) throw response;
            return response.json();
            
        }).then(data => {
            console.log(data);
            alert("Login Successfully");
            // console.log(data.data.key)
            localStorage.setItem('key', data.data.key)
            document.location.href = document.location.origin + '/';

        })


    }
}

var modal = document.getElementById('id01');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
var modal = document.getElementById('id02');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

var modal = document.getElementById('id03');

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function data() {
    let url = document.location.origin + "/api/blog-view/";
    // let auth = "Token " + localStorage.getItem('key');
    fetch(url, {
        method: 'GET',
        headers: {
            
                
        },
    }).then(response => {
        if (!response.ok) throw response;
        return response.json();
    }).then(data => {
        console.log("data", data);
        for (let i = 0; i < data.length; i++) {
            var para = document.createElement("div");
            para.className = "column";
            let l= '';
            for (let j=0; j<=9; j++){
                l = l+data[i].created_date[j]
            }
            para.innerHTML = "<div class='uc'><h2>"+ data[i].title+"</h2> <p>"+ data[i].content +"</p>"+
            "<p> author--"+ data[i].author.first_name+ "</p><p> Publish date -"+ l + "</p></div>";
            document.getElementById("blog_data").appendChild(para);
        }
    });



    let url1 = document.location.origin + "/api/blog/";
    let auth = "Token " + localStorage.getItem('key');
    fetch(url1, {
        method: 'GET',
        headers: {
            'Authorization': auth,
        },
    }).then(response => {
        if (!response.ok) throw response;
        return response.json();
    }).then(data => {
        console.log("data", data);
        for (let i = 0; i < data.length; i++) {
            var para = document.createElement("div");
            para.className = "column";
            let l= '';
            for (let j=0; j<=9; j++){
                l = l+data[i].created_date[j]
            }
            para.innerHTML = "<div class='uc'><h2>"+ data[i].title+"</h2> <p>"+ data[i].content +"</p>"+
            "<p> Publish date -"+ l + "</p></div>";
            document.getElementById("user_data").appendChild(para);
        }
    });
}


function add() {
    let title = document.getElementById('id_title').value;
    let content = document.getElementById('id_content').value;

    var getSelectedValue = document.querySelector(
        'input[name="published"]:checked');

    if (getSelectedValue != null) {
        var is_published = getSelectedValue.value;
    }
    
    let csrftoken = readCookie('csrftoken');
    let auth = "Token " + localStorage.getItem('key');
    var formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("is_published", is_published);
    if (title == '')
        alert("Title can't be blank.");
    else if (content == '')
        alert("Content can't be blank.");
    else {
        fetch(document.location.origin + '/api/blog/', {
            method: 'POST',
            headers: {
                "X-CSRFToken": csrftoken,
                'Authorization': auth,

            },
            body: formData
        }).then(response => {
            if (!response.ok) throw response;
            return response.json();
        }).then(data => {
            console.log(data);
                alert("New blog create successfully.");
            document.location.href = document.location.origin + '/';

        })


    }
}
