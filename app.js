/* ============================================================================
   NATALIE'S 40th — APP LOGIC
   Vanilla JS, no build step. Reads everything from QUIZ_DATA (data.js).
============================================================================ */

const state = {
  playerName: "",
  score: 0,
  answered: 0,
  correct: 0,
  tapeAnswered: 0,
  tapeCorrect: 0,
  tapeScore: 0,
  currentCategory: null,
  currentQueue: [],   // array of {topic, sourceLabel}
  currentIndex: 0,
  currentTapeTitle: null,
  roundHistory: []    // [{ label, correct, answered, score }] -- one entry per completed tape, this session only
};

const SPINE_COLORS = ["#ff2e9a", "#00fff2", "#faff00", "#7c4dff", "#38ff8a", "#ff7a3d"];

document.addEventListener("DOMContentLoaded", () => {
  boot();
  document.getElementById("player-name").addEventListener("input", (e) => {
    state.playerName = e.target.value;
  });
});

/* ---------------------------- boot sequence ---------------------------- */
function boot(){
  showScreen("boot");
  setTimeout(() => {
    buildWelcome();
    showScreen("welcome");
  }, 2500);
}

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById("screen-" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
}

/* ---------------------------- welcome / tiles ---------------------------- */
function buildWelcome(){
  const wrap = document.getElementById("tiles");
  wrap.innerHTML = "";
  QUIZ_DATA.categories.forEach(cat => {
    const opensExternally = cat.id === "music" && QUIZ_DATA.event.musicRoundUrl;
    const tile = document.createElement("button");
    tile.className = "tile";
    tile.style.setProperty("--tile-color", cat.color);
    tile.innerHTML = `
      <div class="tile-corner">${opensExternally ? "OPENS \u2197" : "PLAY \u25B6"}</div>
      <div class="tile-icon">${categoryIcon(cat.id)}</div>
      <h2>${cat.label}</h2>
      <div class="tile-sub">${opensExternally ? "opens in a new tab" : cat.sub}</div>
    `;
    tile.addEventListener("click", () => enterCategory(cat.id));
    wrap.appendChild(tile);
  });
  updateScoreboard();

  // Only makes sense when this page is actually being served from a real
  // URL (GitHub Pages etc.) -- hidden when opened as a local file, since
  // there's nothing sensible to scan to in that case.
  const shareQr = document.getElementById("share-qr");
  if (shareQr){
    if (location.protocol !== "file:"){
      shareQr.style.display = "flex";
      document.getElementById("share-qr-url").textContent = location.href;
    } else {
      shareQr.style.display = "none";
    }
  }
}

function categoryIcon(id){
  return { movies: "\u{1F4FC}", music: "\u{1F3A7}", general: "\u{1F9E0}", y1986: "\u{1F4FE}", homemovies: "\u{1F4FD}" }[id] || "\u2B50";
}

function updateScoreboard(){
  const html = `
    <span>PLAYER: <b>${state.playerName ? escapeHtml(state.playerName) : "GUEST"}</b></span>
    <span>SCORE: <b>${state.score}</b></span>
    <span>ANSWERED: <b>${state.answered}</b></span>
  `;
  const main = document.getElementById("scoreboard");
  const mini = document.getElementById("scoreboard-mini");
  if (main) main.innerHTML = html;
  if (mini) mini.innerHTML = html;

  const finishBtn = document.getElementById("btn-finish-quiz");
  if (finishBtn) finishBtn.style.display = state.roundHistory.length > 0 ? "inline-block" : "none";
}

/* ---------------------------- category routing ---------------------------- */
function enterCategory(id){
  if (id === "music" && QUIZ_DATA.event.musicRoundUrl){
    window.open(QUIZ_DATA.event.musicRoundUrl, "_blank", "noopener");
    return;
  }
  state.currentCategory = id;
  if (id === "movies"){
    buildShelf();
    showScreen("movies");
  } else {
    const bank = id === "music" ? QUIZ_DATA.music
               : id === "general" ? QUIZ_DATA.general
               : id === "y1986" ? QUIZ_DATA.y1986
               : id === "homemovies" ? QUIZ_DATA.homemovies
               : [];
    state.currentQueue = bank.map(topic => ({ topic, sourceLabel: labelFor(id) }));
    state.currentIndex = 0;
    state.currentTapeTitle = labelFor(id);
    state.tapeAnswered = 0;
    state.tapeCorrect = 0;
    state.tapeScore = 0;
    if (state.currentQueue.length === 0){
      alert("No questions loaded for this category yet \u2014 add some in data.js!");
      showScreen("welcome");
      return;
    }
    showScreen("player");
    setupBlankPlayer(labelFor(id));
  }
}

