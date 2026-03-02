(() => {
  const tg = window.Telegram && window.Telegram.WebApp;
  const bio = document.getElementById("bio");
  const bioCounter = document.getElementById("bioCounter");
  const looking = document.getElementById("looking");
  const minAge = document.getElementById("minAge");
  const maxAge = document.getElementById("maxAge");
  const isActive = document.getElementById("isActive");
  const saveBtn = document.getElementById("saveBtn");
  const status = document.getElementById("status");

  function setStatus(text) {
    status.textContent = text;
  }

  function clampAge(value) {
    const n = Number(value);
    if (!Number.isInteger(n)) return null;
    if (n < 18 || n > 99) return null;
    return n;
  }

  function updateCounter() {
    bioCounter.textContent = `${bio.value.length}/300`;
  }

  function validate() {
    const min = clampAge(minAge.value);
    const max = clampAge(maxAge.value);
    if (min === null || max === null) {
      return "Возраст должен быть в диапазоне 18-99.";
    }
    if (max < min) {
      return "Максимальный возраст должен быть не меньше минимального.";
    }
    if (bio.value.trim().length > 0 && bio.value.trim().length < 10) {
      return "Bio должен быть не короче 10 символов.";
    }
    return "";
  }

  function send() {
    const err = validate();
    if (err) {
      setStatus(err);
      return;
    }

    const payload = {
      bio: bio.value.trim(),
      looking_for: looking.value,
      min_age: Number(minAge.value),
      max_age: Number(maxAge.value),
      is_active: Boolean(isActive.checked),
    };

    if (!tg || typeof tg.sendData !== "function") {
      setStatus("Открой mini app из Telegram, чтобы сохранить изменения.");
      return;
    }

    saveBtn.disabled = true;
    tg.sendData(JSON.stringify(payload));
    setStatus("Данные отправлены. Проверь ответ бота в чате.");
    setTimeout(() => {
      saveBtn.disabled = false;
    }, 1200);
  }

  bio.addEventListener("input", updateCounter);
  saveBtn.addEventListener("click", send);
  updateCounter();

  if (tg) {
    tg.ready();
    tg.expand();
    setStatus("Готово к отправке.");
  } else {
    setStatus("Режим предпросмотра в браузере.");
  }
})();
