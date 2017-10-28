$(document).ready(function() {
    $('.button-colapse').sideNav({
        menuWidth: 200
    });

    function wrongsignup(event)  //For empty input fields in Sign Up
    {
    	var name = document.getElementById('name-input').value;
    	var email = document.getElementById('email-input').value;
    	var pwds = document.getElementById('pwds-input').value;
    	if(String(name).length===0 || String(email).length===0 || String(pwds).length===0)
    	{
    		Materialize.toast("Input Field Can't Be Empty!",200);
    		event.stopPropagation();
    		return;
    	}
    	$('#name-input').val('');
        $('#email-input').val('');
        $('#pwds-input').val('');
        Materialize.updateTextFields();    //to make the labels fall back to their original palces.
    }

    function wronglogin(event)  //For empty input fields in Log In
    {
    	var nam = document.getElementById('log-name').value;
    	var pwd = document.getElementById('log-pwds').value;
    	if(String(nam).length===0 || String(pwd).length===0)
    	{
    		Materialize.toast("Input Field Can't Be Empty!",200);
    		event.stopPropagation();
    		return;
    	}
    	$('#log-name').val('');
        $('#log-pwds').val('');
        Materialize.updateTextFields();   //to make the labels fall back to their original palces.
    }

    function clear()   //To clear all te input fields in both the modals 
    {
	    $('#name-input').val('');
        $('#email-input').val('');
        $('#pwds-input').val('');
        $('#log-name').val('');
        $('#log-pwds').val('');
        Materialize.updateTextFields();
    }

    $("#signup").on('click', wrongsignup);
    $("#login").on('click', wronglogin);
    $("#log").on('click', clear);
    $("#sign").on('click', clear);
});
