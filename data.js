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
                                  round like three timed attempts. Each
                                  attempt can be a local file (src) or a
                                  YouTube clip (youtubeId, start, end) --
                                  either way the timer stays hidden, since
                                  the point of "attempts" is always a timed
                                  reveal.
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
       start: 0, end: 15,
       masked: true,
       maskDuration: true }  -> embeds the OFFICIAL YouTube video/audio for a
                                 clip, streamed straight from YouTube (not a
                                 downloaded copy). start/end (seconds) are
                                 optional and trim the clip. Find a video's
                                 ID in its URL: youtube.com/watch?v=THIS_PART
                                 Three ways it can render (pick ONE flag):
                                   - neither flag -> plays visibly with
                                     YouTube's normal native controls. Use
                                     this whenever watching the clip freely
                                     doesn't give away the answer (most
                                     Home Movies clips).
                                   - masked: true -> the player is fully
                                     invisible (opacity:0, audio only) behind
                                     our own "mystery track" cover -- use for
                                     "name that tune"-style questions where
                                     SEEING the video would spoil it (Music).
                                   - maskDuration: true -> video stays fully
                                     VISIBLE and playable, but native
                                     controls are replaced with a bare play
                                     button so the timer can't be read off
                                     the scrubber -- use when the clip's own
                                     LENGTH is the answer (a "how long..."
                                     Home Movies question).

   Every question also accepts an optional "points" (defaults: easy 50,
   hard 75, if you don't set one).

   Every question also accepts an optional "hint" (a short string). If set,
   a HINT button appears under the prompt -- clicking it reveals that text,
   no scoring penalty. Only add one where a gentle nudge actually helps
   without just handing over the answer; leave it off questions that don't
   need one.
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
    { id: "y1986",      label: "1986",                sub: "the year itself",     color: "#7c4dff", glow: "#a06bff" },
    { id: "homemovies", label: "HOME MOVIES",         sub: "22 real Natalie moments", color: "#38ff8a", glow: "#38ff8a" },
    { id: "jobs",        label: "NATALIE'S JOBS",      sub: "career highlights reel", color: "#ff7a3d", glow: "#ff7a3d" }
  ],

  /* ------------------------------------------------------------------------
     MOVIES — one tape per uploaded cover. "file" points at /images.
     Add a new one by copying a block and dropping the artwork into /images.
  ------------------------------------------------------------------------ */
  movies: [
    {
      id: "10things", title: "10 Things I Hate About You", file: "images/10-things-i-hate-about-you-62824l.jpg", spine: "images/spine_10things.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "‘10 Things I Hate About You’ is a teen retelling of which Shakespeare play?",
          hint: "The play is about taming a stubborn, sharp-tongued woman.",
          options: ["Romeo and Juliet", "The Taming of the Shrew", "Much Ado About Nothing", "Twelfth Night"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the fictional Seattle high school the film is set at?",
          hint: "Named after the same Italian city the original play is set in.",
          options: ["Padua High School", "Bayside High", "Rydell High", "Ridgemont High"], answerIndex: 0 }
      ]
    },
    {
      id: "littleprincess", title: "A Little Princess", file: "images/A_Little_Princess_-_All.jpg", spine: "images/spine_littleprincess.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "‘A Little Princess’ is based on a novel by which author?",
          hint: "She also wrote The Secret Garden.",
          options: ["Frances Hodgson Burnett", "Roald Dahl", "L.M. Montgomery", "E. Nesbit"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "In the 1995 film, what does Sara's father leave New York to go and do?",
          hint: "It's the same war that took so many fathers away in the early 1900s.",
          options: ["Fight in World War I", "Run a tea plantation", "Search for her mother", "Attend university"], answerIndex: 0 }
      ]
    },
    {
      id: "aladdin", title: "Aladdin", file: "images/aladdin-4746l.jpg", spine: "images/spine_aladdin.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "A3iK9UIAdKA", start: 0, end: 18, masked: true },
          hint: "A duet, sung on a magic carpet ride.",
          options: ["A Whole New World", "Friend Like Me", "Circle of Life", "Colors of the Wind"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the palace guard captain who repeatedly tries to catch Aladdin?",
          hint: "His name starts with 'Ra' — not the Egyptian sun god.",
          options: ["Razoul", "Jafar", "Omar", "Farouk"], answerIndex: 0 }
      ]
    },
    {
      id: "anastasia", title: "Anastasia", file: "images/anastasia-32087l.jpg", spine: "images/spine_anastasia.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "p0BmZXc_w3E", start: 0, end: 18, masked: true },
          hint: "A wistful waltz about a half-remembered palace.",
          options: ["Once Upon a December", "Journey to the Past", "Paris Holds the Key", "In the Dark of the Night"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Rasputin's bat sidekick?",
          hint: "He gets his own spin-off short film, 'Bartok the Magnificent.'",
          options: ["Bartok", "Pip", "Vladimir", "Dimitri"], answerIndex: 0 }
      ]
    },
    {
      id: "bridget", title: "Bridget Jones's Diary", file: "images/bridget-joness-diary-2391l.jpg", spine: "images/spine_bridget.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Who plays the buttoned-up barrister Mark Darcy in ‘Bridget Jones's Diary’?",
          hint: "He played a very similarly-named Mr Darcy in a famous Austen adaptation too.",
          options: ["Hugh Grant", "Colin Firth", "Ralph Fiennes", "Rupert Everett"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the publishing house Bridget works for before moving into TV journalism?",
          hint: "It shares its name with a stately home from a classic Jane Austen novel.",
          options: ["Pemberley Press", "Longbourn Books", "Rosings Publishing", "Netherfield House"], answerIndex: 0 }
      ]
    },
    {
      id: "bringiton", title: "Bring It On", file: "images/bring-it-on-17895l.jpg", spine: "images/spine_bringiton.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What competitive activity is at the centre of ‘Bring It On’?",
          hint: "Pom-poms, pyramids, and a big national final.",
          options: ["Dance team", "Cheerleading", "Gymnastics", "Marching band"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Kirsten Dunst's cheer-captain character?",
          hint: "Her surname is also a type of vessel that sails.",
          options: ["Torrance Shipman", "Isis Carter", "Courtney Egbert", "Whitney Cheever"], answerIndex: 0 }
      ]
    },
    {
      id: "cinderella", title: "Cinderella", file: "images/cinderella-all.jpg", spine: "images/spine_cinderella.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "5dv6pOGeuGs", start: 0, end: 18, masked: true },
          hint: "The Fairy Godmother's spell needs a little magic word — actually three.",
          options: ["Bibbidi-Bobbidi-Boo", "A Dream Is a Wish Your Heart Makes", "So This Is Love", "Sing, Sweet Nightingale"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of Cinderella's horse?",
          hint: "A military-sounding rank.",
          options: ["Major", "Captain", "Duke", "Colonel"], answerIndex: 0 }
      ]
    },
    {
      id: "coyoteugly", title: "Coyote Ugly", file: "images/coyote-ugly-all.jpg", spine: "images/spine_coyoteugly.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "In ‘Coyote Ugly’, Violet moves to which city chasing her songwriting dream?",
          hint: "The city that never sleeps.",
          options: ["Nashville", "Los Angeles", "New York City", "Chicago"], answerIndex: 2 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Who plays Lil, the tough-as-nails owner of the Coyote Ugly bar?",
          hint: "She later played the mother in A History of Violence.",
          options: ["Maria Bello", "Piper Perabo", "Tyra Banks", "Melanie Lynskey"], answerIndex: 0 }
      ]
    },
    {
      id: "dirtydancing", title: "Dirty Dancing", file: "images/dirty-dancing-all.jpg", spine: "images/spine_dirtydancing.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "6eyCDj1s4NI", start: 0, end: 18, masked: true },
          hint: "The song that plays over the famous final lift.",
          options: ["(I've Had) The Time of My Life", "Hungry Eyes", "She's Like the Wind", "Be My Baby"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is Baby's real first name, revealed in the film's opening narration?",
          hint: "It's also a country and a common English name.",
          options: ["Frances", "Eleanor", "Patricia", "Margaret"], answerIndex: 0 }
      ]
    },
    {
      id: "hocuspocus", title: "Hocus Pocus", file: "images/hocus-pocus-32095l.jpg", spine: "images/spine_hocuspocus.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "DCTbr3vjb6I", start: 0, end: 18, masked: true },
          hint: "The Sanderson Sisters take over the Halloween dance stage.",
          options: ["I Put a Spell on You", "Come Little Children", "One Way or Another", "Sarah's Theme"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the immortal black cat who guides the kids through the film?",
          hint: "He was cursed 300 years earlier as a teenage boy.",
          options: ["Thackery Binx", "Salem", "Jinx", "Familiar"], answerIndex: 0 }
      ]
    },
    {
      id: "guy10days", title: "How to Lose a Guy in 10 Days", file: "images/how-to-lose-a-guy-in-10-days-35677l.jpg", spine: "images/spine_guy10days.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Kate Hudson's character writes a ‘how-to’ column for which magazine?",
          hint: "The fictional \"Composure\" is a stand-in for a real, very famous women's magazine.",
          options: ["Composure", "Cosmopolitan", "Vogue", "Elle"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the full name of Matthew McConaughey's advertising-executive character?",
          hint: "Most people just remember his first name — 'Ben' something.",
          options: ["Ben Barry", "Ben Foster", "Ben Anderson", "Ben Callahan"], answerIndex: 0 }
      ]
    },
    {
      id: "ladytramp", title: "Lady and the Tramp", file: "images/lady-and-the-tramp-all.jpg", spine: "images/spine_ladytramp.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "fbzEOQLOAWw", start: 0, end: 18, masked: true },
          hint: "Playing over that spaghetti dinner for two.",
          options: ["Bella Notte", "He's a Tramp", "The Siamese Cat Song", "La La Lu"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the Scottish terrier who's friends with Lady?",
          hint: "A one-syllable name, also slang for an athletic competitor.",
          options: ["Jock", "Trusty", "Tramp", "Boris"], answerIndex: 0 }
      ]
    },
    {
      id: "moulinrouge", title: "Moulin Rouge!", file: "images/moulin-rouge-15498l.jpg", spine: "images/spine_moulinrouge.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "ELkO5oB5r9M", start: 0, end: 18, masked: true },
          hint: "The lovers' vow, sung as a duet.",
          options: ["Come What May", "Your Song", "Lady Marmalade", "El Tango de Roxanne"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the club's ringmaster/owner, played by Jim Broadbent?",
          hint: "First name Harold.",
          options: ["Harold Zidler", "Toulouse-Lautrec", "The Duke", "Chocolat"], answerIndex: 0 }
      ]
    },
    {
      id: "bestfriendswedding", title: "My Best Friend's Wedding", file: "images/my-best-friends-wedding-56595l.jpg", spine: "images/spine_bestfriendswedding.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is Julia Roberts' character's job in ‘My Best Friend's Wedding’?",
          hint: "Her job involves eating out — professionally.",
          options: ["Wedding planner", "Restaurant critic", "Magazine editor", "Chef"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What song does Julianne sing badly, on purpose, at a karaoke-style restaurant to sabotage the wedding?",
          hint: "A Dionne Warwick classic, title starts with 'I Say a Little...'",
          options: ["I Say a Little Prayer", "Walk On By", "Respect", "I Will Survive"], answerIndex: 0 }
      ]
    },
    {
      id: "aristocats", title: "The Aristocats", file: "images/the-aristocats-all.jpg", spine: "images/spine_aristocats.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "wg3j09xiKII", start: 0, end: 18, masked: true },
          hint: "Scat Cat and his jazz band welcome Duchess and the kittens.",
          options: ["Ev'rybody Wants to Be a Cat", "The Aristocats", "Scales and Arpeggios", "Thomas O'Malley Cat"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What are the names of the two gossiping geese who help Duchess and the kittens get home?",
          hint: "Auntie and niece — both names start with 'A'.",
          options: ["Abigail and Amelia", "Bianca and Penny", "Flora and Fauna", "Prunella and Winifred"], answerIndex: 0 }
      ]
    },
    {
      id: "littlemermaid", title: "The Little Mermaid", file: "images/the-little-mermaid-2096l.jpg", spine: "images/spine_littlemermaid.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "SXKlJuO07eM", start: 0, end: 18, masked: true },
          hint: "Ariel longs to be where the people are.",
          options: ["Part of Your World", "Under the Sea", "Kiss the Girl", "Poor Unfortunate Souls"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What are the names of Ursula's two eel henchmen?",
          hint: "One name evokes driftwood, the other a boat's exhaust.",
          options: ["Flotsam and Jetsam", "Squirt and Nemo", "Bubbles and Fin", "Slick and Eely"], answerIndex: 0 }
      ]
    },
    {
      id: "rescuers", title: "The Rescuers", file: "images/the-rescuers-all.jpg", spine: "images/spine_rescuers.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Bernard and Bianca work for which organisation in ‘The Rescuers’?",
          hint: "It's like the United Nations — but for mice.",
          options: ["The Mouse Guard", "The Rescue Aid Society", "The Underground Railroad", "The Secret Six"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What are the names of Madame Medusa's pet crocodiles?",
          hint: "One's named after a Shakespearean assassin, the other a Roman emperor.",
          options: ["Brutus and Nero", "Caesar and Cleo", "Jaws and Fang", "Snap and Crackle"], answerIndex: 0 }
      ]
    },
    {
      id: "titanic", title: "Titanic", file: "images/titanic-thx-remastered-10565l.jpg", spine: "images/spine_titanic.jpg",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune — it's from this film's soundtrack!",
          media: { kind: "youtube", youtubeId: "mNsm2P0l_7Y", start: 0, end: 18, masked: true },
          hint: "Celine Dion's theme, played as the wreck is explored decades later.",
          options: ["My Heart Will Go On", "Unchained Melody", "Take My Breath Away", "The Power of Love"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the ship that rescues the Titanic's survivors?",
          hint: "Its name sounds similar to a European mountain range.",
          options: ["The Carpathia", "The Californian", "The Britannic", "The Olympic"], answerIndex: 0 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     MUSIC — real songs via official YouTube embeds (streamed from YouTube's
     own player, so this isn't a copy of anyone's audio, just a link-style
     embed like sharing a video). Swap youtubeId for any other official
     upload you prefer — the ID is the part after "watch?v=" in the URL.
     Every video ID below was verified individually (title + embeddability
     via YouTube's oEmbed API) before being added.
  ------------------------------------------------------------------------ */
  music: [
    {
      id: "nameThatTune",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "djV11Xbc914", start: 0, end: 15, masked: true },
          hint: "Think 80s synth-pop, and a music video famous for its pencil-sketch animation.",
          options: ["Take On Me — a-ha", "Wake Me Up Before You Go-Go — Wham!", "Girls Just Want to Have Fun — Cyndi Lauper", "Livin' on a Prayer — Bon Jovi"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Same clip — what year was it originally released?",
          media: { kind: "youtube", youtubeId: "djV11Xbc914", start: 0, end: 15, masked: true },
          hint: "Same year the first Back to the Future film came out.",
          options: ["1983", "1985", "1987", "1989"], answerIndex: 1 }
      ]
    },
    {
      id: "iwillalwaysloveyou",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Whitney Houston's version of ‘I Will Always Love You’ was written by which country legend?",
          media: { kind: "youtube", youtubeId: "T9Ybsvw_0p4", start: 0, end: 20, masked: true },
          hint: "She's nearly as famous for her own hits as for writing this one — and she owns a Tennessee theme park.",
          options: ["Reba McEntire", "Dolly Parton", "Tammy Wynette", "Loretta Lynn"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Whitney Houston's version topped the charts in 1992 as the lead single from which film's soundtrack?",
          media: { kind: "youtube", youtubeId: "T9Ybsvw_0p4", start: 0, end: 20, masked: true },
          hint: "Whitney Houston also starred in this film, opposite Kevin Costner.",
          options: ["The Bodyguard", "Waiting to Exhale", "The Preacher's Wife", "Sister Act"], answerIndex: 0 }
      ]
    },
    {
      id: "dontyouwantme",
      questions: [
        { difficulty: "easy", type: "text", prompt: "Complete the lyric: ‘Don't you want me, baby? Don't you want me...’",
          media: { kind: "youtube", youtubeId: "uPudE8nDog0", start: 0, end: 20, masked: true },
          hint: "It's a short ad-lib — the same syllable, repeated three times.",
          answerText: "oh oh oh", accepted: ["oh oh oh oh", "oh, oh, oh"] },
        { difficulty: "hard", type: "multiple_choice", prompt: "‘Don't You Want Me’ was a 1981 UK Christmas #1 for which band?",
          media: { kind: "youtube", youtubeId: "uPudE8nDog0", start: 0, end: 20, masked: true },
          hint: "British synth-pop pioneers, named after a sci-fi organisation.",
          options: ["Duran Duran", "The Human League", "Depeche Mode", "Tears for Fears"], answerIndex: 1 }
      ]
    },
    {
      id: "nevergonnagiveyouup",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "dQw4w9WgXcQ", start: 0, end: 20, masked: true },
          hint: "This exact video became the most famous prank link on the internet.",
          options: ["Never Gonna Give You Up — Rick Astley", "Together Forever — Rick Astley", "Careless Whisper — George Michael", "It Must Have Been Love — Roxette"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "This song became a massive internet meme/prank, tricking people into clicking a link. What's it called?",
          media: { kind: "youtube", youtubeId: "dQw4w9WgXcQ", start: 0, end: 20, masked: true },
          hint: "It combines the singer's first name with a common internet term for a prank.",
          options: ["Rickrolling", "Plankin'", "Tebowing", "The Harlem Shake"], answerIndex: 0 }
      ]
    },
    {
      id: "bohemianrhapsody",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "fJ9rUzIMcZQ", start: 0, end: 20, masked: true },
          hint: "It opens a cappella, then builds into a rock opera with a famous operatic mid-section.",
          options: ["Bohemian Rhapsody — Queen", "We Are the Champions — Queen", "Don't Stop Me Now — Queen", "Somebody to Love — Queen"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which 1975 Queen album features this song?",
          media: { kind: "youtube", youtubeId: "fJ9rUzIMcZQ", start: 0, end: 20, masked: true },
          hint: "Its title, like the band's next album, references a Marx Brothers film.",
          options: ["A Night at the Opera", "A Day at the Races", "Jazz", "News of the World"], answerIndex: 0 }
      ]
    },
    {
      id: "dancingqueen",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "xFrGuyw1V8s", start: 0, end: 22, masked: true },
          hint: "A glittery Swedish pop group, four members, two of whom were married couples.",
          options: ["Dancing Queen — ABBA", "Mamma Mia — ABBA", "Waterloo — ABBA", "Super Trouper — ABBA"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "This was ABBA's only single to reach #1 on the US Billboard Hot 100. What year did it get there?",
          media: { kind: "youtube", youtubeId: "xFrGuyw1V8s", start: 0, end: 22, masked: true },
          hint: "The same year the original Star Wars first hit theatres.",
          options: ["1977", "1976", "1978", "1974"], answerIndex: 0 }
      ]
    },
    {
      id: "billiejean",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "Zi_XLOBDo_Y", start: 0, end: 20, masked: true },
          hint: "That iconic bassline, and a light-up sidewalk in the music video.",
          options: ["Billie Jean — Michael Jackson", "Beat It — Michael Jackson", "Thriller — Michael Jackson", "Smooth Criminal — Michael Jackson"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which album — the best-selling album of all time — features this song?",
          media: { kind: "youtube", youtubeId: "Zi_XLOBDo_Y", start: 0, end: 20, masked: true },
          hint: "Its title track has an equally famous zombie-filled music video.",
          options: ["Thriller", "Bad", "Off the Wall", "Dangerous"], answerIndex: 0 }
      ]
    },
    {
      id: "sweetchildomine",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "1w7OgIMMRc4", start: 0, end: 20, masked: true },
          hint: "That instantly recognisable opening guitar riff.",
          options: ["Sweet Child O' Mine — Guns N' Roses", "Paradise City — Guns N' Roses", "November Rain — Guns N' Roses", "Welcome to the Jungle — Guns N' Roses"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which 1987 debut studio album by Guns N' Roses — the best-selling debut album in U.S. history — features this song?",
          media: { kind: "youtube", youtubeId: "1w7OgIMMRc4", start: 0, end: 20, masked: true },
          hint: "Its title suggests you shouldn't judge it by its cover.",
          options: ["Appetite for Destruction", "Use Your Illusion I", "Use Your Illusion II", "G N' R Lies"], answerIndex: 0 }
      ]
    },
    {
      id: "wannabe",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "gJLIiF15wjQ", start: 0, end: 20, masked: true },
          hint: "\"If you wanna be my lover...\" — a 90s girl group's debut single.",
          options: ["Wannabe — Spice Girls", "Say You'll Be There — Spice Girls", "Spice Up Your Life — Spice Girls", "Stop — Spice Girls"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "'Wannabe' was the Spice Girls' debut single, released in which year?",
          media: { kind: "youtube", youtubeId: "gJLIiF15wjQ", start: 0, end: 20, masked: true },
          hint: "The same year England hosted the Euro football championship.",
          options: ["1996", "1994", "1997", "1998"], answerIndex: 0 }
      ]
    },
    {
      id: "africa",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Name that tune!",
          media: { kind: "youtube", youtubeId: "FTQbiNvZqaY", start: 0, end: 22, masked: true },
          hint: "\"I hear the drums echoing tonight...\" — an American rock band named after a toilet brand.",
          options: ["Africa — Toto", "Rosanna — Toto", "Hold the Line — Toto", "I Won't Hold You Back — Toto"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "This song topped the US Billboard Hot 100 in which year?",
          media: { kind: "youtube", youtubeId: "FTQbiNvZqaY", start: 0, end: 22, masked: true },
          hint: "The same year Michael Jackson's 'Billie Jean' also hit #1.",
          options: ["1983", "1982", "1985", "1980"], answerIndex: 0 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     GENERAL KNOWLEDGE — mixed tape.
  ------------------------------------------------------------------------ */
  general: [
    {
      id: "ukcapitals",
      questions: [
        { difficulty: "easy", type: "multi_select", prompt: "Which of these are U.K. capital cities? (select all that apply)",
          hint: "Three of the UK's four home nations have their own capital — one of these four options isn't a national capital at all.",
          options: ["Cardiff", "Manchester", "Edinburgh", "Belfast"], answerIndexes: [0, 2, 3] },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the chemical symbol for tungsten?",
          hint: "The symbol comes from the element's German name, Wolfram.",
          options: ["Tu", "Tg", "W", "Wf"], answerIndex: 2 }
      ]
    },
    {
      id: "canberra",
      questions: [
        { difficulty: "easy", type: "text", prompt: "What is the capital of Australia? (hint: it isn't Sydney)",
          hint: "A purpose-built capital, chosen as a compromise between two much bigger rival cities.",
          answerText: "canberra" },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the smallest Australian state by area?",
          hint: "It's the only Australian state that's an island.",
          options: ["Tasmania", "Victoria", "South Australia", "Queensland"], answerIndex: 0 }
      ]
    },
    {
      id: "worldflags",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which country's flag features a red maple leaf?",
          hint: "Its national anthem starts \"O Canada.\"",
          options: ["Canada", "USA", "Norway", "Ireland"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which country has the only national flag that isn't a four-sided rectangle or square?",
          hint: "It's actually two overlapping triangular pennants, flown in the Himalayas.",
          options: ["Nepal", "Switzerland", "Bhutan", "Qatar"], answerIndex: 0 }
      ]
    },
    {
      id: "elements",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is the chemical symbol for gold?",
          hint: "It comes from the element's Latin name, 'aurum.'",
          options: ["Au", "Go", "Gd", "Ag"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which metal has the highest melting point of any element?",
          hint: "Its filament used to glow white-hot inside old incandescent light bulbs.",
          options: ["Tungsten", "Osmium", "Iridium", "Rhenium"], answerIndex: 0 }
      ]
    },
    {
      id: "historyww",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "In which year did World War II end?",
          hint: "Nine years after it began in Europe.",
          options: ["1943", "1945", "1947", "1950"], answerIndex: 1 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which treaty formally ended World War I?",
          hint: "Signed in the Hall of Mirrors at a famous French palace.",
          options: ["Treaty of Versailles", "Treaty of Paris", "Treaty of Vienna", "Congress of Berlin"], answerIndex: 0 }
      ]
    },
    {
      id: "literature",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Who wrote the Harry Potter series?",
          hint: "Her initials are J.K.",
          options: ["J.K. Rowling", "Roald Dahl", "C.S. Lewis", "Enid Blyton"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What was the real name of the author who wrote under the pen name \"Mark Twain\"?",
          hint: "His real surname is also a word for a strong grip or a tool for holding things.",
          options: ["Samuel Clemens", "Samuel Adams", "Nathaniel Hawthorne", "Herman Melville"], answerIndex: 0 }
      ]
    },
    {
      id: "sportsfifa",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "How many players does each football (soccer) team have on the pitch at once?",
          hint: "One of them wears gloves and guards the goal.",
          options: ["9", "10", "11", "12"], answerIndex: 2 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which country has won the most FIFA World Cup titles?",
          hint: "Their national team is nicknamed \"Seleção.\"",
          options: ["Brazil", "Germany", "Italy", "Argentina"], answerIndex: 0 }
      ]
    },
    {
      id: "capitalcities",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What is the capital city of France?",
          hint: "Home to the Eiffel Tower.",
          options: ["Paris", "Lyon", "Marseille", "Nice"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which African country officially has three capital cities?",
          hint: "Its executive, judicial and legislative capitals are all different cities.",
          options: ["South Africa", "Nigeria", "Kenya", "Egypt"], answerIndex: 0 }
      ]
    },
    {
      id: "language",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "How many official languages does Switzerland have?",
          hint: "They include German, French and Italian.",
          options: ["2", "3", "4", "5"], answerIndex: 2 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which language has the most native speakers of any language in the world?",
          hint: "Largely thanks to one country's enormous population.",
          options: ["Mandarin Chinese", "English", "Spanish", "Hindi"], answerIndex: 0 }
      ]
    },
    {
      id: "foodanddrink",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Sushi originates from which country?",
          hint: "Also famous for cherry blossoms and Mount Fuji.",
          options: ["Japan", "China", "Thailand", "South Korea"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which spice, derived from a crocus flower, is the most expensive by weight in the world?",
          hint: "It takes tens of thousands of hand-picked flower threads to produce just one pound.",
          options: ["Saffron", "Vanilla", "Cardamom", "Cinnamon"], answerIndex: 0 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     1986 — the birth year round.
  ------------------------------------------------------------------------ */
  y1986: [
    {
      id: "events1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "1986 is the year Natalie was born. Which of these also happened that year?",
          hint: "A nuclear power plant disaster in Soviet Ukraine.",
          options: ["The Chernobyl disaster", "The fall of the Berlin Wall", "The Millennium Bug panic", "The first iPhone launch"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which U.S. Space Shuttle disaster also happened in 1986?",
          hint: "It broke apart shortly after launch, watched live on TV by millions.",
          options: ["Columbia", "Challenger", "Discovery", "Atlantis"], answerIndex: 1 }
      ]
    },
    {
      id: "consoles1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "What iconic games console launched in the UK in 1986?",
          hint: "Grey box, two rectangular controllers, launched alongside Super Mario Bros.",
          options: ["The Nintendo Entertainment System", "The Sony Walkman", "The first CD player", "The VHS camcorder"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "The NES launched in the UK in 1986 — but which country got it first, in 1985?",
          hint: "Same country that gave the world Silicon Valley.",
          options: ["Japan", "USA", "France", "Canada"], answerIndex: 1 }
      ]
    },
    {
      id: "movies1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which Tom Cruise fighter-pilot film was released in 1986?",
          hint: "\"I feel the need... the need for speed.\"",
          options: ["Top Gun", "Days of Thunder", "The Right Stuff", "Iron Eagle"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which 1986 David Lynch film, starring Kyle MacLachlan, is famous for its severed-ear opening scene?",
          hint: "Also stars Isabella Rossellini and Dennis Hopper.",
          options: ["Blue Velvet", "Blade Runner", "The Elephant Man", "Eraserhead"], answerIndex: 0 }
      ]
    },
    {
      id: "music1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which artist released the groundbreaking claymation music video for \"Sledgehammer\" in 1986?",
          hint: "Former lead singer of Genesis, went solo.",
          options: ["Peter Gabriel", "Phil Collins", "Sting", "David Bowie"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which 1986 album became Bon Jovi's breakthrough, featuring \"Livin' on a Prayer\"?",
          hint: "Its title describes a precarious, risky situation.",
          options: ["Slippery When Wet", "7800° Fahrenheit", "New Jersey", "Keep the Faith"], answerIndex: 0 }
      ]
    },
    {
      id: "sports1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Argentina won the 1986 FIFA World Cup, held in which country?",
          hint: "It's the same country that also hosted the 1970 World Cup.",
          options: ["Mexico", "Spain", "Italy", "Brazil"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which Argentine footballer scored the infamous \"Hand of God\" goal at the 1986 World Cup?",
          hint: "He also scored the \"Goal of the Century\" in the very same match, against England.",
          options: ["Diego Maradona", "Jorge Valdano", "Carlos Bilardo", "Gary Lineker"], answerIndex: 0 }
      ]
    },
    {
      id: "royals1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which British royal couple married in 1986?",
          hint: "He's the Queen's second son; she later became famous for the nickname \"Fergie.\"",
          options: ["Prince Andrew and Sarah Ferguson", "Prince Charles and Diana", "Prince Edward and Sophie", "Princess Anne and Mark Phillips"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What title was bestowed on Prince Andrew and Sarah Ferguson upon their 1986 marriage?",
          hint: "The same ducal title once held by Andrew's grandfather, before he became King George VI.",
          options: ["Duke and Duchess of York", "Duke and Duchess of Kent", "Earl and Countess of Wessex", "Duke and Duchess of Sussex"], answerIndex: 0 }
      ]
    },
    {
      id: "space1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which famous comet, visible roughly once every 76 years, made an appearance in 1986?",
          hint: "Named after the astronomer who calculated its orbit.",
          options: ["Halley's Comet", "Hale-Bopp", "Comet NEOWISE", "Comet Encke"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What was the name of the Soviet space station that began operation in 1986 and stayed in orbit until 2001?",
          hint: "Its name means \"peace\" or \"world\" in Russian.",
          options: ["Mir", "Salyut 7", "Skylab", "Vostok"], answerIndex: 0 }
      ]
    },
    {
      id: "politics1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Who was President of the United States in 1986?",
          hint: "A former Hollywood actor.",
          options: ["Ronald Reagan", "Jimmy Carter", "George H.W. Bush", "Bill Clinton"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "Which US political scandal — covert arms sales to Iran used to fund Contra rebels in Nicaragua — broke into public view in 1986?",
          hint: "It involved a Marine officer named Oliver North.",
          options: ["Iran-Contra Affair", "Watergate", "Whitewater", "Teapot Dome"], answerIndex: 0 }
      ]
    },
    {
      id: "disasters1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "In 1986, a natural disaster in Cameroon released a deadly cloud of gas from a volcanic lake, killing over 1,700 people. What gas was it?",
          hint: "The same gas you breathe out.",
          options: ["Carbon dioxide", "Methane", "Hydrogen sulfide", "Chlorine"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the Cameroonian crater lake responsible for the deadly 1986 gas disaster?",
          hint: "A smaller, similar disaster happened at nearby Lake Monoun two years earlier, in 1984.",
          options: ["Lake Nyos", "Lake Kivu", "Lake Monoun", "Lake Victoria"], answerIndex: 0 }
      ]
    },
    {
      id: "astronomy1986",
      questions: [
        { difficulty: "easy", type: "multiple_choice", prompt: "Which planet did NASA's Voyager 2 spacecraft fly past in January 1986?",
          hint: "It's the seventh planet from the sun and rotates on its side.",
          options: ["Uranus", "Neptune", "Saturn", "Jupiter"], answerIndex: 0 },
        { difficulty: "hard", type: "multiple_choice", prompt: "What is the name of the largest moon of Uranus, imaged in detail for the first time by Voyager 2's 1986 flyby?",
          hint: "Named after the Queen of the Fairies in Shakespeare's 'A Midsummer Night's Dream.'",
          options: ["Titania", "Miranda", "Oberon", "Ariel"], answerIndex: 0 }
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
  homemovies: [
    {
      id: "dadsbackAttempt1",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Higher or lower — will Natalie stay on Dad's back for MORE or LESS than 15 seconds?",
          media: { kind: "youtube", youtubeId: "IsVVxFolxnM", maskDuration: true },
          options: ["Higher — more than 15 seconds", "Lower — less than 15 seconds"], answerIndex: 1 }
      ]
    },
    {
      id: "dadsbackAttempt2",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Attempt 1 lasted 12 seconds. Higher or lower — was Attempt 2 more or less than that?",
          media: { kind: "youtube", youtubeId: "T7tEWRHWo-4", maskDuration: true },
          options: ["Higher — more than 12 seconds", "Lower — less than 12 seconds"], answerIndex: 1 }
      ]
    },
    {
      id: "dadsbackAttempt3",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Attempt 2 lasted 11 seconds. Higher or lower — was the FINAL attempt more or less than that?",
          media: { kind: "youtube", youtubeId: "O7MKTE37NAU", maskDuration: true },
          options: ["Higher — more than 11 seconds", "Lower — less than 11 seconds"], answerIndex: 0 }
      ]
    },
    {
      id: "keyboardsong",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "What song is Natalie playing on the keyboard?",
          media: { kind: "youtube", youtubeId: "6pXrPWc2Deg" },
          options: ["Für Elise", "Greensleeves", "Ode to Joy", "Twinkle Twinkle Little Star"], answerIndex: 1 }
      ]
    },
    {
      id: "disneyBrerFox",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney character is this, spotted on the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "wSwGl5jK6m0" },
          options: ["Br'er Rabbit", "Br'er Fox", "Br'er Bear", "Uncle Remus"], answerIndex: 1 }
      ]
    },
    {
      id: "disneyTeacups",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney ride is this, from the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "2DnnP8uFzfo" },
          options: ["It's a Small World", "Peter Pan's Flight", "Teacups at the Mad Hatter's Tea Party", "Dumbo the Flying Elephant"], answerIndex: 2 }
      ]
    },
    {
      id: "disneyHonestJohn",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney character is this, spotted on the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "rgnRnKKYROQ" },
          options: ["Jiminy Cricket", "Honest John", "Gepetto", "Stromboli"], answerIndex: 1 }
      ]
    },
    {
      id: "disneyPinnochio",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney character is this, spotted on the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "-Q0o4S7AsgQ" },
          options: ["Pinnochio", "Peter Pan", "Aladdin", "Mowgli"], answerIndex: 0 }
      ]
    },
    {
      id: "disneyMickey",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney character is this, spotted on the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "gd_WG0OnmuM" },
          options: ["Donald Duck", "Goofy", "Mickey", "Pluto"], answerIndex: 2 }
      ]
    },
    {
      id: "disneyPluto",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Which Disney character is this, spotted on the family's 1993 Disney trip?",
          media: { kind: "youtube", youtubeId: "du5MDSN-ZI0" },
          options: ["Goofy", "Pluto", "Mickey", "Donald Duck"], answerIndex: 1 }
      ]
    },
    {
      id: "discoInferno",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Natalie's dancing at the disco — name the song!",
          media: { kind: "youtube", youtubeId: "hUHFd-rKlJ4" },
          options: ["Y.M.C.A.", "Stayin' Alive", "Disco Inferno", "I Will Survive"], answerIndex: 2 }
      ]
    },
    {
      id: "discoTimeWarp",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Natalie's dancing at the disco — name the song!",
          media: { kind: "youtube", youtubeId: "ZGcYKGpQV_A" },
          options: ["The Locomotion", "Time Warp", "Macarena", "Twist and Shout"], answerIndex: 1 }
      ]
    },
    {
      id: "discoCottonEyedJoe",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Natalie's dancing at the disco — name the song!",
          media: { kind: "youtube", youtubeId: "USIzRyyZOHA" },
          options: ["Achy Breaky Heart", "Cotton Eyed Joe", "Come On Eileen", "Electric Boogie"], answerIndex: 1 }
      ]
    },
    {
      id: "rideYkikiWave",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "rPseb6EVKeY" },
          options: ["Tidal Wave", "Wipeout", "Y-kiki Wave", "Wave Runner"], answerIndex: 2 }
      ]
    },
    {
      id: "rideChairOPlanes",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "aJ5vvMD7Tok" },
          options: ["Carousel", "Chair-o Planes", "Big Wheel", "Waltzers"], answerIndex: 1 }
      ]
    },
    {
      id: "rideGalaxy",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "s_rH7KYO3Gw" },
          options: ["Star Flyer", "Cosmic Bowl", "Galaxy", "Meteorite"], answerIndex: 2 }
      ]
    },
    {
      id: "rideCorkScrew",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "QBJZXxxzRlU" },
          options: ["Big Dipper", "Cork Screw", "Loop the Loop", "Twister"], answerIndex: 1 }
      ]
    },
    {
      id: "rideDodgems",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "LHZJr9JD4Po" },
          options: ["Ghost Train", "Helter Skelter", "Dodgems", "Waltzers"], answerIndex: 2 }
      ]
    },
    {
      id: "rideWaltzers",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "Y9FTN-xm6js" },
          options: ["Dodgems", "Waltzers", "Chair-o Planes", "Carousel"], answerIndex: 1 }
      ]
    },
    {
      id: "rideSpaceship",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "TFAyNLhAKLU" },
          options: ["Galaxy", "Rocket Ride", "Star Flyer", "Spaceship"], answerIndex: 3 }
      ]
    },
    {
      id: "rideCamakazi",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "Name this ride!",
          media: { kind: "youtube", youtubeId: "WNFOPS5V1ug" },
          options: ["Sizzler", "Twister", "Camakazi", "Enterprise"], answerIndex: 2 }
      ]
    },
    {
      id: "dadOnLilo",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "How long does it take Dad to get on the lilo?",
          media: { kind: "youtube", youtubeId: "-xbGP2nehvQ", maskDuration: true },
          options: ["1 minute 45 seconds", "2 minutes 30 seconds", "3 minutes 28 seconds", "4 minutes 50 seconds"], answerIndex: 2 }
      ]
    }
  ],

  /* ------------------------------------------------------------------------
     JOBS — Natalie's career timeline, early teens through twenties. Each
     job gets 2 questions; both share the same spotlighted row of
     images/jobs-timeline.png (rowTop/rowHeight are % of the full image,
     measured from the actual panel boundaries in that file). Content is
     real, checkable general knowledge tied to each role/era rather than
     invented personal anecdotes -- swap in real specifics any time.
  ------------------------------------------------------------------------ */
  jobs: [
    {
      id: "avonPrice",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 1: AVON — roughly how much would a bottle of Avon's iconic Skin So Soft bath oil have cost back in 1986?",
          // NOTE: exact 1986 catalog pricing isn't reliably documented online --
          // this is an inflation-based estimate (~1986 was a David-supplied year, check against a real family catalog if you have one).
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 0.00, rowHeight: 14.99 },
          options: ["99 cents", "$2.49", "$5.99", "$9.99"], answerIndex: 1 }
      ]
    },
    {
      id: "avonName",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 1: AVON — where does the Avon company name actually come from?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 0.00, rowHeight: 14.99 },
          options: ["The founder's daughter", "The River Avon, near Shakespeare's home", "A perfume ingredient", "The town it was founded in"], answerIndex: 1 }
      ]
    },
    {
      id: "newspaperAge",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 2: NEWSPAPER DELIVERY — under UK law, what's the minimum age to do a paper round?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 14.99, rowHeight: 15.32 },
          options: ["10", "13", "15", "16"], answerIndex: 1 }
      ]
    },
    {
      id: "newspaperFreebies",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 2: NEWSPAPER DELIVERY — 90s newspapers famously boosted sales by giving away free copies of what, tucked inside?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 14.99, rowHeight: 15.32 },
          options: ["CDs and cassettes", "Stickers only", "Pens", "Nothing — that's a myth"], answerIndex: 0 }
      ]
    },
    {
      id: "chefAlDente",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 3: CHEF, ITALIAN CAFE — what does \"al dente\" mean when cooking pasta?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 30.31, rowHeight: 15.76 },
          options: ["Very soft", "Firm to the bite", "Overcooked", "Served raw"], answerIndex: 1 }
      ]
    },
    {
      id: "chefPesto",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 3: CHEF, ITALIAN CAFE — alongside basil, garlic, pine nuts and olive oil, traditional pesto alla genovese uses which cheese?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 30.31, rowHeight: 15.76 },
          options: ["Mozzarella", "Parmesan", "Cheddar", "Brie"], answerIndex: 1 }
      ]
    },
    {
      id: "waitressTipping",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 4: WAITRESS, CAFE — how does UK tipping culture traditionally compare to the US?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 46.07, rowHeight: 12.96 },
          options: ["Expected at 20%+", "Optional, often just rounding up or ~10%", "Illegal", "Always added automatically"], answerIndex: 1 }
      ]
    },
    {
      id: "waitressCreamTea",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 4: WAITRESS, CAFE — a scone served with jam and clotted cream is traditionally known as a...?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 46.07, rowHeight: 12.96 },
          options: ["High tea", "Cream tea", "Elevenses", "Cuppa"], answerIndex: 1 }
      ]
    },
    {
      id: "bankScottishNotes",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 5: BANK TELLER, SCOTTISH BANK — what's unique about Scottish banks compared to the Bank of England?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 59.03, rowHeight: 13.62 },
          options: ["They use a different currency", "They're allowed to issue their own banknotes", "They don't use pounds", "They're unregulated"], answerIndex: 1 }
      ]
    },
    {
      id: "bankDyePack",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 5: BANK TELLER, SCOTTISH BANK — what's a bank \"dye pack\" actually for?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 59.03, rowHeight: 13.62 },
          options: ["Counting money faster", "Marking stolen cash with ink during a robbery", "Detecting counterfeit notes", "Cleaning banknotes"], answerIndex: 1 }
      ]
    },
    {
      id: "pubLastOrders",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 6: MANAGER, 'THE FLASK' — what does \"last orders\" traditionally signal in a UK pub?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 72.65, rowHeight: 13.01 },
          options: ["Happy hour starting", "Final chance to order drinks before closing", "A fire drill", "Free food time"], answerIndex: 1 }
      ]
    },
    {
      id: "pubPintSize",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 6: MANAGER, 'THE FLASK' — how many millilitres are in a standard UK pint?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 72.65, rowHeight: 13.01 },
          options: ["500ml", "568ml", "600ml", "750ml"], answerIndex: 1 }
      ]
    },
    {
      id: "teacherStartAge",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 7: PRIMARY SCHOOL TEACHER — what age do most children start primary school in the UK?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 85.67, rowHeight: 14.33 },
          options: ["3", "4-5", "6-7", "8"], answerIndex: 1 }
      ]
    },
    {
      id: "teacherReception",
      questions: [
        { difficulty: "easy", type: "multiple_choice",
          prompt: "JOB 7: PRIMARY SCHOOL TEACHER — what's the first year of primary school in England officially called?",
          media: { kind: "image-spotlight", src: "images/jobs-timeline.png", rowTop: 85.67, rowHeight: 14.33 },
          options: ["Kindergarten", "Reception", "Year Zero", "Nursery"], answerIndex: 1 }
      ]
    }
  ]
};
