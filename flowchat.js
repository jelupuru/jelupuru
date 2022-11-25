"use strict";
(function( $ ) {

  $.fn.flowchat = function( options ) {

    // override options with user preferences

    var settings = $.extend({
      delay: 1500,
      startButtonId: '#startButton',
      autoStart: true,
      startMessageId: 1,
      dataJSON: null,
      agentName: "jai"
    }, options );

    var container = $(this);

    $(function() {
      if(settings.autoStart)
        startChat(container, settings.dataJSON, settings.startMessageId, settings.delay,settings.agentName)
    });

    // on click of Start button
    $(document).on('click', settings.startButtonId, function() {

      startChat(container, settings.dataJSON, settings.startMessageId, settings.delay)

    });
  }

  function selectOption($this, container, data, delay,agentName) {
    $this.parent().hide();
    var $userReply = $('<li class="user"><div class="text">'+ $this.html() +'</div></li>');
    container.children('.chat-window').append($userReply);

    // get the next message
    var nextMessageId = $this.attr('data-nextId');
    var nextMessage = findMessageInJsonById(data, nextMessageId);

    // // add next message
    generateMessageHTML(container, data, nextMessage, delay,agentName);
  }

  function startChat(container, data, startId, delay,agentName) {
    // clear chat window
    container.html("");
    container.append("<ul class='chat-window'></ul>");

    // get the first message
    var message = findMessageInJsonById(data, startId);

    // add message
    generateMessageHTML(container, data, message, delay,agentName);
  }

  function findMessageInJsonById(data, id) {

    var messages = data;

    for (var i = 0; messages.length > i; i ++)
      if (messages[i].id == id)
        return messages[i];

  }

  function addOptions(container, data, delay, m,agentName) {

    var $optionsContainer = $('<li class="options"></li>');
    if(m.mainTiles){
      $optionsContainer = $('<li class="  faqcards clearfix"></li>');
    }

    var $optionsList = $('<ul></ul>');
    if(m.subCat){

      $optionsList = $('<ul class="buttons-wrapper  full-width-div-buttons-wrapper "></ul>');
    }

    var optionText = null;

    var optionMessageId = null;

    for (var i=1;i<12;i++) {
      optionText = m["option"+i]
      optionMessageId = m["option"+i+"_nextMessageId"]

      if (optionText != "" && optionText != undefined && optionText != null) {// add option only if text exists
        var $optionElem = $("<li data-nextId=" + optionMessageId + ">" + optionText + "</li>");
        if(m.subCat){
          $optionElem = $("<li class='full-width-div  template-button quick-reply    full-width-div  template-button quick-reply    ' data-nextId=" + optionMessageId + ">" + optionText + "</li>");

        }
        $optionElem.click(function() {
          selectOption($(this), container, data, delay,agentName)
        });

        $optionsList.append($optionElem);
      }
    }

    $optionsContainer.append($optionsList);

    return $optionsContainer;
  }

  function toggleLoader(status, container) {
    if(status=="show")
      container.children('.chat-window').append("<li class='typing-indicator'><span></span><span></span><span></span></li>");
    else
      container.find('.typing-indicator').remove();
  }

  function generateMessageHTML(container, messages, m, delay,agentName) {
   
    // create template if text is not null
  if(m.text != null){

  var showChar = 200;
	var ellipsestext = "...";
	var moretext = "Read more";
	var lesstext = "less";
  var content =m.text;// $(this).html();
  var classBot="bot botTitle";
if(m.noBotLabel){
  classBot="bot";
}
		if(content.length > showChar  ) {
console.log(m.longText);
			var c = content.substr(0, showChar);
			var h = content.substr(showChar, content.length - showChar);
      var html = c + '<span class="moreellipses">' + ellipsestext+ '&nbsp;</span><span class="morecontent"><span>' + h + '</span>&nbsp;&nbsp;<a href="#" class="morelink" >' + moretext + '</a></span>';
      var $template = $('<li agent="'+agentName+'" class="'+classBot+'"><div class="text">'+html+'</div></li>');
		//	$(this).html(html);
		} else{
      var $template = $('<li agent="'+agentName+'" class="'+classBot+'"><div class="text">'+ m.text +'</div></li>'); } }
    else
      var $template = $('');

    toggleLoader("show", container);

   // container.children(".chat-window").scrollTop($(".chat-window").prop('scrollHeight'));

    // add delay to chat message
    setTimeout(function() {

      toggleLoader("hide", container);

      container.children('.chat-window').append($template);

      // if the message is a question then add options
      if (m.messageType == "Question")
        container.children('.chat-window').append(addOptions(container, messages, delay, m,agentName));
      
       
   // container.children(".chat-window").scrollTop($(".chat-window").prop('scrollHeight'));

      // call recursively if nextMessageId exists
      if (m.nextMessageId != "") {
        var nextMessage = findMessageInJsonById(messages, m.nextMessageId)
        generateMessageHTML(container, messages, nextMessage, delay,agentName)
      }
      
      var p =$(".chat-window .botTitle:last");//;//$(".bot:last" );//.last();
      console.log(p.text());
  
              var position =p.offset();// p.position();
              $('#flowchat').animate({
                scrollTop: $('#flowchat').scrollTop() + $(".chat-window .botTitle:last").position().top-50 //#DIV_ID is an example. Use the id of your destination on the page
            }, 'slow');
            console.log(position.top);

    }, delay);
    // end delay

  } // end function

}( jQuery ));