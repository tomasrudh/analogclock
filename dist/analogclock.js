class AnalogClock extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      var config = this.config;

      var color_Background = getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
      if (config.color_Background) color_Background = config.color_Background;
      if (config.color_background) color_Background = config.color_background;

      var color_Ticks = 'Silver';
      if (config.color_Ticks) color_Ticks = config.color_Ticks;
      if (config.color_ticks) color_Ticks = config.color_ticks;

      var color_FaceDigits = 'Silver';
      if (config.color_FaceDigits) color_FaceDigits = config.color_FaceDigits;
      if (config.color_facedigits) color_FaceDigits = config.color_facedigits;

      var locale = hass.language;
      if (config.locale) locale = config.locale;

      var color_DigitalTime = '#CCCCCC';
      if (config.color_DigitalTime) color_DigitalTime = config.color_DigitalTime;
      if (config.color_digitaltime) color_DigitalTime = config.color_digitaltime;

      var color_HourHand = '#CCCCCC';
      if (config.color_HourHand) color_HourHand = config.color_HourHand;
      if (config.color_hourhand) color_HourHand = config.color_hourhand;

      var color_MinuteHand = '#EEEEEE';
      if (config.color_MinuteHand) color_MinuteHand = config.color_MinuteHand;
      if (config.color_minutehand) color_MinuteHand = config.color_minutehand;

      var color_SecondHand = 'Silver';
      if (config.color_SecondHand) color_SecondHand = config.color_SecondHand;
      if (config.color_secondhand) color_SecondHand = config.color_secondhand;

      var color_Time = 'Silver';
      if (config.color_Time) color_Time = config.color_Time;
      if (config.color_time) color_Time = config.color_time;

      var color_Text = 'Silver';
      if (config.color_Text) color_Text = config.color_Text;
      if (config.color_text) color_Text = config.color_text;

      var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (config.timezone) timezone = config.timezone;

      var showtimezone = false;
      if (config.showtimezone == true) showtimezone = true;
      if (config.show_timezone == true) showtimezone = true;

      var hide_WeekNumber = true;
      if (config.hide_WeekNumber == false) hide_WeekNumber = false;
      if (config.hide_weeknumber == false) hide_WeekNumber = false;

      var hide_FaceDigits = false;
      if (config.hide_FaceDigits == true) hide_FaceDigits = true;
      if (config.hide_facedigits == true) hide_FaceDigits = true;

      var hide_Date = false;
      if (config.hide_Date == true) hide_Date = true;
      if (config.hide_date == true) hide_Date = true;

      var hide_WeekDay = false;
      if (config.hide_WeekDay == true) hide_WeekDay = true;
      if (config.hide_weekday == true) hide_WeekDay = true;

      var hide_DigitalTime = false;
      if (config.hide_DigitalTime == true) hide_DigitalTime = true;
      if (config.hide_digitaltime == true) hide_DigitalTime = true;

      var hide_SecondHand = false;
      if (config.hide_SecondHand == true) hide_SecondHand = true;
      if (config.hide_secondhand == true) hide_SecondHand = true;

      var style_HourHand = 1;
      if (config.style_hourhand) style_HourHand = config.style_hourhand;

      var style_MinuteHand = 1;
      if (config.style_minutehand) style_MinuteHand = config.style_minutehand;

      var style_SecondHand = 3;
      if (config.style_secondhand) style_SecondHand = config.style_secondhand;

      var demo = false;
      if (config.demo == true) demo = true;

      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.display = "flex";
      this.content.style.justifyContent = "center";
      this.content.style.padding = "5px";
      //this.content.innerHTML = `<canvas width="300px" height="300px"></canvas>`;
      var canvasSize = (config.diameter) ? ` width="${config.diameter}px" height="${config.diameter}px"` : '';
      this.content.innerHTML = `<canvas${canvasSize}></canvas>`;
      //this.content.innerHTML = `<canvas></canvas>`;
      card.appendChild(this.content);
      this.appendChild(card);
      var canvas = this.content.children[0];
      var ctx = canvas.getContext("2d");
      ctx.textAlign = "center";
      ctx.textBaseline = 'middle';
      var radius = (canvas.width < canvas.height) ? canvas.width / 2.1 : canvas.height / 2.1;
      ctx.translate(canvas.width / 2, canvas.height / 2);

      drawClock();
      if (this.hide_SecondHand) {
        setInterval(drawClock, 10000);
      } else {
        setInterval(drawClock, 1000);
      }

      function drawClock() {
        var now = new Date();
        if (demo) now = new Date(2020, 12, 10, 10, 8, 20);
        drawFace(ctx, radius, color_Background);
        drawTicks(ctx, radius, color_Ticks);
        if (!hide_FaceDigits) { drawFaceDigits(ctx, radius, color_FaceDigits) };
        if (!hide_Date) { drawDate(ctx, now, locale, radius, color_Text) };
        if (!hide_WeekDay) { drawWeekday(ctx, now, locale, radius, color_Text) };
        if (!hide_WeekNumber) { drawWeeknumber(ctx, now, locale, radius, color_Text) };
        if (!hide_DigitalTime) { drawTime(ctx, now, locale, radius, color_DigitalTime, timezone) };
        var options = { hour: '2-digit', hour12: false };
        if (config.timezone) { options["timeZone"] = timezone; }
        var hour = now.toLocaleTimeString("sv-SE", options);
        options = { minute: '2-digit', hour12: false };
        if (config.timezone) { options["timeZone"] = timezone; }
        var min = now.toLocaleTimeString("sv-SE", options);
        // drawHandX(ctx, ang, length, width, color, style)  ang in degrees
        drawHand(ctx, (Number(hour) + Number(min) / 60) * 30, radius * 0.5, radius / 20, color_HourHand, style_HourHand);
        drawHand(ctx, (Number(min) + now.getSeconds() / 60) * 6, radius * 0.8, radius / 20, color_MinuteHand, style_MinuteHand);
        if (!hide_SecondHand) { drawHand(ctx, (now.getSeconds()) * 6, radius * 0.8, 0, color_SecondHand, style_SecondHand) };
      }

      function drawFace(ctx, radius, color) {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.lineWidth = radius * 0.03;
        ctx.stroke();
      }

      function drawTicks(ctx, radius, color) {
        var ang;
        var num;
        ctx.lineWidth = 2;
        ctx.strokeStyle = color;
        for (num = 1; num < 13; num++) {
          ang = num * Math.PI / 6;
          ctx.moveTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
          ctx.lineTo(Math.cos(ang) * radius * 0.9, Math.sin(ang) * radius * 0.9);
          ctx.stroke();
        }
        ctx.lineWidth = 1;
        for (num = 1; num < 60; num++) {
          ang = num * Math.PI / 30;
          ctx.moveTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
          ctx.lineTo(Math.cos(ang) * radius * 0.95, Math.sin(ang) * radius * 0.95);
          ctx.stroke();
        }
      }

      function drawFaceDigits(ctx, radius, color) {
        var ang;
        var num;
        ctx.lineWidth = 2;
        ctx.fillStyle = color;
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        for (num = 1; num < 13; num++) {
          ang = (num * Math.PI / 6) - ((2 * Math.PI) / 12 * 3);
          ctx.fillText(num, Math.cos(ang) * radius * 0.8, Math.sin(ang) * radius * 0.8);
          ctx.stroke();
        }
      }

      function drawHand(ctx, ang, length, width, color, style) {
        // Omvandla ang till radianer
        var angrad = (ang - 90) * Math.PI / 180;
        width = width > 0 ? width : 1;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        switch (style) {
          default:
            var Coords = getCoords(length, 0, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(0, -width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(-width * 1.5, 0, angrad);
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(0, width, angrad);
            ctx.lineTo(Coords.x, Coords.y);
            ctx.closePath();
            ctx.fill();
            break;
          case 2:
            var Coords = getCoords(1, 0, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(length * 0.8, width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(length, 0, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(length * 0.8, -width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            ctx.closePath();
            ctx.fill();
            break;
          case 3:
            ctx.lineWidth = 3;
            var Coords = getCoords(1, 0, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(length, 0, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            ctx.closePath();
            ctx.fill();
            break;
          case 4:
            var Coords = getCoords(1, 0, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(length, 0, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(length, 0, angrad)
            ctx.closePath();
            ctx.moveTo(Coords.x, Coords.y);
            ctx.arc(Coords.x, Coords.y, length / 10, 0, 2 * Math.PI);
            ctx.fill();
            break;
          case 5:
            ctx.lineWidth = 2;
            var Coords = getCoords(-width * 1.5, 0, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(0, width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(width * 2, width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(width * 2, -width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(0, -width, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            ctx.closePath();
            ctx.fill();
            ctx.beginPath();
            Coords = getCoords(width * 2, width * 0.8, angrad)
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(length, 0, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(width * 2, -width * 0.8, angrad)
            ctx.lineTo(Coords.x, Coords.y);
            break;
          case 6:
            var Coords = getCoords(length, 0, angrad);
            ctx.moveTo(Coords.x, Coords.y);
            Coords = getCoords(length * 0.8, width, angrad);
            ctx.lineTo(Coords.x, Coords.y);
            Coords = getCoords(length * 0.8, -width, angrad);
            ctx.lineTo(Coords.x, Coords.y);
            ctx.closePath();
            ctx.fill();
            break;
        }
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, length / 40, 0, 2 * Math.PI);
        ctx.fillStyle = '#777777'
        ctx.fill();
        ctx.stroke();
      }

      function getCoords(xin, yin, angin) {
        // Convert xin and yin to polar and add angin
        var radius = Math.sqrt(xin * xin + yin * yin);
        var ang = Math.atan2(yin, xin) + angin;
        // Back to rectangular
        var xout = radius * Math.cos(ang);
        var yout = radius * Math.sin(ang);
        return {
          x: xout,
          y: yout,
        };
      }

      function drawDate(ctx, now, locale, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        ctx.fillText(now.toLocaleDateString(locale), 0, radius * 0.5);
        ctx.stroke();
      }

      function drawWeekday(ctx, now, locale, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        if (showtimezone) {
          ctx.fillText(timezone, 0, radius * 0.3);
        } else {
          var options = { weekday: 'long' };
          ctx.fillText(now.toLocaleDateString(locale, options), 0, radius * 0.3);
        }
        ctx.stroke();
      }

      function drawWeeknumber(ctx, now, locale, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        var week = weekNumber();
        ctx.fillText(week, radius * -0.5, 0);
        ctx.stroke();
      }

      function drawTime(ctx, now, locale, radius, color, timezone) {
        var options = { hour: '2-digit', minute: '2-digit' };
        if (config.timezone) { options["timeZone"] = timezone };
        var timeString = now.toLocaleTimeString(locale, options);
        if (timeString.length > 5) {
          ctx.font = Math.round(radius / 5) + 'px Sans-Serif';
        } else {
          ctx.font = Math.round(radius / 3) + 'px Sans-Serif';
        }
        ctx.fillStyle = color;
        ctx.fillText(timeString, 0, radius * -0.4);
        ctx.stroke();
      }

      function weekNumber() {
        var date = new Date();
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        var week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
          - 3 + (week1.getDay() + 6) % 7) / 7);
      }
    }
  }

  setConfig(config) {
    this.config = config;
  }

  getCardSize() {
    return 3;
  }
}

customElements.define('analog-clock', AnalogClock);
