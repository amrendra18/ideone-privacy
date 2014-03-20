/*
 * Author : Amrendra Kumar
 *
 * Git Hub repository including similar script for firefox
 * Url: https://github.com/thecodegame/ideone-privacy
 *
 * Privacy Settings at Ideone:
 *		Public  : Submissions are available to everyone, even shown in recent codes on Ideone.
 *  	Secret  : Submissions are available to anyone who has the link to it, these submission can come up in google searches.
 *  	Private : Submissions are available only to the user who created it.
 *
 */



//for debugging purpose
//if debugging is set to true, then a debugging log would be shown 
//in a div at bottom right
var DEBUG = false
if (DEBUG) $("body").append( "<div id='debug'></div>");
var debug;
if (DEBUG){
	debug = $('#debug');
}

function LOG(msg){
	if(DEBUG){
		debug.append(msg+"<br />");
	}
}


//lets assume user is not logged in
var LOGGED_IN = false;
//status of the paste, lets assume it to be public
var STATUS = 1;// 1:public 0:secret -1: private


//this function is triggered when Run/Ideone it button is pressed
function check(){
	//LOG("Log in: "+LOGGED_IN+" Status: "+STATUS);
	switch(STATUS){
		case -1://user is making a hidden submission
		return true;
		case 0://user is making a secret submission, solution is still available for ppl with links
		if(!window.confirm("You are making secret paste, it would be still available to people with the link to the paste. Are you sure?"))
     		return false;
		return true;
		case 1://user is making a public solution
		if(!window.confirm("You are making public paste, it would be available to everyone, also it would be shown in recent codes. Are you sure?"))
     		return false;
		return true;
		break;
		default://never gonna happen
		return true;
	}
	
}


//check if user is logged in or not
//if 2nd menu present in menubar at top right is "samples" then NOT logged in
//if 2nd menu present in menubar at top right is "my codes" then user is logged in
var menuBar = $("ul.pull-right");
var secondMenu = menuBar.children().eq(1);
var secondMenuText = secondMenu.text().trim();

var STATUS_UNKNOWN = false;
if(secondMenuText=="samples"){
	LOGGED_IN=false;
}else if(secondMenuText=="my codes"){
	LOGGED_IN=true;
}else{
	STATUS_UNKNOWN = true;
}

//get to the footer when run button is located
var runButton = $("div.footer > div.pull-right");
//register the onclick listener to Run/Ideone it button
runButton.click(check);
//add the status button before run/Ideone it button
$("<span id='status-for-user' class='btn btn-warning footer-item'>checking..</span>").insertBefore(runButton); 
var tag = $("span#status-for-user");



//make the status to show thats its public
function makePublic(){
	LOG("making public");
	if(STATUS==-1){
		if(tag.hasClass('btn-success')){
			tag.removeClass('btn-success');
			tag.addClass('btn-warning');
		}
	}
	STATUS = 1;
	tag.text("Public Paste");
	if(LOGGED_IN){
		tag.attr('title', 'NOT RECOMMENDED! Public pastes are available to everyone.');
	}else{
		tag.attr('title', 'NOT RECOMMENDED! Public pastes are available to everyone. Log in for a private paste');
	}
}

//make the status to show thats its secret
function makeSecret(){
	LOG("making secret");
	if(STATUS==-1){
		if(tag.hasClass('btn-success')){
			tag.removeClass('btn-success');
			tag.addClass('btn-warning');
		}
	}
	STATUS = 0;
	tag.text("Secret Paste");
	if(LOGGED_IN){
		tag.attr('title', 'NOT RECOMMENDED! Secret pastes are available to anyone with the link. ');
	}else{
		tag.attr('title', 'NOT RECOMMENDED! Secret pastes are available to anyone with the link. Log in for a private paste');
	}
}

//make the status to show thats its private
function makePrivate(){
	if(LOGGED_IN){
		LOG("making private");
		STATUS = -1;
		tag.text("Private Paste");
		tag.attr('title', 'RECOMMENDED! \r\n Private pastes are available to you only');
		if(tag.hasClass('btn-warning')){
			tag.removeClass('btn-warning');
			tag.addClass('btn-success');
		}
	}else{
		LOG("cannot make private");
	}
}

//make the status to show thats there has been a change in Ideone UI
function update(){
	tag.text("UPDATE");
	tag.attr('title', 'Ideone UI changed, update Ideone Hidden Submission extension');
}


//get the buttons group for privacy settings
var BTN_GROUP = $('div#btn-group-visibility');
//get individual buttons
var PUBLIC_BTN = BTN_GROUP.children().eq(0);
var SECRET_BTN = BTN_GROUP.children().eq(1);
var PRIVATE_BTN = BTN_GROUP.children().eq(2);
//register the listeners to these buttons
PUBLIC_BTN.click(makePublic);
SECRET_BTN.click(makeSecret);
PRIVATE_BTN.click(makePrivate);

//returns the current privacy set for the paste
function getButton(){
	if(PUBLIC_BTN.hasClass('active')){return 1;}
	if(SECRET_BTN.hasClass('active')){return 0;}
	if(PRIVATE_BTN.hasClass('active')){return -1;}
	return 2;//errror
}

//sets the status button
function setStatus(x){
	switch(x){
		case 1:makePublic();break;
		case 0:makeSecret();break;
		case -1:makePrivate();break;
		default:update();break;
	}
}


//set the status
if(STATUS_UNKNOWN){
	LOG("status unknown :P");
	update();
}else if(LOGGED_IN==false){
	LOG("user not logged in");
	setStatus(getButton());
}else{
	//user is logged in,lets try and make private default value
	var x = getButton();
	if(x==1){
		PUBLIC_BTN.removeClass('active');
		PRIVATE_BTN.addClass('active');
		LOG("from public to private default");
	}else if(x==0){
		SECRET_BTN.removeClass('active');
		PRIVATE_BTN.addClass('active');
		LOG("from secret to private");
	}else{
	}
	makePrivate();
}