function labelFor(id){
  const c = QUIZ_DATA.categories.find(c => c.id === id);
  return c ? c.label : id;
}

function backToWelcome(){
  destroyMaskedYouTube();
  buildWelcome();
  showScreen("welcome");
}

/* ---------------------------- movies: shelf ---------------------------- */
function buildShelf(){
  const shelf = document.getElementById("shelf");
  shelf.innerHTML = "";
  QUIZ_DATA.movies.forEach((movie, i) => {
    const glow = SPINE_COLORS[i % SPINE_COLORS.length];
    const spine = document.createElement("button");
    spine.className = "spine";
    spine.style.setProperty("--spine-glow", glow);
    spine.setAttribute("aria-label", "Play " + movie.title);
    spine.dataset.movieId = movie.id;
    spine.innerHTML = `<img src="${movie.spine || movie.file}" alt="${escapeHtml(movie.title)} spine">`;
    spine.addEventListener("click", () => selectMovie(movie, spine));
    shelf.appendChild(spine);
  });
}

function selectMovie(movie, spineEl){
  state.currentQueue = [{ topic: movie, sourceLabel: movie.title }];
  state.currentIndex = 0;
  state.currentTapeTitle = movie.title;
  state.tapeAnswered = 0;
  state.tapeCorrect = 0;
  state.tapeScore = 0;

  const flipFrom = spineEl ? {
    rect: spineEl.getBoundingClientRect(),
    spineSrc: spineEl.querySelector("img") ? spineEl.querySelector("img").src : (movie.spine || movie.file)
  } : null;

  showScreen("player");
  setupCoverPlayer(movie, flipFrom);
}

/* ---------------------------- player: cover reveal ---------------------------- */
function resetPlayerStageVisibility(){
  document.getElementById("player-stage").style.display = "";
  document.getElementById("player-controls").style.display = "";
  document.getElementById("stage-row").classList.remove("stage-row--split");
}

/* Once a tape starts playing, the reels/PRESS PLAY button have done their
   job -- hide them so the question gets the full screen (matters most on a
   TV where every inch counts). */
function hidePlayerStage(){
  document.getElementById("player-stage").style.display = "none";
  document.getElementById("player-controls").style.display = "none";
}

/* Movies keep their VHS cover on screen (it's part of the trivia, not just
   a placeholder) -- only hide the PRESS PLAY button, and switch the row
   into a side-by-side layout so the cover and the question sit landscape,
   both visible at once. */
function showMovieQuestionSideBySide(){
  document.getElementById("player-controls").style.display = "none";
  document.getElementById("stage-row").classList.add("stage-row--split");
}

function setupCoverPlayer(movie, flipFrom){
  resetPlayerStageVisibility();
  document.getElementById("player-title").textContent = movie.title;
  const stage = document.getElementById("player-stage-inner");
  stage.style.cssText = "";
  stage.className = "tape-cover";

  if (flipFrom){
    stage.innerHTML = `
      <img class="cover-img" src="${movie.file}" alt="${escapeHtml(movie.title)} VHS cover">
      <img class="spine-img" src="${flipFrom.spineSrc}" alt="">
    `;
    runShelfFlip(stage, flipFrom.rect);
  } else {
    stage.classList.add("pop-in");
    stage.innerHTML = `<img class="cover-img" src="${movie.file}" alt="${escapeHtml(movie.title)} VHS cover">`;
  }

  const playBtn = document.getElementById("btn-play-tape");
  playBtn.style.display = "inline-block";
  playBtn.disabled = false;
  playBtn.onclick = () => {
    playBtn.disabled = true;
    showMovieQuestionSideBySide();
    showDifficultyChoice();
  };
  document.getElementById("qpanel").style.display = "none";
}

/* FLIP-style animation: grows/rotates the cover out from the clicked spine's
   on-screen position, crossfading the spine art into the front cover. */
