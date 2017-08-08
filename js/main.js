// list of streams to get
const channels = ['DrDisRespectLIVE', 'FreeCodeCamp', 'Grimmmz', 'LobosJR', 'MOONMOON_OW', 'TheAttack', 'Jummychu', 'shroud',
  'LIRIK', 'sips_', 'Riot Games', 'trihex', 'Lethalfrag', 'Day9tv', 'LAGTVMaximusBlack'];

// create streamer dom elements
const createStreamers = function () {
  for (let i = 0; i < channels.length; i += 1) {
    const main = document.getElementById('parent');
    const streamer = document.createElement('section');
    const streamerImg = document.createElement('img');
    const innerContainer = document.createElement('div');
    const streamerName = document.createElement('header');
    const streamerGame = document.createElement('span');
    const streamerStatus = document.createElement('span');
    const streamerStatusIcon = document.createElement('div');
    const viewStreamer = document.createElement('a');
    const viewStreamerContainer = document.createElement('div');

    streamer.id = channels[i].replace(/\s/g, '').toLowerCase().toString();
    streamer.classList.add('streamer');
    streamerImg.classList.add('streamer-img');
    innerContainer.classList.add('inner-container');
    streamerName.classList.add('streamer-name');
    streamerName.innerHTML = channels[i];
    streamerGame.classList.add('streamer-game');
    streamerStatus.classList.add('streamer-status');
    streamerStatusIcon.classList.add('streamer-status-icon');
    viewStreamer.classList.add('view-streamer');
    viewStreamer.setAttribute('href', `https://www.twitch.tv/${channels[i].replace(/\s/g, '')}`);
    viewStreamer.setAttribute('target', '_blank');
    viewStreamerContainer.innerHTML = 'View Channel';
    viewStreamerContainer.classList.add('view-streamer-container');


    // default to offline
    streamerStatus.innerHTML = 'Offline';
    streamerStatusIcon.style.background = 'red';
    streamer.classList.add('offline');

    viewStreamer.appendChild(viewStreamerContainer);

    innerContainer.appendChild(streamerName);
    innerContainer.appendChild(streamerGame);
    innerContainer.appendChild(streamerStatus);
    innerContainer.appendChild(streamerStatusIcon);
    innerContainer.appendChild(viewStreamer);

    streamer.appendChild(streamerImg);
    streamer.appendChild(innerContainer);

    main.appendChild(streamer);
  }
};

// set streamer image and display name
const updateStreamerInfo = function (data, channel) {
  const streamer = document.getElementById(channel);

  streamer.getElementsByClassName('streamer-img')[0].src = data.logo;
  streamer.getElementsByClassName('streamer-name')[0].innerHTML = data.display_name;
};

// set online status text & status icon
const updateStreamerStatus = function (data) {
  const streamer = document.getElementsByClassName('streamer');

  for (let i = 0; i < data.streams.length; i += 1) {
    for (let k = 0; k < streamer.length; k += 1) {
      if (!streamer[k].classList.contains('online')) {
        if (data.streams[i].channel.name === streamer[k].id) {
          streamer[k].getElementsByClassName('streamer-game')[0].innerHTML = data.streams[i].channel.game;
          streamer[k].getElementsByClassName('streamer-status')[0].innerHTML = data.streams[i].channel.status;
          streamer[k].getElementsByClassName('streamer-status-icon')[0].style.background = 'green';
          streamer[k].classList.remove('offline');
          streamer[k].classList.add('online');
        } else {
          streamer[k].getElementsByClassName('streamer-status')[0].innerHTML = 'Offline';
          streamer[k].getElementsByClassName('streamer-status-icon')[0].style.background = 'red';
          streamer[k].classList.add('offline');
        }
      }
    }
  }
};

/*  api call to get streamer information... only getting image and display name
 *  this is making an api call for each streamer; twitch currently has no way of
 *  getting all the information I need for this project in fewer api calls.
 *  the other api call (streamerStatus) allows for a list to be returned, but
 *  it will not display information for streamers that are currently not streaming,
 *  and this api call (streamerInfo) doesn't allow for a list, and has to have an
 *  individual call for each streamer.
 *
 *  CHANGE THIS FUNCTION / API CALL IF TWITCH HAS ISSUES WITH IT
 */
const streamerInfo = function (channel) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', `https://api.twitch.tv/kraken/channels/${channel}?client_id=3blsvasj5g4dll5vzi16z9amnxtnhw`);

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(Error(xhr.statusText));
      }
    };

    xhr.onerror = function (error) {
      reject(Error(`Network Error: ${error}`));
    };

    xhr.send();
  });
};

// api call to find online streamers
const streamerStatus = function () {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    let channelList = '';

    for (let i = 0; i < channels.length; i += 1) {
      channelList += channels[i].replace(/\s/g, '').toLowerCase().toString();

      if (i < channels.length - 1) {
        channelList += ',';
      }
    }

    xhr.open('GET', `https://api.twitch.tv/kraken/streams?channel=${channelList}&client_id=3blsvasj5g4dll5vzi16z9amnxtnhw`);

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(JSON.parse(xhr.response));
      } else {
        reject(Error(xhr.statusText));
      }
    };

    xhr.onerror = function (error) {
      reject(Error(`Network Error: ${error}`));
    };

    xhr.send();
  });
};

// filter based on streamer status (offline, online, or show all)
const filters = function (e) {
  const remove = document.getElementsByClassName('active');

  for (let i = 0; i < remove.length; i += 1) {
    remove[i].classList.remove('active');
  }

  e.target.classList.add('active');

  const filterValue = e.target.id;
  const offline = document.getElementsByClassName('offline');
  const online = document.getElementsByClassName('online');

  if (filterValue === 'online') {
    for (let i = 0; i < offline.length; i += 1) {
      offline[i].style.display = 'none';
    }

    for (let i = 0; i < online.length; i += 1) {
      online[i].style.display = 'flex';
    }
  } else if (filterValue === 'offline') {
    for (let i = 0; i < online.length; i += 1) {
      online[i].style.display = 'none';
    }

    for (let i = 0; i < offline.length; i += 1) {
      offline[i].style.display = 'flex';
    }
  } else {
    for (let i = 0; i < online.length; i += 1) {
      online[i].style.display = 'flex';
    }

    for (let i = 0; i < offline.length; i += 1) {
      offline[i].style.display = 'flex';
    }
  }
};


createStreamers();

for (let i = 0; i < channels.length; i += 1) {
  const channel = channels[i].replace(/\s/g, '').toLowerCase().toString();
  streamerInfo(channel).then((data) => {
    updateStreamerInfo(data, channel);
  }).catch((error) => {
    console.log(error);
    const streamer = document.getElementById(channel);
    streamer.getElementsByClassName('streamer-game')[0].innerHTML = 'Channel is missing or closed!';
    streamer.getElementsByClassName('streamer-img')[0].src = 'img/missing.png';
  });
}

streamerStatus().then((data) => {
  updateStreamerStatus(data);
}).catch((error) => { console.log(error); });

document.getElementById('online').addEventListener('click', filters);
document.getElementById('offline').addEventListener('click', filters);
document.getElementById('all').addEventListener('click', filters);
