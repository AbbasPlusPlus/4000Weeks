document.addEventListener("DOMContentLoaded", () => {
  // Setting up constants and variables
  const birthdayInput = document.getElementById("birthday");
  const submitButton = document.getElementById("submit-birthday");
  const lifeCanvas = document.getElementById("life-canvas");
  const ctx = lifeCanvas.getContext("2d");
  const changeBirthdayButton = document.getElementById("change-birthday");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");

  // Handle click on "Change Birthday" button
  changeBirthdayButton.addEventListener("click", () => {
    document.getElementById("input-container").style.display = "block";
  });

  // Function to draw life
  const drawLife = (livedWeeks) => {
    const config = {
      width: 12,
      height: 12,
      padding: 4,
      rows: 50,
      columns: 80,
      borderRadius: 2,
      margin: 2,
    };
    drawSquares(livedWeeks, config);
  };

  // Function to draw year
  const drawYear = (livedDays) => {
    const config = {
      width: 22,
      height: 22,
      padding: 4,
      rows: 10,
      columns: 40,
      borderRadius: 4,
      margin: 2,
    };
    drawSquares(livedDays, config);
  };

  // Function to draw month
  const drawMonth = (livedHours) => {
    const config = {
      width: 16,
      height: 16,
      padding: 4,
      rows: 15,
      columns: 50,
      borderRadius: 3,
      margin: 2,
    };
    drawSquares(livedHours, config);
  };

  // Function to draw day
  const drawDay = (livedMinutes) => {
    const config = {
      width: 16,
      height: 16,
      padding: 4,
      rows: 24,
      columns: 60,
      borderRadius: 2,
      margin: 1,
    };
    drawSquares(livedMinutes, config);
  };

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

  submitButton.addEventListener("click", () => {
    const birthday = birthdayInput.value;
    if (!birthday) {
      return;
    }
    chrome.storage.local.set({ birthday }, () => {
      chrome.storage.local.get(["selectedOption"], ({ selectedOption }) => {
        if (selectedOption === "nav-life") {
          const livedWeeks = calculateWeeksSinceBirth(birthday);
          drawLife(livedWeeks);
          updateProgressBar(livedWeeks, 4000); // Update progress bar for life
          document.getElementById("input-container").style.display = "none";
        } else if (selectedOption === "nav-month") {
          const livedHours = calculateHoursSinceStartOfMonth();
          drawMonth(livedHours);
          updateProgressBar(livedHours, 744); // Update progress bar for month (24 hours * 31 days)
        } else if (selectedOption === "nav-day") {
          const livedMinutes = calculateMinutesSinceMidnight();
          drawDay(livedMinutes);
          updateProgressBar(livedMinutes, 1440); // Update progress bar for day (24 hours * 60 minutes)
        }
      });
    });
  });

  // Get saved birthday and update display accordingly
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

  // Get selected option and update display accordingly
  chrome.storage.local.get(["selectedOption"], ({ selectedOption }) => {
    if (!selectedOption) {
      selectedOption = "nav-life";
      chrome.storage.local.set({ selectedOption });
    }
    document.getElementById(selectedOption).classList.add("active");

    if (selectedOption === "nav-year") {
      const livedDays = calculateDaysSinceStartOfYear();
      drawYear(livedDays);
      updateProgressBar(livedDays, 365); // Update progress bar for year
    } else if (selectedOption === "nav-month") {
      const livedHours = calculateHoursSinceStartOfMonth();
      drawMonth(livedHours);
      updateProgressBar(livedHours, 744); // Update progress bar for month (24 hours * 31 days)
    } else if (selectedOption === "nav-day") {
      const livedMinutes = calculateMinutesSinceMidnight();
      drawDay(livedMinutes);
      updateProgressBar(livedMinutes, 1440); // Update progress bar for day (24 hours * 60 minutes)
    } else {
      const livedWeeks = calculateWeeksSinceBirth(birthday);
      drawLife(livedWeeks);
      document.getElementById("input-container").style.display = "none";
      updateProgressBar(livedWeeks);
    }
  });

  // Handle click on navigation options
  document.querySelectorAll(".nav-option").forEach((option) => {
    option.addEventListener("click", () => {
      // remove active class from all options
      document
        .querySelectorAll(".nav-option")
        .forEach((o) => o.classList.remove("active"));
      // add active class to clicked option
      option.classList.add("active");
      // store selected option
      chrome.storage.local.set({ selectedOption: option.id });

      // Get saved birthday and update display accordingly
      chrome.storage.local.get(
        ["birthday", "selectedOption"],
        ({ birthday, selectedOption }) => {
          if (birthday) {
            if (selectedOption === "nav-life" || !selectedOption) {
              const livedWeeks = calculateWeeksSinceBirth(birthday);
              drawLife(livedWeeks);
              updateProgressBar(livedWeeks, 4000); // Update progress bar for life
              document.getElementById("input-container").style.display = "none";
            } else if (selectedOption === "nav-year") {
              const livedDays = calculateDaysSinceStartOfYear();
              drawYear(livedDays);
              updateProgressBar(livedDays, 365); // Update progress bar for year
            } else if (selectedOption === "nav-month") {
              const livedHours = calculateHoursSinceStartOfMonth();
              drawMonth(livedHours);
              updateProgressBar(livedHours, 744); // Update progress bar for month (24 hours * 31 days)
            } else if (selectedOption === "nav-day") {
              const livedMinutes = calculateMinutesSinceMidnight();
              drawDay(livedMinutes);
              updateProgressBar(livedMinutes, 1440); // Update progress bar for day (24 hours * 60 minutes)
            }
          } else {
            document.getElementById("input-container").style.display = "block";
          }
        }
      );
    });
  });
});
