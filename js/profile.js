$(document).ready(function () {
    let user=JSON.parse(sessionStorage.getItem("user"));
    let sessionid = user.id
    let defaultimg;
    //preview image before uplading
    $(document).on('change', '.update-image', function () {
        const file = this.files[0];
        if (file) {
            let reader = new FileReader();
            reader.onload = function (event) {
                $("#image-holder").attr("src", event.target.result);
            };
            reader.readAsDataURL(file);
        }
    });
    //jqury for profile edit button----removing 1st container
    $(document).on("click", ".profile-button", function () {
        $(".profile-container ").remove();
    });

    //fetching data from backend

    $.ajax({
        type: "GET",
        url: "http://localhost:3000/user",
        dataType: "json",
        async: true,
        success: function (data) {
            //uploading the data dynamically section profile-container
            let profile = "";
            let editprofile = "";
            let  profileHeader="";
            let  editprofileinfo="";
            $.each(data, function (i, v) {
                if (v.id == sessionid) {
                   
                    defaultimg=v.image;
                    profileHeader+= `
                    <div class="profile mr-3"><img id="profile-pic" src="../assets/images/profile/${v['image']}" alt="..."
                                width="130" class="rounded mb-2 profile-pic"><a
                                class="btn  btn-sm btn-dark btn-block text-white profile-button" data-role="button" type="button"
                                data-toggle="collapse" data-target="#profileEdit" aria-expanded="false">Edit profile</a>
                        </div>
                        <div class="media-body mb-5 text-white">
                            <h4 class="mt-2 mb-4 text-capitalize">${v['name']}</h4>
                        </div>
                    </div>`;
                    $(".profile-header").append(profileHeader);

                    profile+= ` 
                            <div class="row mt-2">
                                <div class="col-md-6">
                                    <label class="labels">Name</label>

                                </div>
                                <div class="col-md-6">
                                    <h6>${v['name']}</h6>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <label class="labels">Phone Number</label>

                                </div>
                                <div class="col-md-6">
                                    <h6>${v['phone']}</h6>
                                </div>
                            </div>
                            <div class="row mt-3">
                                <div class="col-md-6">
                                    <label class="labels">Email</label>
                                </div>
                                <div class="col-md-6">
                                    <h6>${v['email']}</h6>
                                </div>
                            </div>
                         `;
          $(".information").append(profile);

                    //section edit profile
                    editprofile += `
	
               
                    <div class="media align-items-end profile-header">
                        <div class="profile mr-3"><img id="image-holder" src="../assets/images/profile/${v['image']}" alt="..."
                                width="130" class="rounded mb-2 profile-pic">
                            <input class="update-image collapse" id="imgchange1" type="file"  accept="image/*" />
                        </div>
                    </div>`
                    $(".profileedit").append(editprofile);
                    //edit profile form
                    editprofileinfo +=
                `               <div class="row mt-2">
                                    <div class="col-md-6">
                                        <label class="labels">Name</label>
                                        <input type="text" class="form-control " id="name" placeholder="first name"
                                            value="${v['name']}">
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label class="labels">Email</label>
                                        <input type="email" class="form-control " id="email" placeholder="Email"
                                            value="${v['email']}">
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-md-6">
                                        <label class="labels">Phone Number</label>
                                        <input type="tel" class="form-control " id="phone" placeholder="Phone"
                                            value="${v['phone']}">
                                    </div>
                                </div>
                                <div class="row mt-4">
                                    <div class="col-md-6">
                                        <label class="labels">Password</label>
                                        <input type="password" class="form-control " id="password"
                                            placeholder="Password" value="${v['password']}">
                                    </div>
                                </div>
                                <div class="row mt-5">
                                    <div class="col-md-6">
                                        <button class="btn btn-primary save-button " type="submit" value="submit">
                                                <a class="text-white" href="../ui/profile.html"> Save Profile</a></button>
                                    </div>
                                    <div class="col-md-6">
                                        <button class="btn btn-primary text-white back-button " data-role="button">
                                           <a class="text-white" href="../ui/profile.html">Back</a></button>
                                    </div>
                                </div> `;
                    $(".form").append(editprofileinfo);
                }
            });
            //upending profile continers
            
            
        },
        error: function () {

           // console.log("error")
        }
    });
    // edit profile updating the information
    $(document).on("click", ".save-button ", function () {
        //validations
        //email
        let uname;
        if ($("#name").val()) {
           uname =$("#name").val()
        }else{
            alert('invalid name ')
            location.reload();
    
        }
        let email;
        let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (emailPattern.test($("#email").val())) {
            // perform some task
            email = $("#email").val()
           // console.log('Valid email ')
        }else{
            alert('invalid email ')
            location.reload();
    
        }
        //password
        let password;
        let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
        if (passwordPattern.test($("#password").val())) {
            // perform some task
           
            password= $("#password").val()       
            
        }else{
            alert('invalid password ' )
            location.reload();
        }
        //phone
        let phone;
        let phonePattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
        if (phonePattern.test($("#phone").val())) {
            // perform some task
             phone =$('#phone').val()
           
        }else{
            alert('invalid phone ')
            location.reload();
        }
        // ajax request
        if((phone != 0)&& email && password && uname  != null){
        var formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            password: $("#password").val(),
            image: defaultimg
        };
        deleteurl = "http://localhost:3000/user/" + sessionid;
      
        $.ajax({
            type: "PUT",
            url: deleteurl,
            data: formData,
            dataType: "json",
            crossDomain: true,
            async: true,
        }).done(function () {

        });
    }  //if end
    });
    //edit profile updating the image
    $(document).on("click", "#imgchange2", function () {
        var formData = {
            name: $("#name").val(),
            email: $("#email").val(),
            phone: $("#phone").val(),
            password: $("#password").val(),
            image: $("#imgchange1").val().split('\\').pop()
        };
        deleteurl = "http://localhost:3000/user/" + sessionid;
        
        $.ajax({
            type: "PUT",
            url: deleteurl,
            data: formData,
            dataType: "json",
            crossDomain: true,
            async: true,
        }).done(function () {

        });
    });

});

