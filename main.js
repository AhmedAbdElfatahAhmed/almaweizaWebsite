let fixedNav = document.querySelector("nav"),
  bars = document.querySelector(".bars"),
  links = document.querySelectorAll("nav ul li"),
  sections = document.querySelectorAll("section"),
  theUl = document.querySelector("nav ul"),
  exploreButton = document.querySelector(".tittle button"),
  hadithContainer = document.querySelector(".hadithContainer"),
  nextButton = document.querySelector(".next"),
  prevButton = document.querySelector(".prev"),
  numberSpan = document.querySelector("span.number"),
  readQuran = document.querySelector(".quran .display-quran .read-quran"),
  listenQuran = document.querySelector(".quran .display-quran .listen-quran"),
  surahsContainerRead = document.querySelector(".quran .surahsContainer-read"),
  surahsContainerListen = document.querySelector(
    ".quran .surahsContainer-listen"
  ),
  thePopup = document.querySelector(".popup"),
  closedBtn = document.querySelector(".popup .closed"),
  paryerTimes = document.querySelectorAll(".paryer-times p.time"),
  scrollBtn = document.querySelector(".scroll-btn i");
let hadithIndex = 0;
// to make background on navbar when scrolling
window.addEventListener("scroll", () => {
  window.pageYOffset > 100
    ? fixedNav.classList.add("active-nav")
    : fixedNav.classList.remove("active-nav");
  window.pageYOffset > 300
    ? scrollBtn.classList.add("active-btn")
    : scrollBtn.classList.remove("active-btn");
});

// toggle navbar when clicked on bars
bars.onclick = () => {
  theUl.classList.toggle("clicked");
};
// when cliked on scrollBtn , go to above
scrollBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

