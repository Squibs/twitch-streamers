// list of streams to get
const channels = ["ESL_SC2", "OgamingSC2", "cretetion", "freecodecamp", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"];

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
const updateStreamerInfo = function (data) {
  const checkForMissing = [...channels];

  for (let k = 0; k < channels.length; k += 1) {
    const channel = document.getElementById(channels[k].replace(/\s/g, '').toLowerCase().toString());

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].name === channel.id) {
        channel.getElementsByClassName('streamer-img')[0].src = data[i].logo;
        channel.getElementsByClassName('streamer-name')[0].innerHTML = data[i].display_name;

        // check if image is 403
        const checkImage = new XMLHttpRequest();
        checkImage.open('HEAD', data[i].logo, false);
        checkImage.send();
        if (checkImage.status == 404 || checkImage.status == 403) {
          channel.getElementsByClassName('streamer-img')[0].src = 'img/missing.png';
        }

        for (let j = 0; j < checkForMissing.length; j += 1) {
          if (checkForMissing[j] === channels[k]) {
            checkForMissing.splice(j, 1);
            j = 0;
          }
        }
      } 
    }
  }

  for (let i = 0; i < checkForMissing.length; i += 1) {
    document.getElementById(checkForMissing[i].replace(/\s/g, '').toLowerCase().toString()).getElementsByClassName('streamer-game')[0].innerHTML = 'Channel is missing or closed!';
    document.getElementById(checkForMissing[i].replace(/\s/g, '').toLowerCase().toString()).getElementsByClassName('streamer-img')[0].src = 'img/missing.png';
  }

};

// set online status text & status icon
const updateStreamerStatus = function (data) {
  const streamer = document.getElementsByClassName('streamer');

  for (let i = 0; i < data.length; i += 1) {
    for (let k = 0; k < streamer.length; k += 1) {
      if (!streamer[k].classList.contains('online')) {
        if (data[i].stream != null) { // mostly to suppress errors
          if (data[i].stream.channel.name === streamer[k].id) {
            streamer[k].getElementsByClassName('streamer-game')[0].innerHTML = data[i].stream.game;
            streamer[k].getElementsByClassName('streamer-status')[0].innerHTML = data[i].stream.channel.status;
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
  }
};

const customXHRRequest = (slug) => {
  // slug = streams or channels
  let promises = [];

  channels.forEach(channel => {
    promises.push(new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', `https://twitch-proxy.freecodecamp.rocks/twitch-api/${slug}/${channel}`);

      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          reject(Error(xhr.statusText));
        }
      };

      xhr.onerror = function (error) {
        reject(Error(`Network Error: ${error}`));
      }

      xhr.send();
    }));
  });

  Promise.all(promises).then((data) => {
    if (slug == 'channels') {
      updateStreamerInfo(data);
    }

    if (slug == 'streams') {
      updateStreamerStatus(data);
    }
  });
};

const streamerInfo = function () {
  return customXHRRequest('channels')
};

// api call to find online streamers
const streamerStatus = function () {
  return customXHRRequest('streams');
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

streamerInfo();
streamerStatus();

document.getElementById('online').addEventListener('click', filters);
document.getElementById('offline').addEventListener('click', filters);
document.getElementById('all').addEventListener('click', filters);