function runShelfFlip(stage, startRect){
  requestAnimationFrame(() => {
    const finalRect = stage.getBoundingClientRect();
    const dx = (startRect.left + startRect.width / 2) - (finalRect.left + finalRect.width / 2);
    const dy = (startRect.top + startRect.height / 2) - (finalRect.top + finalRect.height / 2);
    const scaleX = startRect.width / finalRect.width;
    const scaleY = startRect.height / finalRect.height;

    stage.style.transformOrigin = "center center";
    stage.style.transition = "none";
    stage.style.transform = `translate(${dx}px, ${dy}px) scale(${scaleX}, ${scaleY}) rotate(-6deg)`;
    stage.style.boxShadow = "none";
    // force reflow so the start state actually paints before we transition
    void stage.offsetWidth;

    const spineImg = stage.querySelector(".spine-img");
    const coverImg = stage.querySelector(".cover-img");

    requestAnimationFrame(() => {
      stage.style.transition = "transform .62s cubic-bezier(.2,.7,.2,1.05), box-shadow .5s ease .1s";
      stage.style.transform = "translate(0,0) scale(1,1) rotate(0deg)";
      stage.style.boxShadow = "";
      if (spineImg && coverImg){
        spineImg.style.transition = "opacity .3s ease .28s";
        coverImg.style.transition = "opacity .3s ease .28s";
        spineImg.style.opacity = "0";
        coverImg.style.opacity = "1";
      }
    });
  });
}

function setupBlankPlayer(title){
  resetPlayerStageVisibility();
  document.getElementById("player-title").textContent = title;
  const stage = document.getElementById("player-stage-inner");
  stage.style.cssText = "";
  stage.className = "tape-cover tape-blank pop-in";
  stage.innerHTML = `
    <div class="reels"><div class="reel"></div><div class="reel"></div></div>
    <div class="arcade neon-cyan">${escapeHtml(title.toUpperCase())}</div>
  `;

  const playBtn = document.getElementById("btn-play-tape");
  playBtn.style.display = "inline-block";
  playBtn.disabled = false;
  playBtn.onclick = () => {
    playBtn.disabled = true;
    hidePlayerStage();
    showDifficultyChoice();
  };
  document.getElementById("qpanel").style.display = "none";
}

/* ---------------------------- difficulty choice ---------------------------- */
function showDifficultyChoice(){
  const item = state.currentQueue[state.currentIndex];
  const panel = document.getElementById("qpanel");
  panel.style.display = "block";
  if (!item){
    finishTape();
    return;
  }
  document.getElementById("q-tag").textContent = (item.sourceLabel || "").toUpperCase();
  document.getElementById("q-count").textContent =
    `TOPIC ${state.currentIndex + 1} / ${state.currentQueue.length}`;
  document.getElementById("q-feedback").textContent = "";
  document.getElementById("q-feedback").className = "feedback";
  document.getElementById("q-media").style.display = "none";
  document.getElementById("q-media").innerHTML = "";
  document.getElementById("q-text-answer").style.display = "none";
  document.getElementById("q-options").style.display = "none";
  document.getElementById("btn-check-multi").style.display = "none";
  document.getElementById("btn-next-q").style.display = "none";
  document.getElementById("btn-next-q").disabled = true;

  if (item.topic.questions.length === 1){
    renderQuestion(item.topic.questions[0].difficulty || "easy");
    return;
  }

  const easyQ = item.topic.questions.find(q => q.difficulty === "easy");
  const hardQ = item.topic.questions.find(q => q.difficulty === "hard");
  const easyPts = pointsFor(easyQ);
  const hardPts = pointsFor(hardQ);

  document.getElementById("q-prompt").textContent = "Choose your difficulty:";
  const chooser = document.getElementById("diff-chooser");
  chooser.style.display = "flex";
  chooser.innerHTML = `
    <button type="button" class="btn diff-btn diff-easy">EASY <span>${easyPts} pts</span></button>
    <button type="button" class="btn pink diff-btn diff-hard">HARD <span>${hardPts} pts</span></button>
  `;
  chooser.querySelector(".diff-easy").onclick = () => renderQuestion("easy");
  chooser.querySelector(".diff-hard").onclick = () => renderQuestion("hard");
}

function pointsFor(q){
  if (!q) return 0;
  return q.points || (q.difficulty === "hard" ? 75 : 50);
}

const HINT_COST = 20;

