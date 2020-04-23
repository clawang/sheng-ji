const suitSrc = {
  spades: '/img/spades.png',
  hearts: '/img/hearts.png',
  clubs: '/img/clubs.png',
  diamonds: '/img/diamonds.png'
}

const valueToDisplay = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const playerObjects = [$('.play-hand-cards'), $('#player-2-cards'), $('#player-3-cards'), $('#player-4-cards')];
const playerNames = [$('div.player-2 > h2'), $('div.player-3 > h2'), $('div.player-4 > h2'), $('div.play-hand > h2')]

let playerId;
let currentHand;
let currentSuit;
let starter = false;
let fullDeck = [];
let playerType = '';

$(function () {
  var socket = io();

  $( document ).ready(function() {
    $('button').css('cursor', 'pointer');
    $('#declarers').css('cursor', 'pointer');
    $('#opponents').css('cursor', 'pointer');
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

  $('#join-player').click(function(e) {
    e.preventDefault();
    socket.emit('user type', 'player');
  });

  $('#join-spectator').click(function(e) {
    e.preventDefault();
    socket.emit('user type', 'spectator');
  });

  $('#declarers').click(function(e) {
    socket.emit('set team', 0);
  });

  $('#opponents').click(function(e) {
    socket.emit('set team', 1);
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
    socket.emit('start game', {trumpValue: $('#setTrumpValue').val(), trumpSuit: $('#setTrumpSuit').val()});
    return false;
  });

  $('#hand-form').submit(function(e){
    e.preventDefault(); // prevents page reloading
    const arr = $('.card-checkbox:checkbox:checked');
    const result = [];
    for(let i = 0; i < arr.length; i++) {
      result[i] = arr[i].value;
    }
    if(result.length > 1) {
        $('#center-msg').html("<span class='red'>You can only play one card!<span>");
    } else if(result.length < 1) {
        $('#center-msg').html("<span class='red'>You didn't select a card!</span>");
    }else {
      const suit = getSuit(result[0]);
      if(suit === currentSuit || !checkForSuit(currentHand, currentSuit)) { //can only play card if it follows rules
        $('#hand-submit').prop('disabled', true);
        $('#center-msg').html('');
        socket.emit('submit hand', {cards: result, id: playerId});
      } else {
        $('#center-msg').html("<span class='red'>You can't play that card!</span>");
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

  $('#help-link').click(function(e) {
    e.preventDefault();
    $('#instructions').fadeIn();
  });

  $('#instructions-close').click(function(e) {
    e.preventDefault();
    $('#instructions').fadeOut();
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
    socket.emit('restart game', {});
    return false;
  });

  socket.on('registration error', function() {
    $('#registration-error').text('That username is taken!');
  });

  socket.on('login error', function(msg) {
    $('#login-error').text(msg);
  });

  socket.on('get user type', function(activeUsers) {
    if(activeUsers > 4) {
      $('#join-player').prop('disabled', true);
    }
    $('#start-page').fadeOut();
  });

  socket.on('setting error', function(msg) {
    $('#setting-error').text(msg);
  });

  socket.on('join team', function(teams) {
    $('#game-settings-player').fadeOut();
    const teamUsers = ['', ''];
    for(let i = 0; i < 2; i++) {
      if(teams[i].usernames.length > 0) {
        teamUsers[i] = '<ul>' + getList(teams[i].usernames) + '</ul>';
      } else {
        teamUsers[i] = '<p>No players yet.</p>';
      }
    }
    $('#declarers > div').html(teamUsers[0]);
    $('#opponents > div').html(teamUsers[1]);
    $('#team').fadeIn();
  });

  socket.on('team error', function(msg) {
    $('#team-error').text(msg);
  });

  socket.on('user joined', function(sock){
    $('#messages').append($('<li class="connection-msg">').text(sock.username + ' has joined the game'));
    const str = getList(sock.users);
    $('#all-users').html(str);
  });

  socket.on('spectator joined', function(sock){
    $('#messages').append($('<li class="connection-msg">').text(sock + ' has joined as a spectator'));
  });

  socket.on('remove settings', function() {
    $('#edit-settings').fadeOut();
  });

  socket.on('spectate mode', function(){
    $('#game-settings').fadeOut();
    $('.my-player').html('');
    $('#view-plays').css('display','none');
    $('#start-game').css('display','none');
    playerType = 'spectator';
  });

  socket.on('setup player', function(data) {
    $('#game-settings').fadeOut();
    $('#my-username').html(data.username);
    $('#my-score').html(data.points);
    playerId = data.id;
    playerType = 'player';
  });

  socket.on('resetup player', function(data) {
    $('#start-page').fadeOut();
    $('#start-game').css('display','none');
    $('.hand-cards').html(cardsToString(data.hand, 'checkbox'));
    currentHand = data.hand;
  });

  socket.on('setup game', function(tr){
    $('#trump-suit').html('<img src="' + suitSrc[tr.trumpSuit] + '"">');
    $('#trump-rank').html(valueToDisplay[tr.trumpValue]);
    $('#points').html(tr.points);
    $('#center-msg').html('');
    $('#start-game').fadeOut();
    fullDeck = tr.deck;
    if(playerType === 'player') {
      $('#view-plays').fadeIn();    
      $('#view-plays').prop('disabled', false);
    }
    $('#all-users').css('display','flex');
    $('#all-users').html('<div><h2>Declarers – '+tr.teams[tr.declarers].score+'</h2><li>'+tr.teams[tr.declarers].usernames[0] + '</li><li>' + tr.teams[tr.declarers].usernames[1]+'</li></div><div><h2>Opponents – '+tr.teams[(tr.declarers+1)%2].score+'</h2><li>'+tr.teams[(tr.declarers+1)%2].usernames[0]+'</li><li>'+tr.teams[(tr.declarers+1)%2].usernames[1]+'</li></div>');
    for(let i = 0; i < 4; i++) {
      const position = (i - playerId + 3) % 4;
      if(playerType === 'player' && position !== 3) {
          playerNames[position].html(tr.users[i]);
      } else if(playerType === 'spectator') {
        playerNames[(i + 3) % 4].html(tr.users[i]);
      }
    }
  });

  socket.on('game message', function(data){
    let name;
    let msg;
    if(data.winner === playerId) {
      name = 'You';
      msg = '<div class="green">';
    } else {
      name = data.user;
      msg = '<div>';
    }
    msg += '<p>' + name+' won the round!</p><h4>'+data.subtitle+'</h4></div>';
    $('#center-msg').html(msg);
  });

  socket.on('chat message', function(msg){
    $('#messages').append($('<li class="chat-msg">').text(msg.username + ": " + msg.body));
    $('#messages-container').scrollTop($('#messages').prop('scrollHeight'));
  });

  socket.on('display plays', function(plays){
    let str = '';
    if(plays.length > 0) {
      plays.forEach(function(round) {
        str += '<div><h2>Round '+(round.index+1)+'</h2><div>'+cardsToString(round.cards, 'div')+'</div>';
      });
    } else {
      str += 'No plays were made yet!';
    }
    $('#pop-up-inner').html(str);
    $('#pop-up').fadeIn();
  });

  socket.on('my recent play', function(data) {
    $('.hand-cards').html(cardsToString(data.hand, 'checkbox'));
    currentHand = data.hand;
    $('.play-hand-cards').html(cardsToString(data.cards, 'div'));
  });

  socket.on('hand played', function(hand) {
    let position;
    if(playerType === 'player') {
      position = (hand.id - playerId + 4) % 4;
    } else {
      position = hand.id;
    }
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
    $('#hand-submit').prop('disabled', false);
    currentSuit = data.suit;
    if(data.plays < 1) {
      // starter = true;
    } else {
      $('#center-msg').html("<p class='green'>It's your turn!</p>");
      // starter = false;
    }
  });

  socket.on('next turn', function(data) {
    if(data.turn !== playerId) {
      $('#center-msg').html("<p>It's " + data.usrnm + "'s turn</p>");
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
    $('#messages').append($('<li class="disconnection-msg">').text(exit.username + ' has left the game'));
  });

  socket.on('end game', function(game){
    $('#center-msg').html(game.msg);
    if(!game.finish) {
      $('#restart-game').fadeIn();
    }
  });

  socket.on('update score', function(pts){
    console.log(pts);
    $('#my-score').html(pts);
  });

  socket.on('pause game', function(names) {
    $('#hand-submit').prop('disabled', true);
    let word = 'have';
    if(names.length === 1) {
      word = 'has';
    } 
    $('#center-msg').html('<p>Game paused.</p><h4>' + arrToList(names) + ' ' + word + ' left.</h4>');
  });

  socket.on('unpause game', function(name) {
    $('#center-msg').html('');
  });

});

function arrToList(arr) {
  let msg = '';
  msg = arr[0];
  for(let i = 1; i < arr.length; i++) {
    msg += ', ' + arr[i];
  }
  return msg;
}

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
  const card = fullDeck.find(ele => ele.index === parseInt(value));
  return card.adjSuit;
}

function checkForSuit(cards, suit) {
  for(let i = 0; i < cards.length; i++) {
    if(cards[i].adjSuit === suit) {
      return true;
    } 
  }
  return false;
}