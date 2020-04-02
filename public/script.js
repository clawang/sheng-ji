const suitSrc = {
  spades: '/img/spades.png',
  hearts: '/img/hearts.png',
  clubs: '/img/clubs.png',
  diamonds: '/img/diamonds.png'
}

const playerObjects = [$('.play-hand-cards'), $('#player-2-cards'), $('#player-3-cards'), $('#player-4-cards')];

let playerId;
let currentHand;
let currentSuit;
let starter = false;
let fullDeck = [];

$(function () {
  var socket = io();

  $('#create-user').submit(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('add user', $('#username').val());
    $('#username').val('');
    $('#start-page').fadeOut();
    return false;
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
    socket.emit('start game', {});
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
        $('#message').html("You can only play one card!");
    } else {
      const suit = getSuit(result[0]);
      if(suit === currentSuit || !checkForSuit(currentHand, currentSuit)) { //can only play card if it follows rules
        $('#hand-submit').prop('disabled', true);
        $('#message').html('');
        socket.emit('submit hand', result);
      } else {
        $('#message').html("You can't play that card!");
      }
    }
    return false;
  });

  $('#view-plays').click(function(e){
    e.preventDefault(); // prevents page reloading
    socket.emit('get plays', {id: playerId});
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
    $('#start-game').fadeOut();
    fullDeck = tr.deck;
    $('#all-users').html('<li>Team 1: '+tr.users[0]+' & '+tr.users[2]+'</li><li>Team 2: '+tr.users[1]+' & '+tr.users[3]+'</li>');
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
    $('.hand-cards').html(cardsToString(data.hand, 'checkbox'));
    currentHand = data.hand;
    playerId = data.id;
  });

  socket.on('display plays', function(plays){
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
    let msg = hand.username + ' played ';
    const cardsStr = hand.cards.map(element => element.name);
    msg = msg.concat(cardsStr.shift());
    if(cardsStr.length > 0) {
      cardsStr.forEach(element => msg = msg.concat(' and ' + element));
    }
    $('#messages').append($('<li class="hand-msg">').text(msg));
    const position = (hand.id - playerId + 4) % 4;
    playerObjects[position].html(cardsToString(hand.cards, 'div'));
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
    const str = getList(exit.users);
    $('#all-users').html(str);
    $('#messages').append($('<li class="disconnection-msg">').text(exit.username + ' has left the chat'));
  });

  socket.on('end game', function(game){
    $('.center').html(game.msg);
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

// function displayCards(arr) {
//   const arrMapped = arr.map(function(element) {
//     if(element.value === 100) {
//       return '<div class="card-container"><p class="card-number joker">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div>';
//     } else if(element.value === 101) {
//       return '<div class="card-container"><p class="card-number joker" style="color: #a31919">'+'J'+'<br/>'+'O'+'<br/>'+'K'+'<br/>'+'E'+'<br/>'+'R'+'</p></div>';
//     } else {
//       return '<div class="card-container"><p class="card-number">'+element.display+'</p><img class="card-suit" src="'+element.img+'"></div>';
//     }
//   });
//   let str = '';
//   for(let i = 0; i < arrMapped.length; i++) {
//     str += arrMapped[i];
//   }
//   return str;
// }

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