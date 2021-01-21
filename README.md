[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/custom-components/hacs)
# Lovelace Analog Clock
An analog clock card for Home Assistant Lovelace. Colors are fully customizable, weekday names and date formats are localizable.


![Analog clock2](https://github.com/tomasrudh/analogclock/blob/main/Images/AnalogClock2.png?raw=true)

| Name | Type | Default | Description
| --- | --- | --- | --- |
| locale | String | HA setting | Locale for date and week day |
| timezone | String | Browser setting | Time zone, for example Europe/Stockholm |
| show_timezone | Boolean | false | If true, show time zone instead of week day |
| diameter | Integer | Automatic | Diameter of the clock |
| hide_secondhand | Boolean | false | If true, the second hand is hidden |
| hide_weeknumber | Boolean | true | If true, the week number is hidden NOTE: default has changed to true |
| hide_weekday | Boolean | false | If true, the week day is hidden |
| hide_date | Boolean | false | If true, the date is hidden |
| hide_facedigits | Boolean | false | If true, the hour numbers are hidden |
| hide_digitaltime | Boolean | false | If true, the digital time hidden |
| color_background | String | primary background color | Background color of the clock |
| color_ticks | String | Silver | Color of the border ticks |
| color_facedigits | String | Silver | Color of the borde digits |
| color_digitaltime | String | #CCCCCC | Color of the digital time |
| color_hourhand | String | #CCCCCC | Color of the hour hand |
| color_minutehand | String | #EEEEEE | Color of the minute hand |
| color_secondhand | String | Silver | Color of the second hand |
| color_text | String | Silver | Color of texts |
| style_hourhand | Integer | 1 | Style for the hour hand |
| style_minutehand | Integer | 1 | Style for the minute hand |
| style_secondhand | Integer | 3 | Style for the second hand |

| Name | Type | Description
| --- | --- | --- |
| themes | | Has subvalues with timed settings |
| - time | time interval | A time interval in the format HHMM-HHMM, there can be multiple 'time' sections
| color_background | String | Background color of the clock |

![Analog clock3](https://github.com/tomasrudh/analogclock/blob/main/Images/AnalogClock3.png?raw=true)

```
- type: "custom:analog-clock"
  hide_SecondHand: true
  locale: sv-SE
  diameter: 200
  color_HourHand: "#326ba8"
  color_MinuteHand: "#3273a8"
  color_DigitalTime: "#CCCCCC"
  color_FaceDigits: "#a83832"
  color_Ticks: "Silver"
  themes:
  - time: 23:00-08:00
    color_background: maroon
```
Style 1:
![Style 1](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-1.png?raw=true)
Style 2:
![Style 2](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-2.png?raw=true)
Style 3:
![Style 3](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-3.png?raw=true)
Style 4:
![Style 4](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-4.png?raw=true)
Style 5:
![Style 5](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-5.png?raw=true)
Style 6:
![Style 6](https://github.com/tomasrudh/analogclock/blob/main/Images/Style-6.png?raw=true)
<a href="https://www.buymeacoffee.com/rudhan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
