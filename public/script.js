// const suitSrc = {
//   spades: '/img/spades.png',
//   hearts: '/img/hearts.png',
//   clubs: '/img/clubs.png',
//   diamonds: '/img/diamonds.png'
// }

const playerObjects = [$('.play-hand-cards'), $('#player-2-cards'), $('#player-3-cards'), $('#player-4-cards')];
const playerNames = [$('div.player-2 > h2'), $('div.player-3 > h2'), $('div.player-4 > h2')]

let playerId;
let currentHand;
let currentSuit;
let starter = false;
let fullDeck = [];

$(function () {
  var socket = io();

  $( document ).ready(function() {
    // console.log('page load');
  });

  $('#create-user').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('add user', {username: $('#create-user > #username').val(), password: $('#create-user > #password').val()});
    return false;
  });

  $('#login-user').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('login', {username: $('#login-user > #username').val(), password: $('#login-user > #password').val()});
    return false;
  });

  $('#login-link').click(function(e) {
    e.preventDefault();
    $('#registration').fadeOut();
    $('#login').fadeIn();
  });

  $('#register-link').click(function(e) {
    e.preventDefault();
    $('#login').fadeOut();
    $('#registration').fadeIn();
  });

  $('#create-team').submit(function(e) {
    e.preventDefault();
    socket.emit('add team', $('#team-name').val());
    $('#start-page').fadeOut();
    return false;
  });

  $('#new-team-btn').submit(function(e) {
    e.preventDefault();
    $('#team').html(createTeamPage);
    return false;
  });

  $('#start-game').click(function(e){
    e.preventDefault(); // prevents page reloading
    $('#center-msg').html('Waiting...');
    $('#start-game').fadeOut();
    socket.emit('start game', {});
    return false;
  });

  $('#hand-form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    const arr = $('.card-checkbox:checkbox:checked');
    const result = [];
    for(let i = 0; i < arr.length; i++) {
      result[i] = arr[i].value;
      console.log(arr[i].value);
    }
    if(result.length > 1) {
        $('#message').html("You can only play one card!");
    } else if(result.length < 1) {
        $('#message').html("You didn't select a card!");
    }else {
      const suit = getSuit(result[0]);
      if(suit === currentSuit || !checkForSuit(currentHand, currentSuit)) { //can only play card if it follows rules
        $('#hand-submit').prop('disabled', true);
        $('#message').html('');
        socket.emit('submit hand', {cards: result, id: playerId});
      } else {
        $('#message').html("You can't play that card!");
      }
    }
    return false;
  });

  $('#view-plays').click(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('get plays', playerId);
    return false;
  });

  $('#pop-up-close').click(function(e){
    e.preventDefault(); // prevents page reloading
    $('#pop-up').fadeOut();
    return false;
  });

  $('#chatbox').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
  });

  $('#restart-game').click(function(e){
    e.preventDefault(); // prevents page reloading
    $('#center-msg').html('');
    $('#restart-game').fadeOut();
    $('#center-msg').html('Waiting...');
    for(let i = 0; i < 4; i++) {
      playerObjects[i].html('');
    }
    $('#message').html('');
    socket.emit('restart game', {});
    return false;
  });

  socket.on('registration error', function() {
    $('#registration-error').text('That username is taken!');
  });

  socket.on('login error', function(msg) {
    $('#login-error').text(msg);
  });

  socket.on('join team', function(teams) {
    $('#team').fadeIn();
    if(teams.length < 1) {
      $('#team-header').text('Name your team');
      $('#create-team').fadeIn();
    } else if(teams.length === 1) {
      let str = getList(teams[0]);
      $('#team-header').text('Would you like to join a team or create a new one?');
      $('#team-container').html('<div id="team-1">'+str+'</div><button id="new-team-btn">Create Team</button>');
    } else {
      let str1 = getList(teams[0]);
      let str2 = getList(teams[1]);
      $('#team').html('<h1>Which team would you like to join?</h1><div id="team-page"><div id="team-1">'+str1+'</div><div id="team-2">'+str2+'</div></div>');
    }
  });

  socket.on('setup game', function(tr){
    $('#trump-suit').html(tr.trumpSuit);
    $('#trump-rank').html(tr.trumpValue);
    $('#points').html(tr.points);
    $('#center-msg').html('');
    $('#start-game').fadeOut();
    fullDeck = tr.deck;
    $('#current-users-head').html('Teams');
    $('#all-users').html('<li>Declarers: '+tr.teams[tr.declarers].usernames[0] + ' & ' + tr.teams[tr.declarers].usernames[1]+'</li><li>Opponents: '+tr.teams[(tr.declarers+1)%2].usernames[0]+' & '+tr.teams[(tr.declarers+1)%2].usernames[1]+'</li>');
    for(let i = 0; i < 4; i++) {
      const position = (i - playerId + 3) % 4;
      console.log(position);
      console.log(tr.users[i]);
      if(position !== 3) {
        playerNames[position].html(tr.users[i]);
      }
    }
  });

  socket.on('game message', function(msg){
    $('#messages').append($('<li class="hand-msg">').text(msg));
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li>').text(msg.username + ": " + msg.body));
  });

  socket.on('user joined', function(sock){
    $('#messages').append($('<li class="connection-msg">').text(sock.username + ' has joined the game'));
    const str = getList(sock.users);
    $('#all-users').html(str);
  });

  socket.on('spectator joined', function(sock){
    $('#messages').append($('<li class="connection-msg">').text(sock.username + ' has joined as a spectator'));
    const str = getList(sock.users);
    $('#all-users').html(str);
  });

  socket.on('spectate mode', function(){
    $('.hand').html('');
    $('.play').html('');
  });

  socket.on('setup player', function(data) {
    $('#start-page').fadeOut();
    $('#my-username').html(data.username);
    $('#my-score').html(data.points);
    playerId = data.id;
  });

  socket.on('resetup player', function(data) {
    $('#start-game').css('display','none');
    $('.hand-cards').html(cardsToString(data.hand, 'checkbox'));
    currentHand = data.hand;
  });

  socket.on('display plays', function(plays){
    console.log(plays);
    let str = '';
    plays.forEach(function(round) {
      str += '<div><h2>Round '+(round.index+1)+'</h2><div>'+cardsToString(round.cards, 'div')+'</div>';
    });
    $('#pop-up-inner').html(str);
    $('#pop-up').fadeIn();
  });

  socket.on('my recent play', function(data) {
    $('.hand-cards').html(cardsToString(data.hand, 'checkbox'));
    currentHand = data.hand;
    $('.play-hand-cards').html(cardsToString(data.cards, 'div'));
  });

  socket.on('hand played', function(hand) {
    const position = (hand.id - playerId + 4) % 4;
    playerObjects[position].html(cardsToString(hand.cards, 'div'));
    if(hand.played < 1) {
      for(let i = 0; i < 4; i++) {
        if(i !== position) {
          playerObjects[i].html('');
        }
      }
    }
  });

  socket.on('your turn', function(data) {
    $('#message').html("<p style='color:green'>It's your turn!</p>");
    $('#hand-submit').prop('disabled', false);
    currentSuit = data.suit;
    if(data.plays < 1) {
      starter = true;
    } else {
      starter = false;
    }
  });

   socket.on('new round', function(pt) {
    $('#points').html(pt);
  });

  socket.on('user left', function(exit){
    if(exit.state === 'unstarted') {
      const str = getList(exit.users);
      $('#all-users').html(str);
    }
    $('#messages').append($('<li class="disconnection-msg">').text(exit.username + ' has left the chat'));
  });

  socket.on('end game', function(game){
    $('#center-msg').html(game.msg);
    $('#restart-game').fadeIn();
  });

  socket.on('update score', function(pts){
    console.log(pts);
    $('#my-score').html(pts);
  });

  socket.on('pause game', function(name) {
    $('#hand-submit').prop('disabled', true);
    $('#center-msg').html(name+' left. Game paused.');
  });

  socket.on('unpause game', function(name) {
    $('#center-msg').html('');
  });

});

