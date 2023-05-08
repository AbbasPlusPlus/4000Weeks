document.addEventListener("DOMContentLoaded", () => {
  const birthdayInput = document.getElementById("birthday");
  const submitButton = document.getElementById("submit-birthday");
  const lifeCanvas = document.getElementById("life-canvas");
  const ctx = lifeCanvas.getContext("2d");
  const changeBirthdayButton = document.getElementById("change-birthday");

  changeBirthdayButton.addEventListener("click", () => {
    document.getElementById("input-container").style.display = "block";
  });

  const drawLife = (livedWeeks) => {
    const width = 20;
    const height = 20;
    const padding = 2;
    const rows = 50;
    const columns = 80;
    let count = 0;

    lifeCanvas.width = columns * (width + padding) - padding;
    lifeCanvas.height = rows * (height + padding) - padding;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        count++;

        if (count <= livedWeeks) {
          ctx.fillStyle = "white";
        } else {
          ctx.fillStyle = "black";
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
        }

        ctx.fillRect(
          j * (width + padding),
          i * (height + padding),
          width,
          height
        );

        if (count > livedWeeks) {
          ctx.strokeRect(
            j * (width + padding),
            i * (height + padding),
            width,
            height
          );
        }
      }
    }
  };

  const calculateWeeksSinceBirth = (birthday) => {
    const now = new Date();
    const timeDiff = now - new Date(birthday);
    const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    return weeks;
  };

  submitButton.addEventListener("click", () => {
    const birthday = birthdayInput.value;
    if (!birthday) {
      return;
    }
    chrome.storage.local.set({ birthday }, () => {
      const livedWeeks = calculateWeeksSinceBirth(birthday);
      drawLife(livedWeeks);
      document.getElementById("input-container").style.display = "none";
    });
  });

  chrome.storage.local.get(["birthday"], ({ birthday }) => {
    if (birthday) {
      const livedWeeks = calculateWeeksSinceBirth(birthday);
      drawLife(livedWeeks);
      document.getElementById("input-container").style.display = "none";
    } else {
      document.getElementById("input-container").style.display = "block";
    }
  });
});
