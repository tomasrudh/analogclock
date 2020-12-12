class AnalogClock extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      var config = this.config;
      // hide_SecondHand      (false)
      // hide_WeekNumber      (false)
      // hide_WeekDay         (false)
      // hide_Date            (false)
      // hide_FaceDigits      (false)
      // hide_DigitalTime     (false)
      // locale               (HA default)  (en-US)
      // diameter             (Automatic)   (px)
      // color_Background     (primary background color)
      // color_Ticks          (Silver)
      // color_FaceDigits     (Silver)
      // color_DigitalTime    (#CCCCCC)
      // color_HourHand       (#CCCCCC)
      // color_MinuteHand     (#EEEEEE)
      // color_SecondHand     (Silver)
      // color_Text           (Silver)
      var color_Background = (config.color_Background) ? config.color_Background : getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
      var color_Ticks = (config.color_Ticks) ? config.color_Ticks : 'Silver';
      var color_FaceDigits = (config.color_FaceDigits) ? config.color_FaceDigits : 'Silver';
      var locale = (!config.locale) ? hass.language : config.locale;
      var color_DigitalTime = (config.color_DigitalTime) ? config.color_DigitalTime : '#CCCCCC';
      var color_HourHand = (config.color_HourHand) ? config.color_HourHand : '#CCCCCC';
      var color_MinuteHand = (config.color_MinuteHand) ? config.color_MinuteHand : '#EEEEEE';
      var color_SecondHand = (config.color_SecondHand) ? config.color_SecondHand : 'Silver';
      var color_Time = (config.color_Time) ? config.color_Time : 'Silver';
      var color_Text = (config.color_Text) ? config.color_Text : 'Silver';
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.display = "flex";
      this.content.style.justifyContent = "center";
      this.content.style.padding = "5px";
      //this.content.innerHTML = `<canvas width="300px" height="300px"></canvas>`;
      var canvasSize = (config.diameter) ? ` width="${config.diameter}px" height="${config.diameter}px"` : ''
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
      setInterval(drawClock, 1000);

      function drawClock() {
        var now = new Date();
        //now = new Date(2020, 12, 10, 10, 8, 20)
        drawFace(ctx, radius, color_Background);
        drawTicks(ctx, radius, color_Ticks);
        if (!config.hide_FaceDigits) { drawFaceDigits(ctx, radius, color_FaceDigits) };
        if (!config.hide_Date) { drawDate(ctx, now, locale, radius, color_Text) };
        if (!config.hide_WeekDay) { drawWeekday(ctx, now, locale, radius, color_Text) };
        if (!config.hide_WeekNumber) { drawWeeknumber(ctx, now, locale, radius, color_Text) };
        if (!config.hide_DigitalTime) { drawTime(ctx, now, locale, radius, color_DigitalTime) };
        drawHand(ctx, (now.getHours() + now.getMinutes() / 60) * 30, radius * 0.5, radius / 20, color_HourHand);
        drawHand(ctx, (now.getMinutes() + now.getSeconds() / 60) * 6, radius * 0.8, radius / 20, color_MinuteHand);
        if (!config.hide_SecondHand) { drawHand(ctx, (now.getSeconds()) * 6, radius * 0.8, 0, color_SecondHand) };

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

      function drawHand(ctx, ang, length, width, color) {
        // ang i grader (360)
        var angrad = (ang - 90) * Math.PI / 180;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.moveTo(Math.cos(angrad) * length * 1.1, Math.sin(angrad) * length * 1.1);
        ctx.lineTo(Math.cos(angrad - Math.PI / 2) * width, Math.sin(angrad - Math.PI / 2) * width);
        ctx.lineTo(Math.cos(angrad - Math.PI) * width, Math.sin(angrad - Math.PI) * width * 1.5);
        ctx.lineTo(Math.cos(angrad + Math.PI / 2) * width, Math.sin(angrad + Math.PI / 2) * width);
        ctx.lineTo(Math.cos(angrad) * length, Math.sin(angrad) * length);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, length / 40, 0, 2 * Math.PI);
        ctx.fillStyle = '#777777'
        ctx.fill();
        ctx.stroke();
      }

      function drawDate(ctx, now, location, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        ctx.fillText(now.toLocaleDateString(location), 0, radius * 0.5);
        ctx.stroke();
      }

      function drawWeekday(ctx, now, location, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        var options = { weekday: 'long' };
        ctx.fillText(now.toLocaleDateString(location, options), 0, radius * 0.3);
        ctx.stroke();
      }

      function drawWeeknumber(ctx, now, location, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        var week = 'v. ' + weekNumber();
        ctx.fillText(week, radius * -0.5, 0);
        ctx.stroke();
      }

      function drawTime(ctx, now, location, radius, color) {
        var timeString = now.toLocaleTimeString(location, { hour: '2-digit', minute: '2-digit' });
        if (timeString.length > 5) {
          ctx.font = Math.round(radius / 5) + 'px Sans-Serif';
        } else {
          ctx.font = Math.round(radius / 3) + 'px Sans-Serif';
        }
        ctx.fillStyle = color;
        ctx.fillText(timeString , 0, radius * -0.4);
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
