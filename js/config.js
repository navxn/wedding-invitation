/* ============================================================
   EDIT HERE — links, times and music. Invitation wording lives
   in index.html (copied word-for-word from the printed card).
   Calendar times are UTC (IST = UTC + 5:30).
============================================================ */
const INVITE = {
  names: "Dr. Nimisha Suresh & Dr. Rijul Padmanabhan",
  eventWord: "Wedding",

  /* Muhurtham: Thu 26 Nov 2026, 11.25 a.m. – 11.50 a.m. IST */
  wedding: {
    title: "Wedding of Dr. Nimisha Suresh & Dr. Rijul Padmanabhan",
    startUTC: "20261126T055500Z",
    endUTC:   "20261126T062000Z",
    details: "Muhurtham between 11.25 a.m. and 11.50 a.m. Followed by further marital ceremonies at Vishnu Inn, Near East Nada, Guruvayoor.",
    location: "Guruvayoor Sree Krishna Swamy Temple, Guruvayoor",
    mapsQuery: "Guruvayoor Sree Krishna Swamy Temple, Guruvayoor",
    mapsLink: ""            /* paste an exact Google Maps link to override */
  },

  /* Further marital ceremonies */
  ceremonies: {
    mapsQuery: "Vishnu Inn, Near East Nada, Guruvayoor",
    mapsLink: "https://maps.app.goo.gl/RSH1P1gf1QJpj5G89"
  },

  /* Reception: Mon 30 Nov 2026, 4.30 p.m. – 9.00 p.m. IST */
  reception: {
    title: "Wedding Reception of Dr. Nimisha Suresh & Dr. Rijul Padmanabhan",
    startUTC: "20261130T110000Z",
    endUTC:   "20261130T153000Z",
    details: "Reception from 4.30 p.m. to 9.00 p.m.",
    location: "Pavithram Convention Centre, Mulavana, Kundara",
    mapsQuery: "Pavithram Convention Centre, Mulavana, Kundara",
    mapsLink: "https://maps.app.goo.gl/2p5v2sZSDnK9a3FP6"
  },

  /* Countdown target = Muhurtham start */
  countdownLabel:   "Counting down to the Muhurtham",
  countdownDoneMsg: "The auspicious day is here — we await your blessings.",

  /* Leave "" to use assets/audio/music.mp3, or name another file in assets/audio/ */
  musicFile: "",

  /* Text sent through WhatsApp (the page link is added automatically) */
  shareText:
    "🙏 Wedding Invitation\n" +
    "Dr. Nimisha Suresh with Dr. Rijul Padmanabhan\n\n" +
    "Thursday, 26 November 2026 (10th Vrischikam 1202)\n" +
    "Muhurtham between 11.25 a.m. and 11.50 a.m.\n" +
    "Guruvayoor Sree Krishna Swamy Temple\n\n" +
    "Reception: Monday, 30th November 2026, 4.30 p.m. to 9.00 p.m.\n" +
    "Pavithram Convention Centre, Mulavana, Kundara\n\n" +
    "Your presence and blessings are cordially invited:"
};
