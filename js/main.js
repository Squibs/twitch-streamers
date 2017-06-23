const channels = ['DrDisRespectLIVE', 'FreeCodeCamp', 'Grimmmz', 'LobosJR', 'MOONMOON_OW', 'TheAttack', 'Jummychu', 'shroud',
  'LIRIK', 'sips_', 'Riot Games', 'trihex', 'Lethalfrag', 'Day9tv', 'LAGTVMaximusBlack'];

const createStreamers = function () {
  for (let i = 0; i < channels.length; i += 1) {
    const main = document.getElementById('parent');
    const streamer = document.createElement('section');
    const streamerImg = document.createElement('img');
    const innerContainer = document.createElement('div');
    const streamerName = document.createElement('header');
    const streamerStatusIcon = document.createElement('div');
    const streamerStatus = document.createElement('span');
    const viewStreamer = document.createElement('a');
    const viewStreamerContainer = document.createElement('div');

    streamer.id = channels[i].replace(/\s/g, '').toLowerCase().toString();
    streamer.classList.add('streamer');
    streamerImg.classList.add('streamer-img');
    innerContainer.classList.add('inner-container');
    streamerName.classList.add('streamer-name');
    streamerName.innerHTML = channels[i];
    streamerStatusIcon.classList.add('streamer-status-icon');
    streamerStatus.classList.add('streamer-status');
    viewStreamer.classList.add('view-streamer');
    viewStreamer.innerHTML = 'View Channel';
    viewStreamer.setAttribute('href', `https://www.twitch.tv/${channels[i].replace(/\s/g, '')}`);
    viewStreamer.setAttribute('target', '_blank');
    viewStreamerContainer.classList.add('view-streamer-container');

    viewStreamerContainer.appendChild(viewStreamer);

    innerContainer.appendChild(streamerName);
    innerContainer.appendChild(streamerStatusIcon);
    innerContainer.appendChild(streamerStatus);
    innerContainer.appendChild(viewStreamerContainer);

    streamer.appendChild(streamerImg);
    streamer.appendChild(innerContainer);

    main.appendChild(streamer);
  }
};

const updateStreamerInfo = function (data, channel) {
  const streamer = document.getElementById(channel);

  streamer.getElementsByClassName('streamer-img')[0].src = data.logo;
  streamer.getElementsByClassName('streamer-name')[0].innerHTML = data.display_name;
};

const updateStreamerStatus = function (data) {
  const streamer = document.getElementsByClassName('streamer');

  // set streamer image

  // set online status text & status icon
  for (let i = 0; i < data.streams.length; i += 1) {
    for (let k = 0; k < streamer.length; k += 1) {
      if (streamer[k].getElementsByClassName('streamer-status')[0].innerHTML !== 'Online') {
        if (data.streams[i].channel.name === streamer[k].id) {
          streamer[k].getElementsByClassName('streamer-status')[0].innerHTML = 'Online';
          streamer[k].getElementsByClassName('streamer-status-icon')[0].style.background = 'green';
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

createStreamers();


for (let i = 0; i < channels.length; i += 1) {
  const channel = channels[i].replace(/\s/g, '').toLowerCase().toString();
  streamerInfo(channel).then((data) => {
    updateStreamerInfo(data, channel);
  }).catch((error) => { alert(error); });
}


streamerStatus().then((data) => {
  updateStreamerStatus(data);
}).catch((error) => { alert(error); });