/* ---------------------------- question engine ---------------------------- */
function renderQuestion(difficulty){
  const item = state.currentQueue[state.currentIndex];
  const panel = document.getElementById("qpanel");
  panel.style.display = "block";
  if (!item){
    finishTape();
    return;
  }
  const q = item.topic.questions.find(x => x.difficulty === difficulty) || item.topic.questions[0];
  document.getElementById("diff-chooser").style.display = "none";
  document.getElementById("btn-next-q").style.display = "inline-block";

  document.getElementById("q-tag").textContent = q.type === "video_reveal"
    ? `${(item.sourceLabel || "").toUpperCase()}`
    : `${(item.sourceLabel || "").toUpperCase()} \u2014 ${difficulty.toUpperCase()} (${pointsFor(q)} PTS)`;
  document.getElementById("q-prompt").textContent = q.prompt;
  document.getElementById("q-count").textContent =
    `TOPIC ${state.currentIndex + 1} / ${state.currentQueue.length}`;
  document.getElementById("q-feedback").textContent = "";
  document.getElementById("q-feedback").className = "feedback";

  const hintBtn = document.getElementById("btn-hint");
  const hintText = document.getElementById("hint-text");
  hintText.style.display = "none";
  hintText.textContent = "";
  if (q.hint){
    hintBtn.style.display = "inline-block";
    hintBtn.disabled = false;
    hintBtn.textContent = `💡 HINT (-${HINT_COST} PTS)`;
    hintBtn.onclick = () => {
      hintText.textContent = q.hint;
      hintText.style.display = "block";
      hintBtn.disabled = true;
      hintBtn.textContent = `💡 HINT USED (-${HINT_COST})`;
      state.score = Math.max(0, state.score - HINT_COST);
      state.tapeScore = Math.max(0, state.tapeScore - HINT_COST);
      updateScoreboard();
    };
  } else {
    hintBtn.style.display = "none";
  }

  destroyMaskedYouTube();
  const media = document.getElementById("q-media");
  media.innerHTML = "";
  media.style.display = "none";
  if (q.media){
    const m = q.media;
    media.style.display = "block";
    if (m.kind === "image"){
      media.innerHTML = `<img src="${m.src}" alt="Picture round image">`;
    } else if (m.kind === "audio"){
      media.innerHTML = `<audio controls src="${m.src}"></audio>`;
    } else if (m.kind === "video"){
      const cls = m.maskDuration ? ' class="mask-duration"' : "";
      media.innerHTML = `<video controls${cls} src="${encodeURI(m.src)}"></video>`;
      if (m.start != null || m.end != null){
        setupVideoTrim(media.querySelector("video"), m.start || 0, m.end);
      }
    } else if (m.kind === "youtube" && m.youtubeId){
      setupMaskedYouTube(media, m.youtubeId, m.start, m.end);
    }
  }

  const optionsWrap = document.getElementById("q-options");
  const textWrap = document.getElementById("q-text-answer");
  const checkBtn = document.getElementById("btn-check-multi");
  optionsWrap.innerHTML = "";
  textWrap.style.display = "none";
  optionsWrap.style.display = "none";
  checkBtn.style.display = "none";

  const showAnswerBtn = document.getElementById("btn-show-answer");
  const answerMedia = document.getElementById("q-answer-media");
  showAnswerBtn.style.display = "none";
  answerMedia.style.display = "none";
  answerMedia.innerHTML = "";

  const nextBtn = document.getElementById("btn-next-q");
  nextBtn.disabled = true;

  if (q.type === "video_reveal"){
    if (q.attempts && q.attempts.length){
      renderAttemptsFlow(q.attempts, nextBtn);
    } else {
      showAnswerBtn.style.display = "inline-block";
      showAnswerBtn.disabled = false;
      showAnswerBtn.onclick = () => revealVideoAnswer(q, showAnswerBtn, nextBtn);
    }
  } else if (q.type === "text"){
    textWrap.style.display = "flex";
    const input = document.getElementById("text-answer-input");
    input.value = "";
    input.disabled = false;
    input.focus();
    document.getElementById("btn-submit-text").disabled = false;
    document.getElementById("btn-submit-text").onclick = () => submitTextAnswer(q, nextBtn);
    input.onkeydown = (e) => { if (e.key === "Enter") submitTextAnswer(q, nextBtn); };
  } else {
    optionsWrap.style.display = "flex";
    const multi = q.type === "multi_select";
    const checkBtn = document.getElementById("btn-check-multi");
    checkBtn.style.display = multi ? "inline-block" : "none";
    checkBtn.disabled = true;
    const chosen = new Set();
    q.options.forEach((opt, idx) => {
      const b = document.createElement("button");
      b.className = "option";
      b.type = "button";
      b.textContent = opt;
      b.addEventListener("click", () => {
        if (multi){
          if (chosen.has(idx)){ chosen.delete(idx); b.classList.remove("selected"); }
          else { chosen.add(idx); b.classList.add("selected"); }
          checkBtn.disabled = chosen.size === 0;
        } else {
          gradeSingleChoice(q, idx, optionsWrap);
        }
      });
      optionsWrap.appendChild(b);
    });
    if (multi){
      checkBtn.onclick = () => {
        checkBtn.disabled = true;
        gradeMultiSelect(q, Array.from(chosen), optionsWrap);
      };
    }
  }
}

