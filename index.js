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

  document.querySelectorAll(".nav-option").forEach((option) => {
    option.addEventListener("click", () => {
      document
        .querySelectorAll(".nav-option")
        .forEach((o) => o.classList.remove("active"));
      option.classList.add("active");
      chrome.storage.local.set({ selectedOption: option.id });
    });
  });

  chrome.storage.local.get(["selectedOption"], ({ selectedOption }) => {
    if (!selectedOption) {
      selectedOption = "nav-life";
      chrome.storage.local.set({ selectedOption });
    }
    document.getElementById(selectedOption).classList.add("active");
  });

  const drawLife = (livedWeeks) => {
    const width = 14;
    const height = 14;
    const padding = 4;
    const rows = 50;
    const columns = 80;
    let count = 0;
    const borderRadius = 2;
    const margin = 2;
    lifeCanvas.width = columns * (width + padding) + margin * 2 - padding;
    lifeCanvas.height = rows * (height + padding) + margin * 2 - padding;

    let xStart = margin;
    let yStart = margin;

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
        ctx.moveTo(xStart + borderRadius, yStart);
        ctx.lineTo(xStart + width - borderRadius, yStart);
        ctx.quadraticCurveTo(
          xStart + width,
          yStart,
          xStart + width,
          yStart + borderRadius
        );
        ctx.lineTo(xStart + width, yStart + height - borderRadius);
        ctx.quadraticCurveTo(
          xStart + width,
          yStart + height,
          xStart + width - borderRadius,
          yStart + height
        );
        ctx.lineTo(xStart + borderRadius, yStart + height);
        ctx.quadraticCurveTo(
          xStart,
          yStart + height,
          xStart,
          yStart + height - borderRadius
        );
        ctx.lineTo(xStart, yStart + borderRadius);
        ctx.quadraticCurveTo(xStart, yStart, xStart + borderRadius, yStart);
        ctx.closePath();

        if (count <= livedWeeks) {
          ctx.fill();
        } else {
          ctx.stroke();
          ctx.fill();
        }

        xStart += width + padding; // Update xStart for the next square
      }

      xStart = margin; // Reset xStart for the next row
      yStart += height + padding; // Update yStart for the next row
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
