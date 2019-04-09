/* start the external action and say hello */
console.log("App is alive");

/* #10 #arr reference channels in array */
var channels = [yummy, sevencontinents, killerapp, firstpersononmars, octoberfest];

/** #7 Create global variable */
var currentChannel;

/** #7 We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #10 #abort create channel mode when switching channel
    abortCreateChannel();

    // #10 #new write channel data to app bar
    writeChannelToAppBar(channelObject);

    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 replace image with icon
    // #9 #str make star primary button
    $('#chat h1 button i').toggleClass('fas');
    $('#chat h1 button i').toggleClass('far');

    // #7 toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fas far');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fas' : 'far');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    /* #10 #suitable load emojis in function loadEmojis
    // #10 #add emojis form emojis.js
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (x in emojis)
    {
        $('#emojis').append(emojis[x] + ' ');
    }*/

    $('#emojis').toggle(); // #toggle
}

/**
 * Loads emojis from emojis.js
 */
function loadEmojis(){
    // #10 #add emojis form emojis.js
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (x in emojis){
        $('#emojis').append(emojis[x] + ' ');
    }
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}

function sendMessage() {
    // #8 Create a new message to send and log it.
    //var message = new Message("Hello chatter");

    // #8 let's now use the real message #input
    var message = new Message($('#message').val());

    // #10 #empty block empty messages
    if(message.text.length > 0)
    {
        console.log("New message:", message);

        // #8 convenient message append with jQuery:
        $('#messages').append(createMessageElement(message));

        // #10 #push add message to current channel
        currentChannel.messages.push(message);

        // #10 #increas the messageCount
        currentChannel.messageCount++;

        // #8 messages will scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
        // it would also scroll to the bottom when using a very high number (e.g. 1000000000);
        $('#messages').scrollTop($('#messages').prop('scrollHeight'));
    }
    else
    {
        console.log('empty message: ' + message.text.length);
    }

    // #8 clear the message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 message properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 message element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        /* #9 #acc accent button */
        '<button class="accent">+5 min.</button>' +
        '</div>';
}

/**
 * List channels in channels view
 * @param {*} criterion criterion to list channels ('new', 'trending', 'favourites')
 */
function listChannels(criterion) {
    // #8 channel onload
    //$('#channels ul').append("<li>New Channel</li>")

    /* #10 #for use forloop to append the channels to channels' list
    // #8 five new channels
    $('#channels ul').append(createChannelElement(yummy));
    $('#channels ul').append(createChannelElement(sevencontinents));
    $('#channels ul').append(createChannelElement(killerapp));
    $('#channels ul').append(createChannelElement(firstpersononmars));
    $('#channels ul').append(createChannelElement(octoberfest));*/

    // #10 #parameter sort channels array before writing it to channels list
    switch(criterion)
    {
        case 'new':
            channels.sort(sortNew);
            break;
        case 'trending':
            channels.sort(sortTrending);
            break;
        case 'favorites':
            channels.sort(sortFavourites);
            break;
    }

    // #10 #duplicate clear list before adding channels
    $('#channels ul').empty();

    // #10 #for use forloop to append the channels to channels' list
    for(i = 0; i < channels.length; i++){
        $('#channels ul').append(createChannelElement(channels[i]));
    }
}

/**
 * #8 This function makes a new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="far fa-star"></i>
            <i class="fas fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa-star').addClass(channelObject.starred ? 'fas' : 'far').appendTo(meta);

    // #8 channel boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fas').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}


/** #10 #compare compare functions for sorting channels
 * Sorts channels by descending createdOn date
 * @param {*} channel1 
 * @param {*} channel2 
 */
function sortNew(channel1, channel2)
{
    return channel2.createdOn-channel1.createdOn;
}

/** #10 #compare compare functions for sorting channels
 * Sorts channels by descending messageCount
 * @param {*} channel1 
 * @param {*} channel2 
 */
function sortTrending(channel1, channel2)
{
    return channel2.messageCount-channel1.messageCount;
}

/** #10 #compare compare functions for sorting channels
 * Sorts channels by starring
 * @param {*} channel1 
 * @param {*} channel2 
 */
function sortFavourites(channel1, channel2)
{
    if(channel2.starred && !channel1.starred)
    {
        return 1;
    }
    else
    {
        return -1;
    }
}


/**
 * #10 #new creats new channel
 */
function startCreateChannel(){

    $('#messages').empty();

    $('#right-app-bar').hide();
    $('#right-app-bar-new').css('display','flex');
    
    $('#send-message-button').hide();
    $('#create-channel-button').show();

    // #10 fix bug that switched to far
    $('#abort').removeClass('far').addClass('fas');
}

/**
 * #10 #abbort creating new channel
 */
function abortCreateChannel(){

    $('#right-app-bar').show();
    $('#right-app-bar-new').css('display','none');

    $('#send-message-button').show();
    $('#create-channel-button').hide();

    $('#new-channel-name').val('');
    $('#message').val('');
}

/**
 * #10 #new create new channel and check channel name and message
 */
function createChannel()
{
    var channelName = $('#new-channel-name').val();
    var messageText = $('#message').val();

    if(checkValidChannelName(channelName) && checkValidMessage(messageText))
    {
        channelNew = new Channel(channelName);
        channels.push(channelNew);
        currentChannel = channelNew;

        $('#channels ul').append(createChannelElement(channelNew));

        sendMessage(messageText);

        abortCreateChannel();
        writeChannelToAppBar(channelNew);

        console.log("New channel: ", currentChannel);
    }
}

/**
 * #10 #new write new channel name to app bar
 * @param {*} channelObject 
 */
function writeChannelToAppBar(channelObject)
{
    // #7  Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7  change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    $('#channel-starring').removeClass('far fas');
    $('#channel-starring').addClass(channelObject.starred ? 'fas' : 'far');
}


/**
 * #10 #vaild check channel name
 */
function checkValidChannelName(channelName)
{
    return channelName.length > 0 && 
    channelName[0] == '#' &&
    channelName.indexOf(' ') < 0;
}

/**
 * #10 #valid check message
 */
function checkValidMessage(messageText)
{
    return messageText.length > 0;
}

/**
 * #10 #new create new channel object
 * @param {*} name 
 */
function Channel(name){
    this.name = name;
    this.createdOn = new Date();
    this.createdBy = currentLocation.what3words;
    this.starred = false;
    this.expiresIn = 5;
    this.messageCount = 0;
    this.messages = [];
}