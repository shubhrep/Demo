//console.clear();
$(document).ready(function () {

      let user = JSON.parse(sessionStorage.getItem("user"));
      $(".logoutBtn").hide();
      $(".profileLink").hide();
      //   
      if (user == null) {

            $(".logoutBtn").hide();
            $(".profileLink").hide();
            $(".regBtn").show();
            $(".loginBtn").show();
      } else {
            $(".logoutBtn").show();
            $(".loginBtn").hide();
            $(".regBtn").hide();
            $(".profileLink").show();
      };

      //if your loged in then only it will redirect to music page
      $(document).on('click', '#musicLink', function () {
            if (user != null) {
                  window.location = "../ui/music.html";
            }
            else {
                  $(this).attr("href", "./index.html");
                  window.location = "./index.html";
            }
      });

      //Ajax request for Login
      $("#submitLogin").click(function (e) {


            let email = $('#inputEmail').val();
            let password = $('#inputPass').val();

            // Ajax Call start
            $.ajax({
                  type: "GET",
                  url: "http://localhost:3000/user",
                  dataType: "json",
                  async: true,
                  success: function (data) {

                        let validEmail = ''
                        let id;
                        let validpassword = '';
                        $.each(data, function (i, v) {
                              let testEmail = `${v.email}`
                              let testpassword = `${v.password}`
                              if (email == testEmail && password == testpassword) {
                                    validEmail = testEmail;
                                    validpassword = testpassword;
                                    id = v.id;
                                    username = v.name
                                    sessionStorage.setItem('user', JSON.stringify(v));
                                    return false;
                              }
                              validEmail = 'null'


                        });

                        if (validEmail == email) {
                              $(".logoutBtn").show();
                              $(".loginBtn").hide();
                              $(".profileLink").show();
                              $(".loginSuccess").alert();
                              location.reload();
                        } else {
                              $('.loginFailed').alert();
                        }

                  },
                  error: function () {
                        // console.log("not able to process request");
                  },
            });
      });

      //Ajax request for User Registration
      let name = ''
      let email = ''
      let phone = 0
      let password = ''
      let confirmPass = ''

      //validate name
      $("#name").change(nameValid);

      function nameValid() {
            let Key = $("#name").val();
            let namePattern = /^[a-z]+$/;

            if (namePattern.test(Key)) {
                  $("#name").removeClass('is-invalid');
                  $("#name").addClass('is-valid');
                  name = Key;

            }
            else {
                  $("#name").addClass('is-invalid')
                  name = ''
            }

      }



      // Email Validation
      $("#email").change(emailValid);

      function emailValid() {
            let Key = $("#email").val();
            let emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            if (emailPattern.test(Key)) {
                  //after inavlid bootstrap class will add and remove
                  $("#email").removeClass('is-invalid');
                  $("#email").addClass('is-valid');
                  email = Key;
            }
            else {
                  $("#email").addClass('is-invalid')
                  email = ''
            }

      }

      // Phone Validation
      $("#phone").change(phoneValid);

      function phoneValid() {
            let Key = $("#phone").val();
            let phonePattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
            if (phonePattern.test(Key)) {
                  $("#phone").removeClass('is-invalid');
                  $("#phone").addClass('is-valid');
                  phone = Key;
            }
            else {
                  $("#phone").addClass('is-invalid')
                  phone = 0;
            }

      }

      //  Password validation
      $("#Pass").keyup(checkPasswordreq);

      function checkPasswordreq() {
            let Key = $("#Pass").val();

            let passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;
            if (passwordPattern.test(Key)) {

                  $("#passRequired").css("color", "green")
                  $("#Pass").removeClass('is-invalid');
                  $("#Pass").addClass('is-valid');
                  password = Key;
            }
            else {
                  $("#Pass").addClass('is-invalid');
                  $("#passRequired").css("color", "red")
                  password = '';
            }


      }

      //  confirm password validation
      $("#confirmPass").keyup(checkPasswordMatch);

      function checkPasswordMatch() {
            let Key = $("#Pass").val();

            let confirmPassword = $("#confirmPass").val();


            if (Key != confirmPassword) {

                  $("#divCheckPasswordMatch").html("Password do not match!");


            }
            else {
                  $("#Pass").removeClass('is-valid')
                  $("#confirmPass").addClass('is-valid')

                  $("#divCheckPasswordMatch").html("Password match.");
                  password = Key;


            }
      }

      $("#submitRegister").click(function (e) {


            let data = { "name": name, "email": email, "phone": phone, "password": password }

            if ((name != '') && (email != '') && (phone != 0) && (password != '')) {
                  //alert("well")
                  // Ajax Call start

                  let data = { "name": name, "email": email, "phone": phone, "password": password }

                  $.ajax({
                        type: "POST",
                        url: "http://localhost:3000/user/",
                        dataType: "json",
                        async: false,
                        data: data,
                        success: function (data) {




                        },
                        error: function () {
                              //console.log("not able to process request");
                        },
                  });

            } else {
                  // console.log(" Something incorrect please re register ")

            }

      });

      $(document).on('click', '.logoutBtn', function () {
            sessionStorage.clear();
            //console.clear();
            location.reload();
            location.href = "http://localhost:5500/index.html"

            $(".loginBtn").show();
      });


      $(document).on('click', '#musicLink', function () {
            if (user != null) {
                  window.location = "../ui/music.html";
            }
            else {
                  window.location = "../index.html";
            }
      });
});




