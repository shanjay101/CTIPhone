

import {   SimpleUser, SimpleUserOptions } from "sip.js/lib/platform/web";

const form = document.getElementById('call-now-form')

const numberInput = document.getElementById('user-number')
const callNow = document.getElementById('call-now')
const callHangup = document.getElementById('call-hangup')

const userName = document.getElementById('user-name')
const userPassword = document.getElementById('user-password')

let simpleUser: SimpleUser;


function getAudioElement(id: string): HTMLAudioElement {
  const el = document.getElementById(id);
  if (!(el instanceof HTMLAudioElement)) {
    throw new Error(`Element "${id}" not found or not an audio element.`);
  }
  return el;
}


async function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}



async function main(number: Number): Promise<void> {

  const server = "wss://3frontoffice.nr.tre.se";
  
  const authorizationUsername = userName.value;
  const aor =  "sip:"+userName.value +"@3kontaktpartnernr.dk";
  const authorizationPassword = userPassword.value;


  console.log(aor);
  const remoteAudio = new window.Audio();
  remoteAudio.autoplay = true;
  const callOptions = {
    mediaConstraints: { audio: true, video: false },
    rtcOfferConstraints: { offerToReceiveAudio: true, offerToReceiveVideo: false }
};
      

  const options: SimpleUserOptions = {
    aor,
    media: {
     
      remote: { audio: getAudioElement("remoteAudio") }
    },
    userAgentOptions: {
      authorizationPassword,
      authorizationUsername,
      hackIpInContact: true
    }
  };


  simpleUser = new SimpleUser(server, options);


  simpleUser.delegate = {
    onCallReceived: async () => {
      await simpleUser.answer();
    }
  };

  await simpleUser.connect();


  await simpleUser.register();
 
  //await simpleUser.call("sip:00923025607881@3kontaktpartnernr.dk", { inviteWithoutSdp: true});

  await simpleUser?.call(`sip:${number}@3kontaktpartnernr.dk`, { inviteWithoutSdp: true});

}

let userNumber = 0

// Get user contact
numberInput?.addEventListener('change', (e) => {
  //userNumber = parseInt(e.target?.value)
  userNumber = e.target?.value

})




// Call user
form?.addEventListener('submit', (e) => {
  e.preventDefault()
debugger
  main(userNumber)
  .then(() => {
    console.log(`Success`)
     //await simpleUser?.connect();

    callNow?.disabled = true
  })
  .catch((error: Error) => console.error(`Failure`, error));
})

callHangup?.addEventListener('click', async (e) => {
  e.preventDefault()

  callNow?.disabled = false
  await simpleUser?.hangup()
})