function gradeSingleChoice(q, idx, optionsWrap){
  const buttons = optionsWrap.querySelectorAll(".option");
  buttons.forEach(b => b.disabled = true);
  const isCorrect = idx === q.answerIndex;
  buttons[idx].classList.add(isCorrect ? "correct" : "wrong");
  if (!isCorrect) buttons[q.answerIndex].classList.add("correct");
  registerAnswer(isCorrect, pointsFor(q));
  document.getElementById("btn-next-q").disabled = false;
}

function gradeMultiSelect(q, chosenArr, optionsWrap){
  const buttons = optionsWrap.querySelectorAll(".option");
  buttons.forEach(b => b.disabled = true);
  const correctSet = new Set(q.answerIndexes);
  const chosenSet = new Set(chosenArr);
  let isCorrect = correctSet.size === chosenSet.size && [...correctSet].every(i => chosenSet.has(i));
  buttons.forEach((b, idx) => {
    if (correctSet.has(idx)) b.classList.add("correct");
    else if (chosenSet.has(idx)) b.classList.add("wrong");
  });
  registerAnswer(isCorrect, pointsFor(q));
  document.getElementById("btn-next-q").disabled = false;
}

/* Trims a local <video> to [start,end] without re-encoding: jumps to `start`
   once metadata loads (so the paused thumbnail is already correct), and
   auto-pauses at `end` during playback. */
function setupVideoTrim(video, start, end){
  if (!video) return;
  video.addEventListener("loadedmetadata", () => {
    try { video.currentTime = start; } catch (e) {}
  }, { once: true });
  if (end != null){
    video.addEventListener("timeupdate", () => {
      if (video.currentTime >= end){
        video.pause();
        video.currentTime = end;
      }
    });
  }
}

/* ---------------------------- masked YouTube audio ---------------------------- */
/* "Name that tune" rounds embed a real YouTube clip, but the native player
   (thumbnail, title bar, on-screen video) would give away the song/artist
   before it's even played. Instead of trusting YouTube's own UI-hiding
   options (inconsistent, and still flashes a thumbnail), the actual player
   is rendered fully invisible (opacity:0 -- audio keeps playing, nothing is
   ever on screen) behind our own "mystery track" cover with its own PLAY
   button, built with the YouTube IFrame Player API so we can drive
   play/pause without touching YouTube's real UI at all. */
let ytApiLoadPromise = null;
let currentYtPlayer = null;

