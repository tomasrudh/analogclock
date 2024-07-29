[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg)](https://github.com/hacs/integration)
<a href="https://www.buymeacoffee.com/rudhan" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-orange.png" alt="Buy Me A Coffee" height="41" width="174"></a>
# Lovelace Analog Clock
An analog clock card for Home Assistant Lovelace. Colors are fully customizable, weekday names and date formats are localizable.

```diff
- Breaking changes
Some of the masks for 'dateformat' and 'timeformat' have changed text. Please see Formats for the new masks.
```

## Installation

Install using HACS, search for 'Analog Clock'.

To add the card in GUI mode, click +Add Card, scroll down to the bottom and press Manual. Delete the text already in the code panel and add this:
```
type: "custom:analog-clock"
```
You might have to add a character and remove it again, before the Save button becomes active.

## Configuration

For a list of available options for dateformat and timeformat, see Formats.

![Analog clock2](https://github.com/tomasrudh/analogclock/blob/main/Images/AnalogClock2.png?raw=true)

| Name | Type | Default | Description
| --- | --- | --- | --- |
| locale | String | HA setting | Locale for date and week day |
| timezone | String | Browser setting | Time zone, for example Europe/Stockholm [Time zones](https://timezonedb.com/time-zones)|
| show_timezone | Boolean | false | If true, show time zone instead of week day |
| timezonedisplayname | String | | Name of the time zone to be shown |
| diameter | Integer | Automatic | Diameter of the clock |
| hide_secondhand | Boolean | false | If true, the second hand is hidden |
| hide_weeknumber | Boolean | true | If true, the week number is hidden |
| hide_weekday | Boolean | false | If true, the week day is hidden |
| hide_date | Boolean | false | If true, the date is hidden |
| hide_facedigits | Boolean | false | If true, the hour numbers are hidden |
| hide_digitaltime | Boolean | false | If true, the digital time hidden |
| color_background | String | primary background color | Background color of the clock |
| color_ticks | String | Silver | Color of the border ticks |
| hide_minorticks | Boolean | false | Hides the minor ticks |
| hide_majorticks | Boolean | false | Hides the major ticks and the outer circle |
| color_facedigits | String | Silver | Color of the borde digits |
| color_digitaltime | String | #CCCCCC | Color of the digital time |
| color_hourhand | String | #CCCCCC | Color of the hour hand |
| color_minutehand | String | #EEEEEE | Color of the minute hand |
| color_secondhand | String | Silver | Color of the second hand |
| color_text | String | Silver | Color of texts |
| style_hourhand | Integer | 1 | Style for the hour hand |
| style_minutehand | Integer | 1 | Style for the minute hand |
| style_secondhand | Integer | 3 | Style for the second hand |
| dateformat | String | HA setting | Format for the date |
| timeformat | String | HA setting | Format for the time |

Themes are settings that are applied during a time interval. Any setting except timezone and diameter can be set in themes. There can be multiple 'time' sections.

| Name | Type | Description
| --- | --- | --- |
| themes | | Has subvalues with timed settings |
| - time | time interval | A time interval in the format HHMM-HHMM, there can be multiple 'time' sections
| color_background | String | Background color of the clock |

### Colors

All colors can be entered in one of four different ways:
- "green" The color in plain text. [Available colors](https://www.w3.org/TR/css-color-3/#svg-color)
- "#3273a8" The first two digits are the level of Red in hex, 00 - FF. The second two Green, and the last two Blue. "#000000" is black, "#FF00FF" is bright pink and "#FFFFFF" is white.
- rgba(0,0,0,0) The first two number is the level of Red in decimal, 0 - 255. The second Green, the third Blue and the last is alpha. Alpha is in decimal 0 - 1, where 0 is transparent. rgba(0,0,0,1) is black, rgba(255,0,255,1) is bright pink, rgba(0,0,0,1) is white and rgba(0,0,0,0.5) is semi transparent. Note that the value should not be quoted.
- "--secondary-text-color" Refers to Home Assistant CSS variables.

### Examples

![Analog clock3](https://github.com/tomasrudh/analogclock/blob/main/Images/AnalogClock3.png?raw=true)

```
- type: "custom:analog-clock"
  hide_secondHand: true
  locale: sv-SE
  diameter: 200
  color_hourhand: "#326ba8"
  color_minutehand: "#3273a8"
  color_digitaltime: "#CCCCCC"
  color_facedigits: "#a83832"
  color_ticks: "Silver"
  themes:
  - time: 23:00-08:00
    color_background: maroon
```
![Analog clock4](https://github.com/tomasrudh/analogclock/blob/main/Images/AnalogClock4.png?raw=true)
```
- type: "custom:analog-clock"
  hide_secondhand: true
  color_hourhand: "#326ba8"
  color_minutehand: "#3273a8"
  color_digitaltime: "#CCCCCC"
  color_facedigits: "#a83832"
  hide_minorticks: true
  timezone: America/Fortaleza
  timezonedisplayname: "UTC-3"
  dateformat: "MMM Do YYYY"
  timeformat: "hh mm"
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

## Custom watch face

It is possible to supply your own watch face, you can do that by using a [picture-elements card](https://www.home-assistant.io/dashboards/picture-elements/) and also [card_mod](https://github.com/thomasloven/lovelace-card-mod). The trick is to set the background to transparent, this is done in two places 'rgba(0,0,0,0)'.

![image](https://github.com/tomasrudh/analogclock/blob/main/Images/WatchFaceRoman.png?raw=true)

```
type: picture-elements
elements:
  - type: custom:analog-clock
    style:
      left: 50%
      top: 50%
    diameter: 200
    locale: en-US
    hide_majorticks: true
    hide_minorticks: true
    hide_weeknumber: true
    hide_facedigits: true
    dateformat: "YYYY-MM-DD"
    color_background: rgba(0,0,0,0)
    color_hourhand: "#326ba8"
    color_minutehand: "#3293a8"
    color_secondhand: red
    color_digitaltime: "#CCCCCC"
    color_facedigits: "#a83832"
    card_mod:
      style: |
        ha-card {
          background: rgba(0,0,0,0);
        }
image: /local/images/WatchFaceRoman.png
```

## Troubleshooting

Should the card run into a problem will an exclamation mark show in the upper left corner.

![image](https://github.com/tomasrudh/analogclock/blob/main/Images/Error.png?raw=true)

Press F12 in your browser and see the error message in the Console tab.

While the exclamation mark show might the card not show properly.
