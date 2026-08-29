/* ============================================================================
   NATALIE'S 40th — QUIZ DATA
   ----------------------------------------------------------------------------
   Everything the quiz shows is defined here. Edit freely — no other file
   needs to change.

   STRUCTURE: every category (movies, music, general, y1986, homemovies) is a
   list of "topics". A topic normally has ONE easy question and ONE hard
   question — during play, the player is offered a choice of difficulty and
   only sees the question for the difficulty they picked. Hard questions are
   worth more points by default. A topic with only ONE question (see
   homemovies) skips the difficulty chooser entirely and plays straight in.

   ANSWER TYPES SUPPORTED (set via "type"):
     "multiple_choice"  -> options[], answerIndex (single correct option)
     "multi_select"      -> options[], answerIndexes[] (2+ correct options)
     "text"               -> answerText (free-typed answer, case-insensitive,
                              trims whitespace; you can list accepted[] variants)
     "video_reveal"       -> no on-screen options. Shows the prompt + main
                              "media" clip (often a trimmed preview -- see
                              start/end below), then either:
                                - answerText and/or answerClips: [{ label,
                                  src, caption }] behind a single SHOW ANSWER
                                  button (all revealed together), or
                                - attempts: [{ label, src, answerText }] --
                                  shown ONE AT A TIME, each with its own
                                  REVEAL ANSWER button; revealing one attempt
                                  is what brings the next one on screen. Use
                                  this for a "guess, reveal, guess again"
                                  round like three timed attempts.
                              Ungraded either way: doesn't affect score, just
                              a watch-and-reveal round.

   OPTIONAL MEDIA — any question (of any answer type above) can show media
   by adding a "media" object:
     { kind: "image",   src: "images/whatever.jpg" }
     { kind: "audio",   src: "audio/whatever.mp3" }        (drop files in /audio)
     { kind: "video",   src: "video/whatever.mp4",
       start: 0, end: 15,
       maskDuration: true }   -> plays a local clip (drop files in /video).
                                 start/end (seconds) are optional and trim
                                 playback to that window of the SAME file --
                                 no re-encoding needed, handy for showing
                                 just a teaser/preview of a longer clip.
                                 maskDuration hides the native controls'
                                 elapsed/total time readout -- set it when a
                                 clip's own length IS the answer (a "how
                                 long..." question), so it can't be read off
                                 the scrubber before it's revealed. (Every
                                 attempts[]/answerClips[] video is masked
                                 automatically, since those are always
                                 reveal clips.)
     { kind: "youtube", youtubeId: "XXXXXXXXXXX",
       start: 0, end: 15 }   -> embeds the OFFICIAL YouTube video/audio for a
                                 song, streamed straight from YouTube (not a
                                 downloaded copy). start/end (seconds) are
                                 optional and trim the clip for a "name that
                                 tune"-style reveal. Find a video's ID in its
                                 URL: youtube.com/watch?v=THIS_PART

   Every question also accepts an optional "points" (defaults: easy 100,
   hard 250, if you don't set one).
============================================================================ */

