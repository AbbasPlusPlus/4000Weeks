document.addEventListener("DOMContentLoaded", () => {
  const birthdayInput = document.getElementById("birthday");
  const submitButton = document.getElementById("submit-birthday");
  const lifeCanvas = document.getElementById("life-canvas");
  const ctx = lifeCanvas.getContext("2d");
  const changeBirthdayButton = document.getElementById("change-birthday");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text"); // Change this line

  changeBirthdayButton.addEventListener("click", () => {
    document.getElementById("input-container").style.display = "block";
  });
  const drawLife = (livedWeeks) => {
    const width = 14;
    const height = 14;
    const padding = 4;
    const rows = 50;
    const columns = 80;
    let count = 0;
    const offset = 2;
    const borderRadius = 2;

    lifeCanvas.width = columns * (width + padding) - padding + offset;
    lifeCanvas.height = rows * (height + padding) - padding + offset;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        count++;

        if (count <= livedWeeks) {
          ctx.fillStyle = "#D3D3D3";
        } else {
          ctx.fillStyle = "black";
          ctx.strokeStyle = "#D3D3D3";
          ctx.lineWidth = 2;
        }

        ctx.beginPath();
        ctx.moveTo(
          j * (width + padding) + borderRadius,
          i * (height + padding)
        );
        ctx.lineTo(
          j * (width + padding) + width - borderRadius,
          i * (height + padding)
        );
        ctx.quadraticCurveTo(
          j * (width + padding) + width,
          i * (height + padding),
          j * (width + padding) + width,
          i * (height + padding) + borderRadius
        );
        ctx.lineTo(
          j * (width + padding) + width,
          i * (height + padding) + height - borderRadius
        );
        ctx.quadraticCurveTo(
          j * (width + padding) + width,
          i * (height + padding) + height,
          j * (width + padding) + width - borderRadius,
          i * (height + padding) + height
        );
        ctx.lineTo(
          j * (width + padding) + borderRadius,
          i * (height + padding) + height
        );
        ctx.quadraticCurveTo(
          j * (width + padding),
          i * (height + padding) + height,
          j * (width + padding),
          i * (height + padding) + height - borderRadius
        );
        ctx.lineTo(
          j * (width + padding),
          i * (height + padding) + borderRadius
        );
        ctx.quadraticCurveTo(
          j * (width + padding),
          i * (height + padding),
          j * (width + padding) + borderRadius,
          i * (height + padding)
        );
        ctx.closePath();

        if (count <= livedWeeks) {
          ctx.fill();
        } else {
          ctx.stroke();
          ctx.fill();
        }
      }
    }
  };

  const updateProgressBar = (livedWeeks) => {
    const percentage = (livedWeeks / 4000) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;
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

      updateProgressBar(livedWeeks);
    });
  });

  chrome.storage.local.get(["birthday"], ({ birthday }) => {
    if (birthday) {
      const livedWeeks = calculateWeeksSinceBirth(birthday);
      drawLife(livedWeeks);
      document.getElementById("input-container").style.display = "none";

      updateProgressBar(livedWeeks);
    } else {
      document.getElementById("input-container").style.display = "block";
    }
  });
});
