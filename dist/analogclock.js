class AnalogClock extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      var config = this.config;
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
        getConfig();
        var now = new Date();
        //var options = { timeZone: 'Europe/London', minute: 'numeric' },
        if (config.timezone) { options = { timeZone: timezone } };
        var year = now.toLocaleString('sv-SE', { year: 'numeric', timeZone: timezone });
        var month = now.toLocaleString('sv-SE', { month: 'numeric', timeZone: timezone });
        var day = now.toLocaleString('sv-SE', { day: 'numeric', timeZone: timezone });
        var hour = now.toLocaleString('sv-SE', { hour: 'numeric', timeZone: timezone });
        var minute = now.toLocaleString('sv-SE', { minute: 'numeric', timeZone: timezone });
        var second = now.toLocaleString('sv-SE', { second: 'numeric', timeZone: timezone });
        now = new Date(year, month - 1, day, hour, minute, second);
        if (demo) now = new Date(2021, 1, 10, 10, 8, 20);
        drawFace(ctx, radius, color_Background);
        drawTicks(ctx, radius, color_Ticks);
        if (!hide_FaceDigits) { drawFaceDigits(ctx, radius, color_FaceDigits) };
        if (!hide_Date) { drawDate(ctx, now, locale, radius, color_Text) };
        if (!hide_WeekDay) { drawWeekday(ctx, now, locale, radius, color_Text) };
        if (!hide_WeekNumber) { drawWeeknumber(ctx, now, locale, radius, color_Text) };
        if (!hide_DigitalTime) { drawTime(ctx, now, locale, radius, color_DigitalTime, timezone) };
        var options = { hour: '2-digit', hour12: false };
        hour = now.toLocaleTimeString("sv-SE", options);
        options = { minute: '2-digit', hour12: false };
        minute = now.toLocaleTimeString("sv-SE", options);
        // drawHandX(ctx, ang, length, width, color, style)  ang in degrees
        drawHand(ctx, (Number(hour) + Number(minute) / 60) * 30, radius * 0.5, radius / 20, color_HourHand, style_HourHand);
        drawHand(ctx, (Number(minute) + now.getSeconds() / 60) * 6, radius * 0.8, radius / 20, color_MinuteHand, style_MinuteHand);
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
        if (!hide_MinorTicks) {
          for (num = 1; num < 60; num++) {
            ang = num * Math.PI / 30;
            ctx.moveTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
            ctx.lineTo(Math.cos(ang) * radius * 0.95, Math.sin(ang) * radius * 0.95);
            ctx.stroke();
          }
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

      function drawWeekday(ctx, now, locale, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        if (showtimezone) {
          if (timezonedisplayname) {
            ctx.fillText(timezonedisplayname, 0, radius * 0.3);
          } else {
            ctx.fillText(timezone, 0, radius * 0.3);
          }
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
        var timeString = now.toLocaleTimeString(locale, options);
        if (timeFormat) {
          var nowmoment = moment(now);
          timeString = nowmoment.format(timeFormat);
        }
        if (timeString.length > 5) {
          ctx.font = Math.round(radius / 5) + 'px Sans-Serif';
        } else {
          ctx.font = Math.round(radius / 3) + 'px Sans-Serif';
        }
        ctx.fillStyle = color;
        ctx.fillText(timeString, 0, radius * -0.4);
        ctx.stroke();
      }

      function drawDate(ctx, now, locale, radius, color) {
        ctx.font = Math.round(radius / 7) + 'px Sans-Serif';
        ctx.fillStyle = color
        if (dateFormat) {
          //"20111010T1020"
          var datestring = now.toLocaleString('sv-SE');
          //var datestring = '2021-01-10 10:08';
          var nowmoment = moment(datestring);
          ctx.fillText(nowmoment.format(dateFormat), 0, radius * 0.5);
        } else {
          ctx.fillText(now.toLocaleDateString(locale), 0, radius * 0.5);
        }
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

      function getConfig() {
        globalThis.color_Background = getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
        if (config.color_Background) color_Background = config.color_Background;
        if (config.color_background) color_Background = config.color_background;

        globalThis.color_Ticks = 'Silver';
        if (config.color_Ticks) color_Ticks = config.color_Ticks;
        if (config.color_ticks) color_Ticks = config.color_ticks;

        globalThis.hide_MinorTicks = false;
        if (config.hide_minorticks == true) hide_MinorTicks = config.hide_minorticks;

        globalThis.color_FaceDigits = 'Silver';
        if (config.color_FaceDigits) color_FaceDigits = config.color_FaceDigits;
        if (config.color_facedigits) color_FaceDigits = config.color_facedigits;

        globalThis.locale = hass.language;
        if (config.locale) locale = config.locale;

        globalThis.color_DigitalTime = '#CCCCCC';
        if (config.color_DigitalTime) color_DigitalTime = config.color_DigitalTime;
        if (config.color_digitaltime) color_DigitalTime = config.color_digitaltime;

        globalThis.color_HourHand = '#CCCCCC';
        if (config.color_HourHand) color_HourHand = config.color_HourHand;
        if (config.color_hourhand) color_HourHand = config.color_hourhand;

        globalThis.color_MinuteHand = '#EEEEEE';
        if (config.color_MinuteHand) color_MinuteHand = config.color_MinuteHand;
        if (config.color_minutehand) color_MinuteHand = config.color_minutehand;

        globalThis.color_SecondHand = 'Silver';
        if (config.color_SecondHand) color_SecondHand = config.color_SecondHand;
        if (config.color_secondhand) color_SecondHand = config.color_secondhand;

        globalThis.color_Time = 'Silver';
        if (config.color_Time) color_Time = config.color_Time;
        if (config.color_time) color_Time = config.color_time;

        globalThis.color_Text = 'Silver';
        if (config.color_Text) color_Text = config.color_Text;
        if (config.color_text) color_Text = config.color_text;

        globalThis.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (config.timezone) timezone = config.timezone;

        globalThis.timezonedisplayname = "";
        if (config.timezonedisplayname) timezonedisplayname = config.timezonedisplayname;

        globalThis.showtimezone = false;
        if (config.showtimezone == true) showtimezone = true;
        if (config.show_timezone == true) showtimezone = true;

        globalThis.hide_WeekNumber = true;
        if (config.hide_WeekNumber == false) hide_WeekNumber = false;
        if (config.hide_weeknumber == false) hide_WeekNumber = false;

        globalThis.hide_FaceDigits = false;
        if (config.hide_FaceDigits == true) hide_FaceDigits = true;
        if (config.hide_facedigits == true) hide_FaceDigits = true;

        globalThis.hide_Date = false;
        if (config.hide_Date == true) hide_Date = true;
        if (config.hide_date == true) hide_Date = true;

        globalThis.hide_WeekDay = false;
        if (config.hide_WeekDay == true) hide_WeekDay = true;
        if (config.hide_weekday == true) hide_WeekDay = true;

        globalThis.hide_DigitalTime = false;
        if (config.hide_DigitalTime == true) hide_DigitalTime = true;
        if (config.hide_digitaltime == true) hide_DigitalTime = true;

        globalThis.hide_SecondHand = false;
        if (config.hide_SecondHand == true) hide_SecondHand = true;
        if (config.hide_secondhand == true) hide_SecondHand = true;

        globalThis.style_HourHand = 1;
        if (config.style_hourhand) style_HourHand = config.style_hourhand;

        globalThis.style_MinuteHand = 1;
        if (config.style_minutehand) style_MinuteHand = config.style_minutehand;

        globalThis.style_SecondHand = 3;
        if (config.style_secondhand) style_SecondHand = config.style_secondhand;

        globalThis.dateFormat = "";
        if (config.dateformat) dateFormat = config.dateformat;

        globalThis.timeFormat = "";
        if (config.timeformat) timeFormat = config.timeformat;

        globalThis.demo = false;
        if (config.demo == true) demo = true;

        var themes = config.themes;
        if (themes) {
          try {
            for (var i = 0; i < themes.length; i++) {
              if (themes[i].time) {
                var startTime = new Date();
                var endTime = new Date();
                startTime.setHours((themes[i].time.split('-')[0]).split(':')[0]);
                startTime.setMinutes((themes[i].time.split('-')[0]).split(':')[1]);
                startTime.setSeconds(0);
                endTime.setHours((themes[i].time.split('-')[1]).split(':')[0]);
                endTime.setMinutes((themes[i].time.split('-')[1]).split(':')[1]);
                endTime.setSeconds(0);
              }
              var now = Date.now();
              if ((endTime > startTime && (now > startTime && now < endTime)) || (endTime < startTime && (now > startTime || now < endTime))) {
                if (themes[i].color_background) { color_Background = themes[i].color_background };
                if (themes[i].color_ticks) { color_Ticks = themes[i].color_ticks };
                if (themes[i].hide_minorticks == true) { hide_MinorTicks = true };
                if (themes[i].hide_minorticks == false) { hide_MinorTicks = false };
                if (themes[i].color_facedigits) { color_FaceDigits = themes[i].color_facedigits };
                if (themes[i].locale) { locale = themes[i].locale };
                if (themes[i].color_digitaltime) { color_DigitalTime = themes[i].color_digitaltime };
                if (themes[i].color_hourhand) { color_HourHand = themes[i].color_hourhand };
                if (themes[i].color_minutehand) { color_MinuteHand = themes[i].color_minutehand };
                if (themes[i].color_secondhand) { color_SecondHand = themes[i].color_secondhand };
                if (themes[i].color_time) { color_Time = themes[i].color_time };
                if (themes[i].color_text) { color_Text = themes[i].color_text };
                if (themes[i].timezonedisplayname) { timezonedisplayname = themes[i].timezonedisplayname };
                if (themes[i].show_timezone == true) { showtimezone = true };
                if (themes[i].show_timezone == false) { showtimezone = false };
                if (themes[i].hide_weeknumber == true) { hide_WeekNumber = true };
                if (themes[i].hide_weeknumber == false) { hide_WeekNumber = false };
                if (themes[i].hide_facedigits == true) { hide_FaceDigits = true };
                if (themes[i].hide_facedigits == false) { hide_FaceDigits = false };
                if (themes[i].hide_date == true) { hide_Date = true };
                if (themes[i].hide_date == false) { hide_Date = false };
                if (themes[i].hide_weekday == true) { hide_WeekDay = true };
                if (themes[i].hide_weekday == false) { hide_WeekDay = false };
                if (themes[i].hide_digitaltime == true) { hide_DigitalTime = true };
                if (themes[i].hide_digitaltime == false) { hide_DigitalTime = false };
                if (themes[i].hide_secondhand == true) { hide_SecondHand = true };
                if (themes[i].hide_secondhand == false) { hide_SecondHand = false };
                if (themes[i].style_hourhand) { style_HourHand = themes[i].style_hourhand };
                if (themes[i].style_minutehand) { style_MinuteHand = themes[i].style_minutehand };
                if (themes[i].style_secondhand) { style_SecondHand = themes[i].style_secondhand };
                if (themes[i].dateformat) { dateFormat = themes[i].dateformat };
                if (themes[i].timeformat) { timeFormat = themes[i].timeformat };
              }
            }
          } catch (err) {
          }
        }
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
