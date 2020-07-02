if(failed_attempt)
{
  document.querySelector("#pop-up .top-row").innerHTML += "Incorrect Username/Password";
}
else
{
  $("#pop-up").hide();
  $("#overlay").hide();
}


document.getElementById('login').addEventListener("click",
  function()
  {
    if(logged_in)
    {
    window.location = "/dashboard";
    }
    else
    {
    $("#pop-up").fadeIn();
    $("#overlay").fadeIn();
    }
  });


document.getElementById('x-button').addEventListener("click",
    function()
    {
      $("#pop-up").fadeOut();
      $("#overlay").fadeOut();
    });