function getList(arr) {
  const arrMapped = arr.map(element => '<li>' + element + '</li>');
  let str = '';
  for(let i = 0; i < arrMapped.length; i++) {
    str += arrMapped[i];
  }
  return str;
}

function cardsToString(arr, type) {
  const arrMapped = arr.map(function(element) {
    if(type === 'checkbox') {
      return cardsToCheckbox(element);
    } else if(type === 'div') {
      return cardsToDiv(element);
    } 
  });
  let str = '';
  for(let i = 0; i < arrMapped.length; i++) {
    str += arrMapped[i];
  }
  return str;
}

function cardsToDiv(element) {
  if(element.value === 100) {
    return '<div class="card-container"><p class="card-number joker">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div>';
  } else if(element.value === 101) {
    return '<div class="card-container"><p class="card-number joker" style="color: #a31919">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div>';
  } else {
    return '<div class="card-container"><p class="card-number">'+element.display+'</p><img class="card-suit" src="'+element.img+'"></div>';
  }
}

function cardsToCheckbox(element) {
  if(element.value === 100) {
    return '<label><input type="checkbox" name="card-picked" class="card-checkbox" value="'+element.index+'"><div class="card-container"><p class="card-number joker">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div></label>';
  } else if(element.value === 101) {
    return '<label><input type="checkbox" name="card-picked" class="card-checkbox" value="'+element.index+'"><div class="card-container"><p class="card-number joker" style="color: #a31919">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div></label>';
  } else {
    return '<label><input type="checkbox" name="card-picked" class="card-checkbox" value="'+element.index+'"><div class="card-container"><p class="card-number">'+element.display+'</p><img class="card-suit" src="'+element.img+'"></div></label>';
  }
}

function getSuit(value) {
  console.log(fullDeck);
  const card = fullDeck.find(ele => ele.index === parseInt(value));
  return card.suit;
}

function checkForSuit(cards, suit) {
  for(let i = 0; i < cards.length; i++) {
    if(cards[i].suit === suit) {
      return true;
    } 
  }
  return false;
}