function loadYouTubeAPI(){
  if (window.YT && window.YT.Player) return Promise.resolve();
  if (ytApiLoadPromise) return ytApiLoadPromise;
  ytApiLoadPromise = new Promise((resolve) => {
    const prevReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (typeof prevReady === "function") prevReady();
      resolve();
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
  return ytApiLoadPromise;
}

function destroyMaskedYouTube(){
  if (currentYtPlayer){
    try { currentYtPlayer.destroy(); } catch (e) {}
    currentYtPlayer = null;
  }
}

async function setupMaskedYouTube(container, youtubeId, start, end){
  container.innerHTML = `
    <div class="yt-embed yt-embed--masked">
      <div class="yt-mystery-cover">
        <div class="yt-mystery-reels"><div class="reel"></div><div class="reel"></div></div>
        <div class="yt-mystery-label">MYSTERY TRACK</div>
        <button type="button" class="btn yellow yt-mystery-playbtn">&#9654; PLAY CLIP</button>
      </div>
      <div class="yt-player-target"></div>
    </div>
  `;
  const targetEl = container.querySelector(".yt-player-target");
  const playBtn = container.querySelector(".yt-mystery-playbtn");
  const label = container.querySelector(".yt-mystery-label");
  const reels = container.querySelector(".yt-mystery-reels");

  // Guards against clicking PLAY before the player's API is actually ready
  // (new YT.Player(...) returns immediately, but playVideo()/seekTo() etc.
  // only exist once onReady fires -- calling them earlier throws).
  playBtn.disabled = true;
  playBtn.textContent = "LOADING…";

  await loadYouTubeAPI();
  // the question may have moved on while the API script was loading
  if (!container.contains(targetEl)) return;

  const playerVars = {
    controls: 0, disablekb: 1, fs: 0, iv_load_policy: 3,
    modestbranding: 1, rel: 0, playsinline: 1, start: start || 0
  };
  if (end != null) playerVars.end = end;

  const player = new YT.Player(targetEl, {
    host: "https://www.youtube-nocookie.com",
    videoId: youtubeId,
    playerVars,
    events: {
      onReady: (e) => {
        // the target div gets replaced by YouTube's own iframe -- re-apply
        // the class so it stays full-size and invisible (opacity:0)
        e.target.getIframe().classList.add("yt-player-target");
        playBtn.disabled = false;
        playBtn.textContent = "▶ PLAY CLIP";
      },
      onStateChange: (e) => {
        if (e.data === YT.PlayerState.PLAYING){
          reels.classList.add("spinning");
        } else if (e.data === YT.PlayerState.ENDED){
          reels.classList.remove("spinning");
          label.textContent = "CLIP ENDED";
          playBtn.textContent = "▶ REPLAY CLIP";
          playBtn.style.display = "inline-block";
        } else {
          reels.classList.remove("spinning");
        }
      }
    }
  });
  currentYtPlayer = player;

  playBtn.onclick = () => {
    if (playBtn.disabled) return;
    playBtn.style.display = "none";
    label.textContent = "NOW PLAYING…";
    try {
      player.seekTo(start || 0, true);
      player.playVideo();
    } catch (e) {
      label.textContent = "COULDN'T PLAY — TRY AGAIN";
      playBtn.style.display = "inline-block";
      playBtn.textContent = "▶ PLAY CLIP";
    }
  };
}

/* Sequential "guess, reveal, guess again" flow: shows one attempt at a time,
   each with its own REVEAL ANSWER button; revealing one brings the next one
   on screen, until the final attempt unlocks NEXT. */
function renderAttemptsFlow(attempts, nextBtn){
  const wrap = document.getElementById("q-answer-media");
  wrap.innerHTML = "";
  wrap.style.display = "flex";
  showAttempt(attempts, 0, wrap, nextBtn);
}

function showAttempt(attempts, idx, wrap, nextBtn){
  if (idx >= attempts.length){
    nextBtn.disabled = false;
    return;
  }
  const attempt = attempts[idx];
  const block = document.createElement("div");
  block.className = "answer-clip";
  block.innerHTML = `
    <div class="answer-clip-label">${escapeHtml(attempt.label || "")}</div>
    <video controls class="mask-duration" src="${encodeURI(attempt.src)}"></video>
    <button type="button" class="btn yellow attempt-reveal-btn">REVEAL ANSWER</button>
    <div class="answer-text-line attempt-answer-text" style="display:none;"></div>
  `;
  wrap.appendChild(block);

  const revealBtn = block.querySelector(".attempt-reveal-btn");
  const answerLine = block.querySelector(".attempt-answer-text");
  revealBtn.onclick = () => {
    revealBtn.disabled = true;
    answerLine.style.display = "block";
    answerLine.textContent = attempt.answerText || "";
    showAttempt(attempts, idx + 1, wrap, nextBtn);
  };
}

function revealVideoAnswer(q, showAnswerBtn, nextBtn){
  showAnswerBtn.disabled = true;
  const wrap = document.getElementById("q-answer-media");
  wrap.innerHTML = "";
  wrap.style.display = "flex";

  if (q.answerText){
    const line = document.createElement("div");
    line.className = "answer-text-line";
    line.textContent = q.answerText;
    wrap.appendChild(line);
  }

  (q.answerClips || []).forEach(clip => {
    const block = document.createElement("div");
    block.className = "answer-clip";
    block.innerHTML = `
      <div class="answer-clip-label">${escapeHtml(clip.label || "")}</div>
      <video controls class="mask-duration" src="${encodeURI(clip.src)}"></video>
      ${clip.caption ? `<div class="answer-clip-caption">${escapeHtml(clip.caption)}</div>` : ""}
    `;
    wrap.appendChild(block);
  });

  nextBtn.disabled = false;
}

function submitTextAnswer(q, nextBtn){
  const input = document.getElementById("text-answer-input");
  input.disabled = true;
  document.getElementById("btn-submit-text").disabled = true;
  const given = normalize(input.value);
  const accepted = [q.answerText, ...(q.accepted || [])].map(normalize);
  const isCorrect = accepted.includes(given);
  const fb = document.getElementById("q-feedback");
  fb.textContent = isCorrect ? "\u2713 CORRECT!" : `\u2717 ANSWER: ${q.answerText.toUpperCase()}`;
  fb.className = "feedback " + (isCorrect ? "good" : "bad");
  registerAnswer(isCorrect, pointsFor(q));
  nextBtn.disabled = false;
}

function normalize(s){ return (s || "").trim().toLowerCase().replace(/\s+/g, " "); }

function registerAnswer(isCorrect, points){
  state.answered++;
  state.tapeAnswered++;
  if (isCorrect){
    state.correct++;
    state.tapeCorrect++;
    state.score += (points || 100);
    state.tapeScore += (points || 100);
    flashFeedback(true);
  } else {
    flashFeedback(false);
  }
  updateScoreboard();
}

function flashFeedback(isCorrect){
  const fb = document.getElementById("q-feedback");
  if (fb.textContent) return; // text-answer already set a message
  fb.textContent = isCorrect ? "\u2713 CORRECT!" : "\u2717 NOT QUITE";
  fb.className = "feedback " + (isCorrect ? "good" : "bad");
}

function nextQuestion(){
  state.currentIndex++;
  if (state.currentIndex >= state.currentQueue.length){
    finishTape();
  } else {
    showDifficultyChoice();
  }
}

function finishTape(){
  destroyMaskedYouTube();
  state.roundHistory.push({
    label: state.currentTapeTitle || "",
    correct: state.tapeCorrect,
    answered: state.tapeAnswered,
    score: state.tapeScore
  });
  document.getElementById("results-player").textContent =
    "PLAYER: " + (state.playerName ? state.playerName.toUpperCase() : "GUEST");
  document.getElementById("results-score").textContent = state.score;
  const pct = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  document.getElementById("results-detail").innerHTML =
    `${escapeHtml(state.currentTapeTitle || "")} finished \u2014 ${state.tapeCorrect}/${state.tapeAnswered} correct on this tape.<br>` +
    `Running total: ${state.correct}/${state.answered} correct (${pct}%).`;
  showScreen("results");
}

/* "FINISH QUIZ" -- a one-screen combined summary of every round played this
   session, entirely client-side: nothing here is ever sent or saved
   anywhere, it's just read from in-memory state and disappears on reload. */
function showFinalScore(){
  destroyMaskedYouTube();
  document.getElementById("final-player").textContent =
    "PLAYER: " + (state.playerName ? state.playerName.toUpperCase() : "GUEST");
  document.getElementById("final-score").textContent = state.score;
  const pct = state.answered ? Math.round((state.correct / state.answered) * 100) : 0;
  document.getElementById("final-summary").textContent =
    `${state.correct}/${state.answered} correct overall (${pct}%).`;

  const breakdown = document.getElementById("final-breakdown");
  breakdown.innerHTML = "";
  state.roundHistory.forEach(round => {
    const row = document.createElement("div");
    row.className = "final-round-row";
    row.innerHTML = `
      <span class="final-round-label">${escapeHtml(round.label)}</span>
      <span class="final-round-score">${round.correct}/${round.answered} \u2014 ${round.score} pts</span>
    `;
    breakdown.appendChild(row);
  });

  showScreen("final");
}

function playAnother(){
  destroyMaskedYouTube();
  buildWelcome();
  showScreen("welcome");
}

function rewatchShelf(){
  destroyMaskedYouTube();
  if (state.currentCategory === "movies"){
    buildShelf();
    showScreen("movies");
  } else {
    buildWelcome();
    showScreen("welcome");
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}
