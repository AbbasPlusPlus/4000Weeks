document.addEventListener("DOMContentLoaded", () => {
  const ids = [
    "birthday",
    "submit-birthday",
    "life-canvas",
    "change-birthday",
    "progress-bar",
    "progress-text",
    "input-container",
  ];
  const [
    birthdayInput,
    submitButton,
    lifeCanvas,
    changeBirthdayButton,
    progressBar,
    progressText,
    inputContainer,
  ] = ids.map((id) => document.getElementById(id));
  const ctx = lifeCanvas.getContext("2d");
  // Handle click on "Change Birthday" button
  changeBirthdayButton.addEventListener("click", () => {
    inputContainer.style.display = "block";
  });

  // Function to draw squares
  function drawSquares(livedUnits, config) {
    let count = 0;
    lifeCanvas.width =
      config.columns * (config.width + config.padding) +
      config.margin * 2 -
      config.padding;
    lifeCanvas.height =
      config.rows * (config.height + config.padding) +
      config.margin * 2 -
      config.padding;

    let xStart = config.margin;
    let yStart = config.margin;

    // Loop to draw each square
    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.columns; j++) {
        count++;

        if (count <= livedUnits) {
          drawSquare(
            xStart,
            yStart,
            config.width,
            config.height,
            config.borderRadius,
            "#D3D3D3"
          );
        } else {
          drawSquare(
            xStart,
            yStart,
            config.width,
            config.height,
            config.borderRadius,
            "black",
            "#D3D3D3"
          );
        }

        xStart += config.width + config.padding;
      }

      xStart = config.margin;
      yStart += config.height + config.padding;
    }
  }

  // Function to draw a single square
  const drawSquare = (
    xStart,
    yStart,
    width,
    height,
    borderRadius,
    fillColor,
    strokeColor
  ) => {
    // Set up drawing settings
    ctx.fillStyle = fillColor;
    if (strokeColor) {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2;
    }

    // Draw a single square
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

    if (strokeColor) {
      ctx.stroke();
    }
    ctx.fill();
  };

  // Update progress bar
  const updateProgressBar = (livedUnits, totalUnits) => {
    const percentage = (livedUnits / totalUnits) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${Math.round(percentage)}%`;
  };

  // Calculate the weeks since birth
  const calculateWeeksSinceBirth = (birthday) => {
    const now = new Date();
    const timeDiff = now - new Date(birthday);
    const weeks = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7));
    return weeks;
  };

  // Calculate the days since start of the year
  const calculateDaysSinceStartOfYear = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const timeDiff = now - startOfYear;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    return days;
  };

  // Calculate the hours since the start of the month
  const calculateHoursSinceStartOfMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const timeDiff = now - startOfMonth;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    return hours;
  };

  // Calculate the minutes since midnight
  const calculateMinutesSinceMidnight = () => {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const timeDiff = now - startOfDay;
    const minutes = Math.floor(timeDiff / (1000 * 60));
    return minutes;
  };

  const updateDisplay = (birthday, selectedOption) => {
    const { calculateUnits, config, maxUnits } =
      optionsConfig[selectedOption || "nav-life"];
    const livedUnits = calculateUnits(birthday);
    drawSquares(livedUnits, config);
    updateProgressBar(livedUnits, maxUnits);
    inputContainer.style.display = birthday ? "none" : "block";
    changeBirthdayButton.style.display =
      selectedOption === "nav-life" ? "block" : "none";
  };

  const updateSelectedOption = (selectedOption) => {
    document
      .querySelectorAll(".nav-option")
      .forEach((o) => o.classList.remove("active"));
    document.getElementById(selectedOption).classList.add("active");
    changeBirthdayButton.style.display =
      selectedOption === "nav-life" ? "block" : "none";
    chrome.storage.local.set({ selectedOption });
  };

  // Configuration object for each option
  const optionsConfig = {
    "nav-life": {
      config: {
        width: 12,
        height: 12,
        padding: 4,
        rows: 50,
        columns: 80,
        borderRadius: 2,
        margin: 2,
      },
      maxUnits: 4000,
      calculateUnits: calculateWeeksSinceBirth,
    },
    "nav-year": {
      config: {
        width: 22,
        height: 22,
        padding: 4,
        rows: 10,
        columns: 40,
        borderRadius: 4,
        margin: 2,
      },
      maxUnits: 365,
      calculateUnits: calculateDaysSinceStartOfYear,
    },
    "nav-month": {
      config: {
        width: 16,
        height: 16,
        padding: 4,
        rows: 15,
        columns: 50,
        borderRadius: 3,
        margin: 2,
      },
      maxUnits: 744,
      calculateUnits: calculateHoursSinceStartOfMonth,
    },
    "nav-day": {
      config: {
        width: 16,
        height: 16,
        padding: 4,
        rows: 24,
        columns: 60,
        borderRadius: 2,
        margin: 1,
      },
      maxUnits: 1440,
      calculateUnits: calculateMinutesSinceMidnight,
    },
  };

  submitButton.addEventListener("click", () => {
    const birthday = birthdayInput.value;
    if (!birthday) {
      return;
    }
    chrome.storage.local.set({ birthday }, () => {
      chrome.storage.local.get(["selectedOption"], ({ selectedOption }) => {
        updateDisplay(birthday, selectedOption);
      });
    });
  });

  // Get saved birthday and update display accordingly
  chrome.storage.local.get(
    ["birthday", "selectedOption"],
    ({ birthday, selectedOption = "nav-life" }) => {
      if (birthday) {
        updateDisplay(birthday, selectedOption);
      } else {
        inputContainer.style.display = "block";
      }
    }
  );

  // Get selected option and update display accordingly
  chrome.storage.local.get(
    ["selectedOption"],
    ({ selectedOption = "nav-life" }) => {
      updateSelectedOption(selectedOption);

      chrome.storage.local.get(["birthday"], ({ birthday }) => {
        if (birthday) {
          updateDisplay(birthday, selectedOption);
        }
      });
    }
  );

  document.querySelectorAll(".nav-option").forEach((option) => {
    option.addEventListener("click", () => {
      // remove active class from all options
      document
        .querySelectorAll(".nav-option")
        .forEach((o) => o.classList.remove("active"));

      // add active class to clicked option
      option.classList.add("active");

      // store selected option
      chrome.storage.local.set({ selectedOption: option.id }, () => {
        // Get saved birthday and update display accordingly
        chrome.storage.local.get(["birthday"], ({ birthday }) => {
          if (birthday) {
            updateDisplay(birthday, option.id);
          } else {
            inputContainer.style.display = "block";
          }
        });
      });
    });
  });
});