const QUIZ_DATA = {

  event: {
    title: "NATALIE'S 40th",
    subtitle: "BE KIND, REWIND",
    tagline: "Insert brain. Press play.",
    // If this quiz is opened as a local file (not a real https:// page),
    // the YouTube embed's play/pause control can silently fail to respond
    // (browsers restrict postMessage from file:// pages, which is how the
    // masked player is driven). Deploy the /music-round folder to GitHub
    // Pages, put its URL here, and the MUSIC tile will open it in a new tab
    // instead of trying to run the round locally. Leave this blank ("") to
    // play Music locally as normal (fine when this page itself is hosted
    // online rather than opened as a file).
    musicRoundUrl: ""
  },

  categories: [
    { id: "movies",     label: "MOVIES",             sub: "18 tapes on the shelf", color: "#ff2e9a", glow: "#ff2e9a" },
    { id: "music",      label: "MUSIC",               sub: "name that tune",       color: "#00fff2", glow: "#00fff2" },
    { id: "general",    label: "GENERAL KNOWLEDGE",   sub: "mixed tape",           color: "#faff00", glow: "#faff00" },
    { id: "y1986",      label: "1986",                sub: "the year itself",     color: "#7c4dff", glow: "#a06bff" }
    // "homemovies" intentionally omitted -- this build is for GitHub Pages
    // and doesn't include the /video folder (too large for a git repo).
    // Run Home Movies from the separate full local package instead.
  ],

  /* ------------------------------------------------------------------------
     MOVIES — one tape per uploaded cover. "file" points at /images.
     Add a new one by copying a block and dropping the artwork into /images.
  ------------------------------------------------------------------------ */
  movies: [
    {
      id: "10things", title: "10 Things I Hate About You", file: "images/10-things-i-hate-about-you-62824l.jpg", spine: "images/spine_10things.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "\u201810 Things I Hate About You\u2019 is a teen retelling of which Shakespeare play?",
          options: ["Romeo and Juliet", "The Taming of the Shrew", "Much Ado About Nothing", "Twelfth Night"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the fictional Seattle high school the film is set at?",
          options: ["Padua High School", "Bayside High", "Rydell High", "Ridgemont High"], answerIndex: 0 }
      ]
    },
    {
      id: "littleprincess", title: "A Little Princess", file: "images/A_Little_Princess_-_All.jpg", spine: "images/spine_littleprincess.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "\u2018A Little Princess\u2019 is based on a novel by which author?",
          options: ["Frances Hodgson Burnett", "Roald Dahl", "L.M. Montgomery", "E. Nesbit"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "In the 1995 film, what does Sara's father leave New York to go and do?",
          options: ["Fight in World War I", "Run a tea plantation", "Search for her mother", "Attend university"], answerIndex: 0 }
      ]
    },
    {
      id: "aladdin", title: "Aladdin", file: "images/aladdin-4746l.jpg", spine: "images/spine_aladdin.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Who voiced the Genie in Disney's \u2018Aladdin\u2019 (1992)?",
          options: ["Eddie Murphy", "Dan Castellaneta", "Robin Williams", "John Goodman"], answerIndex: 2 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Aladdin's pet monkey?",
          options: ["Rajah", "Iago", "Abu", "Zazu"], answerIndex: 2 }
      ]
    },
    {
      id: "anastasia", title: "Anastasia", file: "images/anastasia-32087l.jpg", spine: "images/spine_anastasia.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "\u2018Anastasia\u2019 (1997) is loosely inspired by the fall of which royal family?",
          options: ["The Habsburgs", "The Romanovs", "The Windsors", "The Bourbons"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the sorcerer villain who curses the Romanov family?",
          options: ["Koschei", "Baba Yaga", "Rasputin", "Chernabog"], answerIndex: 2 }
      ]
    },
    {
      id: "bridget", title: "Bridget Jones's Diary", file: "images/bridget-joness-diary-2391l.jpg", spine: "images/spine_bridget.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Who plays the buttoned-up barrister Mark Darcy in \u2018Bridget Jones\u2019s Diary\u2019?",
          options: ["Hugh Grant", "Colin Firth", "Ralph Fiennes", "Rupert Everett"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Bridget's caddish boss, played by Hugh Grant?",
          options: ["Daniel Cleaver", "Jack Wickham", "Rupert Campbell-Black", "Simon Foster"], answerIndex: 0 }
      ]
    },
    {
      id: "bringiton", title: "Bring It On", file: "images/bring-it-on-17895l.jpg", spine: "images/spine_bringiton.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What competitive activity is at the centre of \u2018Bring It On\u2019?",
          options: ["Dance team", "Cheerleading", "Gymnastics", "Marching band"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Kirsten Dunst's cheer-captain character?",
          options: ["Torrance Shipman", "Isis Carter", "Courtney Egbert", "Whitney Cheever"], answerIndex: 0 }
      ]
    },
    {
      id: "cinderella", title: "Cinderella", file: "images/cinderella-all.jpg", spine: "images/spine_cinderella.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What does Cinderella leave behind on the palace steps at midnight?",
          options: ["Her shawl", "A glass slipper", "Her invitation", "A ring"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What are the names of Cinderella's two mouse friends?",
          options: ["Jaq and Gus", "Timothy and Bernard", "Chip and Dale", "Bianca and Percy"], answerIndex: 0 }
      ]
    },
    {
      id: "coyoteugly", title: "Coyote Ugly", file: "images/coyote-ugly-all.jpg", spine: "images/spine_coyoteugly.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "In \u2018Coyote Ugly\u2019, Violet moves to which city chasing her songwriting dream?",
          options: ["Nashville", "Los Angeles", "New York City", "Chicago"], answerIndex: 2 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Who plays Lil, the tough-as-nails owner of the Coyote Ugly bar?",
          options: ["Maria Bello", "Piper Perabo", "Tyra Banks", "Melanie Lynskey"], answerIndex: 0 }
      ]
    },
    {
      id: "dirtydancing", title: "Dirty Dancing", file: "images/dirty-dancing-all.jpg", spine: "images/spine_dirtydancing.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is the name of the holiday resort in \u2018Dirty Dancing\u2019?",
          options: ["Kellerman's", "Grossinger's", "Camp Crystal", "The Pines"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the first name of Patrick Swayze's dance-instructor character, Mr Castle?",
          options: ["Johnny", "Robbie", "Neil", "Billy"], answerIndex: 0 }
      ]
    },
    {
      id: "hocuspocus", title: "Hocus Pocus", file: "images/hocus-pocus-32095l.jpg", spine: "images/spine_hocuspocus.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "The three witches in \u2018Hocus Pocus\u2019 are resurrected in which town?",
          options: ["Sleepy Hollow", "Salem", "Amityville", "Innsmouth"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What are the first names of the three Sanderson sisters?",
          options: ["Winifred, Sarah and Mary", "Agnes, Edith and Rose", "Hilda, Zelda and Wanda", "Circe, Hecate and Freya"], answerIndex: 0 }
      ]
    },
    {
      id: "guy10days", title: "How to Lose a Guy in 10 Days", file: "images/how-to-lose-a-guy-in-10-days-35677l.jpg", spine: "images/spine_guy10days.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Kate Hudson's character writes a \u2018how-to\u2019 column for which magazine?",
          options: ["Composure", "Cosmopolitan", "Vogue", "Elle"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Matthew McConaughey's character is trying to win an ad campaign for which product?",
          options: ["A diamond necklace", "A sports car", "A perfume line", "A wedding venue"], answerIndex: 0 }
      ]
    },
    {
      id: "ladytramp", title: "Lady and the Tramp", file: "images/lady-and-the-tramp-all.jpg", spine: "images/spine_ladytramp.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What dish do Lady and Tramp famously share (and nearly kiss over)?",
          options: ["Pizza", "Spaghetti", "Meatballs alone", "Ice cream"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What dog breed is Lady?",
          options: ["Beagle", "Cocker Spaniel", "Golden Retriever", "Dachshund"], answerIndex: 1 }
      ]
    },
    {
      id: "moulinrouge", title: "Moulin Rouge!", file: "images/moulin-rouge-15498l.jpg", spine: "images/spine_moulinrouge.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "\u2018Moulin Rouge!\u2019 is set in the bohemian district of which city?",
          options: ["Vienna", "Paris", "Berlin", "Rome"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Ewan McGregor's penniless-writer character?",
          options: ["Christian", "Toulouse", "The Duke", "Satine"], answerIndex: 0 }
      ]
    },
    {
      id: "bestfriendswedding", title: "My Best Friend's Wedding", file: "images/my-best-friends-wedding-56595l.jpg", spine: "images/spine_bestfriendswedding.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is Julia Roberts' character's job in \u2018My Best Friend's Wedding\u2019?",
          options: ["Wedding planner", "Restaurant critic", "Magazine editor", "Chef"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Julia Roberts' character?",
          options: ["Julianne Potter", "Kimberly Wallace", "Michelle Newman", "Jules Preston"], answerIndex: 0 }
      ]
    },
    {
      id: "aristocats", title: "The Aristocats", file: "images/the-aristocats-all.jpg", spine: "images/spine_aristocats.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is the name of the elegant mother cat in \u2018The Aristocats\u2019?",
          options: ["Marie", "Duchess", "Minou", "Josephine"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the alley cat who helps Duchess and her kittens get home?",
          options: ["Thomas O'Malley", "Scat Cat", "Lucifer", "Oliver"], answerIndex: 0 }
      ]
    },
    {
      id: "littlemermaid", title: "The Little Mermaid", file: "images/the-little-mermaid-2096l.jpg", spine: "images/spine_littlemermaid.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is the name of Ariel's crab friend and reluctant chaperone?",
          options: ["Flounder", "Sebastian", "Scuttle", "Louis"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the sea witch who steals Ariel's voice?",
          options: ["Morgana", "Circe", "Ursula", "Vanessa"], answerIndex: 2 }
      ]
    },
    {
      id: "rescuers", title: "The Rescuers", file: "images/the-rescuers-all.jpg", spine: "images/spine_rescuers.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Bernard and Bianca work for which organisation in \u2018The Rescuers\u2019?",
          options: ["The Mouse Guard", "The Rescue Aid Society", "The Underground Railroad", "The Secret Six"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the kidnapped orphan girl Bernard and Bianca rescue?",
          options: ["Penny", "Molly", "Anna", "Ellie"], answerIndex: 0 }
      ]
    },
    {
      id: "titanic", title: "Titanic", file: "images/titanic-thx-remastered-10565l.jpg", spine: "images/spine_titanic.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "In what year does the RMS Titanic sink in the film?",
          options: ["1910", "1912", "1915", "1920"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the ship that rescues the Titanic's survivors?",
          options: ["The Carpathia", "The Californian", "The Britannic", "The Olympic"], answerIndex: 0 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     MUSIC — real songs via official YouTube embeds (streamed from YouTube's
     own player, so this isn't a copy of anyone's audio, just a link-style
     embed like sharing a video). Swap youtubeId for any other official
     upload you prefer — the ID is the part after "watch?v=" in the URL.
  ------------------------------------------------------------------------ */
  music: [
    {
      id: "nameThatTune",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "djV11Xbc914", start: 0, end: 15 },
          options: ["Take On Me \u2014 a-ha", "Wake Me Up Before You Go-Go \u2014 Wham!", "Girls Just Want to Have Fun \u2014 Cyndi Lauper", "Livin' on a Prayer \u2014 Bon Jovi"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Same clip \u2014 what year was it originally released?",
          media: { kind: "youtube", youtubeId: "djV11Xbc914", start: 0, end: 15 },
          options: ["1983", "1985", "1987", "1989"], answerIndex: 1 }
      ]
    },
    {
      id: "iwillalwaysloveyou",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Whitney Houston's version of \u2018I Will Always Love You\u2019 was written by which country legend?",
          media: { kind: "youtube", youtubeId: "T9Ybsvw_0p4", start: 0, end: 20 },
          options: ["Reba McEntire", "Dolly Parton", "Tammy Wynette", "Loretta Lynn"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Whitney Houston's version topped the charts in 1992 as the lead single from which film's soundtrack?",
          media: { kind: "youtube", youtubeId: "T9Ybsvw_0p4", start: 0, end: 20 },
          options: ["The Bodyguard", "Waiting to Exhale", "The Preacher's Wife", "Sister Act"], answerIndex: 0 }
      ]
    },
    {
      id: "dontyouwantme",
      questions: [
        { difficulty: "easy", type: "text", prompt: "Complete the lyric: \u2018Don't you want me, baby? Don't you want me...\u2019",
          media: { kind: "youtube", youtubeId: "uPudE8nDog0", start: 0, end: 20 },
          answerText: "oh oh oh", accepted: ["oh oh oh oh", "oh, oh, oh"] },
        { difficulty: "hard", type: "multiple_choice", prompt: "\u2018Don't You Want Me\u2019 was a 1981 UK Christmas #1 for which band?",
          media: { kind: "youtube", youtubeId: "uPudE8nDog0", start: 0, end: 20 },
          options: ["Duran Duran", "The Human League", "Depeche Mode", "Tears for Fears"], answerIndex: 1 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     GENERAL KNOWLEDGE — sample topics.
  ------------------------------------------------------------------------ */
  general: [
    {
      id: "ukcapitals",
      questions: [
        { difficulty: "easy", type: "multi_select", prompt: "Which of these are U.K. capital cities? (select all that apply)",
          options: ["Cardiff", "Manchester", "Edinburgh", "Belfast"], answerIndexes: [0, 2, 3] },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the chemical symbol for tungsten?",
          options: ["Tu", "Tg", "W", "Wf"], answerIndex: 2 }
      ]
    },
    {
      id: "canberra",
      questions: [
        { difficulty: "easy", type: "text", prompt: "What is the capital of Australia? (hint: it isn't Sydney)",
          answerText: "canberra" },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the smallest Australian state by area?",
          options: ["Tasmania", "Victoria", "South Australia", "Queensland"], answerIndex: 0 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     1986 — the birth year round. Swap in a real photo for the picture round.
  ------------------------------------------------------------------------ */
  y1986: [
    {
      id: "events1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "1986 is the year Natalie was born. Which of these also happened that year?",
          options: ["The Chernobyl disaster", "The fall of the Berlin Wall", "The Millennium Bug panic", "The first iPhone launch"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which U.S. Space Shuttle disaster also happened in 1986?",
          options: ["Columbia", "Challenger", "Discovery", "Atlantis"], answerIndex: 1 }
      ]
    },
    {
      id: "consoles1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What iconic games console launched in the UK in 1986? (swap the image path for a real one)",
          media: { kind: "image", src: "images/aladdin-4746l.jpg" },
          options: ["The Nintendo Entertainment System", "The Sony Walkman", "The first CD player", "The VHS camcorder"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "The NES launched in the UK in 1986 \u2014 but which country got it first, in 1985?",
          options: ["Japan", "USA", "France", "Canada"], answerIndex: 1 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     HOME MOVIES — real clips from the family archive (see /video). Each
     topic has ONE question (no easy/hard split — the app skips the
     difficulty chooser automatically when a topic has just one question).

     type: "video_reveal" -> shows the prompt + main clip, then a
     SHOW ANSWER button. On click it reveals optional answerText and/or one
     or more answerClips (extra videos played in sequence, each with its own
     label/caption) -- this is how "multiple videos for one answer" (e.g.
     three guess attempts) are grouped under a single question. There's no
     right/wrong grading for this type -- it's a watch-and-reveal round for
     the room to call out answers together, so it doesn't affect the score.
  ------------------------------------------------------------------------ */
  homemovies: [],
};
