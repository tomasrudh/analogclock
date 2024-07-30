class AnalogClock extends HTMLElement {
  set hass(hass) {

    const formatStackTrace = (stack) => {
      return stack.split("\n").map(line => line.trim());
    };

    if (!this.content) {
      console.info(`%c ANALOG-CLOCK v3.2 `, 'color: white; font-weight: bold; background: black');
      var config = this.config;
      const card = document.createElement('ha-card');
      this.content = document.createElement('div');
      this.content.style.display = "flex";
      this.content.style.justifyContent = "center";
      this.content.style.padding = "5px";
      //this.content.style.background = 'rgba(0, 0, 0, 0)';
      var canvasSize = (config.diameter) ? ` width="${config.diameter}px" height="${config.diameter}px"` : '';
      this.content.innerHTML = `<canvas${canvasSize}></canvas>`;
      card.appendChild(this.content);
      this.appendChild(card);
      var canvas = this.content.children[0];
      canvas.background_transparent
      var ctx = canvas.getContext("2d");
      //ctx.textAlign = "center";
      //ctx.textBaseline = 'middle';
      var radius = (canvas.width < canvas.height) ? canvas.width / 2.1 : canvas.height / 2.1;
      //ctx.translate(canvas.width / 2, canvas.height / 2);
      var canvasHourEl = document.createElement('canvas');
      canvasHourEl.width = canvas.width
      canvasHourEl.height = canvas.height
      var layerHourCtx = canvasHourEl.getContext('2d');
      layerHourCtx.width = canvas.width;
      layerHourCtx.height = canvas.height;
      layerHourCtx.textAlign = "center";
      layerHourCtx.textBaseline = 'middle';
      layerHourCtx.translate(canvas.width / 2, canvas.height / 2);

      var canvasMinSecEl = document.createElement('canvas');
      var layerMinSecCtx = canvasMinSecEl.getContext('2d');
      canvasMinSecEl.width = canvas.width
      canvasMinSecEl.height = canvas.height
      layerMinSecCtx.width = canvas.width;
      layerMinSecCtx.height = canvas.height;
      layerMinSecCtx.textAlign = "center";
      layerMinSecCtx.textBaseline = 'middle';
      layerMinSecCtx.translate(canvas.width / 2, canvas.height / 2);

      var color_Background = getComputedStyle(document.documentElement).getPropertyValue('--primary-background-color');
      var color_Ticks = 'Silver';
      var hide_MinorTicks = false;
      var hide_MajorTicks = false;
      var color_FaceDigits = 'Silver';
      var locale = hass.language;
      var color_DigitalTime = 'red';
      var color_HourHand = '#CCCCCC';
      var color_MinuteHand = '#EEEEEE';
      var color_SecondHand = 'Silver';
      var color_Time = 'Silver';
      var color_Text = 'Silver';
      var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      var timezonedisplayname = "";
      var showtimezone = false;
      var hide_WeekNumber = true;
      var hide_FaceDigits = false;
      var hide_Date = false;
      var hide_WeekDay = false;
      var hide_DigitalTime = false;
      var hide_SecondHand = false;
      var style_HourHand = 1;
      var style_MinuteHand = 1;
      var style_SecondHand = 3;
      var dateMask = "";
      var timeFormat = "";
      var demo = false;

      var layerCachedForMinute = -1;
      getConfig();

      /*
       * Date Format 1.2.3
       * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
       * MIT license
       *
       * Includes enhancements by Scott Trenda <scott.trenda.net>
       * and Kris Kowal <cixar.com/~kris.kowal/>
       *
       * Accepts a date, a mask, or a date and a mask.
       * Returns a formatted version of the given date.
       * The date defaults to the current date/time.
       * The mask defaults to dateFormat.masks.default.
       */
      var dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
          timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
          timezoneClip = /[^-+\dA-Z]/g,
          pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
          };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
          var dF = dateFormat;

          // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
          if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
          }

          // Passing date through Date applies Date.parse, if necessary
          date = date ? new Date(date) : new Date;
          if (isNaN(date)) throw SyntaxError("invalid date");

          mask = String(dF.masks[mask] || mask || dF.masks["default"]);

          // Allow setting the utc argument via the mask
          if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
          }

          var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
              d: d,
              dd: pad(d),
              ddd: intlDay('short'),
              dddd: intlDay('long'),
              m: m + 1,
              mm: pad(m + 1),
              mmm: intlMonth('short'),
              mmmm: intlMonth('long'),
              yy: String(y).slice(2),
              yyyy: y,
              h: H % 12 || 12,
              hh: pad(H % 12 || 12),
              H: H,
              HH: pad(H),
              M: M,
              MM: pad(M),
              s: s,
              ss: pad(s),
              l: pad(L, 3),
              L: pad(L > 99 ? Math.round(L / 10) : L),
              t: H < 12 ? "a" : "p",
              tt: H < 12 ? "am" : "pm",
              T: H < 12 ? "A" : "P",
              TT: H < 12 ? "AM" : "PM",
              Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
              o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
              S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

          return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
          });
        };
      }();

      // Some common format strings
      dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
      };

      // For convenience...
      Date.prototype.format = function (mask, utc) {
        return dateFormat(this, mask, utc);
      };

      function intlMonth(length) {
        var now = new Date();
        var options = { month: length };
        return now.toLocaleDateString(locale, options);
      }

      function intlDay(length) {
        var now = new Date();
        var options = { weekday: length };
        return now.toLocaleDateString(locale, options);
      }

      drawClock();
      if (this.hide_SecondHand) {
        setInterval(drawClock, 10000);
      } else {
        setInterval(drawClock, 1000);
      }

      function drawClock() {
        try {
          var now = new Date();
          if (config.timezone) { options = { timeZone: timezone } };
          var year = now.toLocaleString('sv-SE', { year: 'numeric', timeZone: timezone });
          var month = now.toLocaleString('sv-SE', { month: 'numeric', timeZone: timezone });
          var day = now.toLocaleString('sv-SE', { day: 'numeric', timeZone: timezone });
          var hour = now.toLocaleString('sv-SE', { hour: 'numeric', timeZone: timezone });
          var minute = now.toLocaleString('sv-SE', { minute: 'numeric', timeZone: timezone });
          var second = now.toLocaleString('sv-SE', { second: 'numeric', timeZone: timezone });
          now = new Date(year, month - 1, day, hour, minute, second);
          if (demo) now = new Date(2021, 1, 10, 10, 8, 20);
          var options = { minute: '2-digit', hour12: false };
          minute = now.toLocaleTimeString("sv-SE", options);

          if (layerCachedForMinute != minute) {
            layerCachedForMinute = minute;
            layerHourCtx.clearRect(0 - layerHourCtx.width / 2, 0 - layerHourCtx.height / 2, layerHourCtx.width, layerHourCtx.height);
            drawFace(layerHourCtx, radius, color_Background);
            drawTicks(layerHourCtx, radius, color_Ticks);
            if (!hide_FaceDigits) { drawFaceDigits(layerHourCtx, radius, color_FaceDigits) };
            if (!hide_Date) { drawDate(layerHourCtx, now, locale, radius, color_Text) };
            if (!hide_WeekDay) { drawWeekday(layerHourCtx, now, locale, radius, color_Text) };
            if (!hide_WeekNumber) { drawWeeknumber(layerHourCtx, now, locale, radius, color_Text) };
            if (!hide_DigitalTime) { drawTime(layerHourCtx, now, locale, radius, color_DigitalTime, timezone) };
            options = { hour: '2-digit', hour12: false };
            hour = now.toLocaleTimeString("sv-SE", options);
            options = { minute: '2-digit', hour12: false };
            minute = now.toLocaleTimeString("sv-SE", options);
            drawHand(layerHourCtx, (Number(hour) + Number(minute) / 60) * 30, radius * 0.5, radius / 20, color_HourHand, style_HourHand);
          }

          ctx.clearRect(0, 0, canvas.width * 2, canvas.height * 2);
          layerMinSecCtx.clearRect(0 - layerMinSecCtx.width / 2, 0 - layerMinSecCtx.height / 2, layerMinSecCtx.width, layerMinSecCtx.height);
          drawHand(layerMinSecCtx, (Number(minute) + now.getSeconds() / 60) * 6, radius * 0.8, radius / 20, color_MinuteHand, style_MinuteHand);
          if (!hide_SecondHand) { drawHand(layerMinSecCtx, (now.getSeconds()) * 6, radius * 0.8, 0, color_SecondHand, style_SecondHand) };
          ctx.drawImage(canvasHourEl, 0, 0, layerHourCtx.width, layerHourCtx.height);
          ctx.drawImage(canvasMinSecEl, 0, 0, layerMinSecCtx.width, layerMinSecCtx.height);
        }
        catch (err) {
          showerror(err, ctx, radius)
        }
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
        // Major ticke
        if (!hide_MajorTicks) {
          for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            ctx.moveTo(Math.cos(ang) * radius, Math.sin(ang) * radius);
            ctx.lineTo(Math.cos(ang) * radius * 0.9, Math.sin(ang) * radius * 0.9);
            ctx.stroke();
          }
        }
        ctx.lineWidth = 1;
        // Minor ticks
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

      function drawHand(ctx, ang, length, width, color, style, canvasHand) {
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
          try {
            timeString = dateFormat(now, timeFormat)
          }
          catch (err) {
            showerror(err, ctx, radius)
          }
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
        if (dateMask) {
          //"20111010T1020"
          var datestring = now.toLocaleString('sv-SE');
          //var datestring = '2021-01-10 10:08';
          try {
            ctx.fillText(dateFormat(now, dateMask), 0, radius * 0.5)
          }
          catch (err) {
            showerror(err, ctx, radius)
          }
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
        if (config.color_Background) color_Background = config.color_Background;
        if (config.color_background) color_Background = config.color_background;
        if (color_Background.startsWith('--')) {
          color_Background = getComputedStyle(document.documentElement).getPropertyValue(color_Background);
        }

        if (config.color_Ticks) color_Ticks = config.color_Ticks;
        if (config.color_ticks) color_Ticks = config.color_ticks;
        if (color_Ticks.startsWith('--')) {
          color_Ticks = getComputedStyle(document.documentElement).getPropertyValue(color_Ticks);
        }

        if (config.hide_minorticks == true) hide_MinorTicks = config.hide_minorticks;

        if (config.hide_majorticks == true) hide_MajorTicks = config.hide_majorticks;

        if (config.color_FaceDigits) color_FaceDigits = config.color_FaceDigits;
        if (config.color_facedigits) color_FaceDigits = config.color_facedigits;
        if (color_FaceDigits.startsWith('--')) {
          color_FaceDigits = getComputedStyle(document.documentElement).getPropertyValue(color_FaceDigits);
        }

        if (config.locale) locale = config.locale;

        if (config.color_DigitalTime) color_DigitalTime = config.color_DigitalTime;
        if (config.color_digitaltime) color_DigitalTime = config.color_digitaltime;
        if (color_DigitalTime.startsWith('--')) {
          color_DigitalTime = getComputedStyle(document.documentElement).getPropertyValue(color_DigitalTime);
        }

        if (config.color_HourHand) color_HourHand = config.color_HourHand;
        if (config.color_hourhand) color_HourHand = config.color_hourhand;
        if (color_HourHand.startsWith('--')) {
          color_HourHand = getComputedStyle(document.documentElement).getPropertyValue(color_HourHand);
        }

        if (config.color_MinuteHand) color_MinuteHand = config.color_MinuteHand;
        if (config.color_minutehand) color_MinuteHand = config.color_minutehand;
        if (color_MinuteHand.startsWith('--')) {
          color_MinuteHand = getComputedStyle(document.documentElement).getPropertyValue(color_MinuteHand);
        }

        if (config.color_SecondHand) color_SecondHand = config.color_SecondHand;
        if (config.color_secondhand) color_SecondHand = config.color_secondhand;
        if (color_SecondHand.startsWith('--')) {
          color_SecondHand = getComputedStyle(document.documentElement).getPropertyValue(color_SecondHand);
        }

        if (config.color_Time) color_Time = config.color_Time;
        if (config.color_time) color_Time = config.color_time;
        if (color_Time.startsWith('--')) {
          color_Time = getComputedStyle(document.documentElement).getPropertyValue(color_Time);
        }

        if (config.color_Text) color_Text = config.color_Text;
        if (config.color_text) color_Text = config.color_text;
        if (color_Text.startsWith('--')) {
          color_Text = getComputedStyle(document.documentElement).getPropertyValue(color_Text);
        }

        if (config.timezone) timezone = config.timezone;

        if (config.timezonedisplayname) timezonedisplayname = config.timezonedisplayname;

        if (config.showtimezone == true) showtimezone = true;
        if (config.show_timezone == true) showtimezone = true;

        if (config.hide_WeekNumber == false) hide_WeekNumber = false;
        if (config.hide_weeknumber == false) hide_WeekNumber = false;

        if (config.hide_FaceDigits == true) hide_FaceDigits = true;
        if (config.hide_facedigits == true) hide_FaceDigits = true;

        if (config.hide_Date == true) hide_Date = true;
        if (config.hide_date == true) hide_Date = true;

        if (config.hide_WeekDay == true) hide_WeekDay = true;
        if (config.hide_weekday == true) hide_WeekDay = true;

        if (config.hide_DigitalTime == true) hide_DigitalTime = true;
        if (config.hide_digitaltime == true) hide_DigitalTime = true;

        if (config.hide_SecondHand == true) hide_SecondHand = true;
        if (config.hide_secondhand == true) hide_SecondHand = true;

        if (config.style_hourhand) style_HourHand = config.style_hourhand;

        if (config.style_minutehand) style_MinuteHand = config.style_minutehand;

        if (config.style_secondhand) style_SecondHand = config.style_secondhand;

        if (config.dateformat) dateMask = config.dateformat;

        if (config.timeformat) timeFormat = config.timeformat;

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
                if (themes[i].hide_majorticks == true) { hide_MajorTicks = true };
                if (themes[i].hide_majorticks == false) { hide_MajorTicks = false };
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
                if (themes[i].dateformat) { dateMask = themes[i].dateFormat };
                if (themes[i].timeformat) { timeFormat = themes[i].timeformat };
              }
            }
          } catch (err) {
            showerror(err, ctx, radius)
          }
        }
      }
    }

    function showerror(err, ctx, radius) {
      console.error("ANALOG-CLOCK Error: " + err.message)
      const stackTraceArr = formatStackTrace(err.stack)
      console.info(stackTraceArr[1])
      var img = new Image();
      img.src = 'https://cdn.jsdelivr.net/gh/tomasrudh/analogclock/Images/errorsign.png';
      img.onload = function (e) {
        ctx.drawImage(img, -radius, -radius, radius / 4, radius / 4);
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