//when cliked on link , go to target section
links.forEach((link) => {
  link.onclick = () => {
    let targetSection = link.dataset.section;
    sections.forEach((section) => {
      if (targetSection == section.className) {
        section.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
    // remove active class

    document.querySelectorAll(".active").forEach((el) => {
      el.classList.remove("active");
    });

    // add active class
    link.classList.add("active");
    // to remove class ckicked when clicked on any link
    theUl.classList.remove("clicked");
  };
});

// when clicked on explore button , go to hadith section
exploreButton.onclick = () => {
  hadithContainer.parentElement.parentElement.scrollIntoView({
    behavior: "smooth",
  });
};

// declaration input in hadith section
let hadithInput = document.querySelector(".hadith .choose-hadith input"),
  goButton = document.querySelector(".hadith .choose-hadith button.go"),
  showAlert = document.querySelector(".hadith .choose-hadith .show-alert");
// function to go to choosen hadith
function goToChosenHadith() {
  if (hadithInput.value >= 1 && hadithInput.value <= 300) {
    showAlert.style.visibility = "hidden";
    numberSpan.innerText = hadithInput.value;
    hadithIndex = hadithInput.value - 1;
    changeHadith();
  } else {
    showAlert.style.visibility = "visible";
  }
  hadithInput.value = "";
}

goButton.onclick = () => {
  goToChosenHadith();
};

hadithInput.onkeypress = function (e) {
  if (e.code == "Enter") {
    goToChosenHadith();
  }
};

// calling function
getHadith();
let hadithsArray;
//function to get Hadith from API
function getHadith() {
  let myRequest = new XMLHttpRequest();
  myRequest.open(
    "Get",
    "https://api.hadith.sutanlab.id/books/muslim?range=1-300"
  );
  myRequest.send();
  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let Object = JSON.parse(this.responseText);
      hadithsArray = Object.data.hadiths;
      changeHadith();
    }
  };
}
nextButton.onclick = () => {
  hadithIndex == hadithsArray.length - 1 ? (hadithIndex = 0) : hadithIndex++;
  changeHadith();
};

prevButton.onclick = () => {
  hadithIndex == 0 ? (hadithIndex = hadithsArray.length - 1) : hadithIndex--;
  changeHadith();
};

// function to change hadith
function changeHadith() {
  hadithContainer.innerText = hadithsArray[hadithIndex].arab;
  numberSpan.innerText = `${hadithsArray.length} / ${hadithIndex + 1} `;
}

// choose read quran when clicked on readQuran

readQuran.onclick = () => {
  if (surahsContainerRead.classList.contains("display-none")) {
    surahsContainerRead.classList.remove("display-none");
    surahsContainerListen.classList.add("display-none");
    document.querySelector(".quran .read-quran").classList.add("quran-active");
    document
      .querySelector(".quran .listen-quran")
      .classList.remove("quran-active");
  }
};
listenQuran.onclick = () => {
  if (surahsContainerRead.classList.contains("display-none") == false) {
    surahsContainerRead.classList.add("display-none");
    surahsContainerListen.classList.remove("display-none");
    document
      .querySelector(".quran .listen-quran")
      .classList.add("quran-active");
    document
      .querySelector(".quran .read-quran")
      .classList.remove("quran-active");
  }
};

let apiLink = "https://api.quran.sutanlab.id/surah";
function getSurahName() {
  fetch(apiLink)
    .then((response) => response.json())
    .then((allData) => {
      // console.log(allData);
      // console.log(allData.data[surahIndex].name.long);

      // create 114 div with class name called surah
      for (let i = 0; i < 114; i++) {
        let Div = document.createElement("div");
        Div.className = "surah";
        // create first paragraph
        let firstPara = document.createElement("p");
        firstPara.innerText = allData.data[i].name.long;
        // create second paragraph
        let secondPara = document.createElement("p");
        secondPara.innerText = allData.data[i].name.transliteration.en;
        // append paragraph into Div
        Div.appendChild(firstPara);
        Div.appendChild(secondPara);
        // append Div into surahsContainer
        surahsContainerRead.appendChild(Div);
        Div.onclick = () => {
          getSurah(i + 1);

          window.scrollTo({
            top: 0,
          });
          thePopup.style.right = 0;
        };

        //get surah name in surahsContainer-listen container

        document.querySelector(".surahsContainer").innerHTML += `
        <div class="surah-nameInlisten"> 
        <p>${allData.data[i].name.long}</p>
        <p>${allData.data[i].name.transliteration.en}</P>
        </div>
        `;
      }

      document.querySelectorAll(".surah-nameInlisten").forEach((sur, index) => {
        sur.onclick = () => {
          getSurahAudio(index + 1);
          playSurah.classList.remove("poiner_event");
          nextAyah.classList.remove("poiner_event");
          prevAyah.classList.remove("poiner_event");
        };
      });
    });
}

getSurahName();
function getSurah(surahNumber) {
  fetch(apiLink + `/${surahNumber}`)
    .then((response) => response.json())
    .then((allData) => {
      // console.log(allData);
      // console.log(allData.data.number);
      let ayahsCount = allData.data.verses.length;
      let popupDiv = document.createElement("div");
      document.querySelector(".quran").appendChild(popupDiv);
      popupDiv.className = "theSurah";
      for (let i = 0; i < ayahsCount; i++) {
        let theP = document.createElement("p");
        theP.className = "ayah";
        let text = document.createTextNode(
          `(${allData.data.verses[i].number.inSurah}) ${allData.data.verses[i].text.arab}`
        );
        theP.appendChild(text);
        setTimeout(() => {
          popupDiv.appendChild(theP);
        }, 500);

        if (allData.data.number !== 1) {
          popupDiv.innerHTML =
            '<p class="ayah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>';
        }
      }

      // to close popup of surah
      closedBtn.onclick = () => {
        thePopup.style.right = "-100%";
        popupDiv.remove();
        window.scrollTo({
          top: 2158,
        });
      };
    });
}
let quranAudio = document.querySelector(".quran .audio-container audio"),
  nextAyah = document.querySelector(".quran .controls .next"),
  prevAyah = document.querySelector(".quran .controls .prev"),
  playSurah = document.querySelector(".quran .controls .play"),
  ayahsCount,
  ayahAudioArray,
  ayahTextArray,
  ayahIndex;
function getSurahAudio(surahNumber) {
  fetch(apiLink + `/${surahNumber}`)
    .then((response) => response.json())
    .then((allData) => {
      (ayahsCount = allData.data.verses.length),
        (ayahAudioArray = []),
        (ayahTextArray = []);
      for (let i = 0; i < ayahsCount; i++) {
        let ayahAudio = allData.data.verses[i].audio.primary,
          ayahText = allData.data.verses[i].text.arab;
        ayahAudioArray.push(ayahAudio);
        ayahTextArray.push(ayahText);
      }
      ayahIndex = 0;
      changeAyah(ayahIndex);
    })
    .then((response) => {
      togglePlay();
    });
}

quranAudio.addEventListener("ended", () => {
  if (ayahIndex < ayahsCount - 1) {
    ayahIndex++;
    changeAyah(ayahIndex);
  } else {
    document.querySelector(".quran .audio-container p").innerText =
      "اضغط علي سورة أخرى للاستماع اليها";
  }
});

function changeAyah(index) {
  quranAudio.src = ayahAudioArray[index];
  if (index < ayahsCount) {
    document.querySelector(".quran .audio-container p").innerText =
      ayahTextArray[index];
  }
}

nextAyah.onclick = () => {
  ayahIndex + 1 == ayahsCount ? (ayahIndex = 0) : ayahIndex++;
  changeAyah(ayahIndex);
};

prevAyah.onclick = () => {
  ayahIndex == 0 ? (ayahIndex = ayahsCount - 1) : ayahIndex--;
  changeAyah(ayahIndex);
};

playSurah.onclick = () => {
  togglePlay();
};

function togglePlay() {
  if (quranAudio.paused) {
    quranAudio.play();
    playSurah.classList.remove("fa-play");
    playSurah.classList.add("fa-pause");
  } else {
    quranAudio.pause();
    playSurah.classList.remove("fa-pause");
    playSurah.classList.add("fa-play");
  }
}

// function to get paryer times
function getParyerTimes() {
  fetch(
    "https://api.aladhan.com/v1/timingsByCity?city=Alexandria&country=Egypt"
  )
    .then((response) => response.json())
    .then((allData) => {
      let allParyers = allData.data.timings;
      paryerTimes.forEach((paryerTime) => {
        for (const Paryer in allParyers) {
          // console.log(`${Paryer}: ${allParyers[Paryer]}`);
          if (paryerTime.dataset.paryer == Paryer) {
            paryerTime.innerText = allParyers[Paryer];
          }
        }
      });
    });
}
getParyerTimes();
