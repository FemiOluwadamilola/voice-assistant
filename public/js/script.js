const speechBtn = document.getElementById("speech-btn");
const words = document.getElementById("words");
const voiceSelect = document.getElementById("speech-voices");
window.SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = "en-US";
recognition.interimResults = false;

const synth = window.speechSynthesis;

let voices = [];

const p = document.createElement("p");
p.setAttribute("id", "speechInput");
words.appendChild(p);

recognition.addEventListener("result", (e) => {
  const transcript = Array.from(e.results)
    .map((result) => result[0])
    .map((result) => result.transcript)
    .join("");
  p.textContent = transcript;
});

const populateVoiceList = () => {
  voices = synth.getVoices();
  voices.forEach((voice) => {
    const option = document.createElement("option");
    option.textContent = `${voice.name}-${voice.lang}`;

    if (voices.default) {
      option.textContent += " — DEFAULT";
    }

    option.setAttribute("data-lang", voices.lang);
    option.setAttribute("data-name", voices.name);
    voiceSelect.appendChild(option);
  });
};

populateVoiceList();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

recognition.addEventListener("end", async (e) => {
  const p = document.getElementById("speechInput");
  const speech = p.textContent;
  const response = await fetch("http://localhost:5000/bot", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      speech,
    }),
  });
  const result = await response.json();
  const utterThis = new SpeechSynthesisUtterance(result.response);
  const selectedOption =
    voiceSelect.selectedOptions[0].getAttribute("data-name");

  for (let i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }

  synth.speak(utterThis);

  console.log(result.response);
});

speechBtn.addEventListener("click", (e) => {
  recognition.start();
});
