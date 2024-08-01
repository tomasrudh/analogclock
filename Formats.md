The code for formatting dates and times are borrowed from https://blog.stevenlevithan.com/archives/javascript-date-format

| Mask | Description |
| --- | --- |
| d | Day of the month as digits; no leading zero for single-digit days. |
| dd  | Day of the month as digits; leading zero for single-digit days. |
| ddd | Day of the week as a three-letter abbreviation. |
| dddd | Day of the week as its full name. |
| m | Month as digits; no leading zero for single-digit months. |
| mm | Month as digits; leading zero for single-digit months. |
| mmm | Month as a three-letter abbreviation. |
| mmmm | Month as its full name. |
| yy | Year as last two digits; leading zero for years less than 10. |
| yyyy | Year represented by four digits. |
| h | Hours; no leading zero for single-digit hours (12-hour clock). |
 |hh | Hours; leading zero for single-digit hours (12-hour clock). |
| H | Hours; no leading zero for single-digit hours (24-hour clock). |
| HH | Hours; leading zero for single-digit hours (24-hour clock). |
| M | Minutes; no leading zero for single-digit minutes. Uppercase M unlike CF timeFormat's m to avoid conflict with months. |
| MM | Minutes; leading zero for single-digit minutes. Uppercase MM unlike CF timeFormat's mm to avoid conflict with months. |
| s | Seconds; no leading zero for single-digit seconds. |
| ss | Seconds; leading zero for single-digit seconds. |
| l or L | Milliseconds. l gives 3 digits. L gives 2 digits. |
| t | Lowercase, single-character time marker string: a or p. |
| tt | Lowercase, two-character time marker string: am or pm. |
| T | Uppercase, single-character time marker string: A or P. Uppercase T unlike CF's t to allow for user-specified casing. |
| TT | Uppercase, two-character time marker string: AM or PM. Uppercase TT unlike CF's tt to allow for user-specified casing. |
| Z | US timezone abbreviation, e.g. EST or MDT. With non-US timezones or in the Opera browser, the GMT/UTC offset is returned, e.g. GMT-0500. |
| o | GMT/UTC timezone offset, e.g. -0500 or +0230. |
| S | The date's ordinal suffix (st, nd, rd, or th). Works well with d. |
| '…' or "…" | Literal character sequence. Surrounding quotes are removed. |
| UTC: | Must be the first four characters of the mask. Converts the date from local time to UTC/GMT/Zulu time before applying the mask. The "UTC:" prefix is removed. |

There are some predefined masks

| Name | Mask | Example |
| --- | --- | --- |
| default | ddd mmm dd yyyy HH:MM:ss | Sat Jun 09 2007 17:46:21 |
| shortDate | m/d/yy | 6/9/07 |
| mediumDate | mmm d, yyyy | Jun 9, 2007 |
| longDate | mmmm d, yyyy | June 9, 2007 |
| fullDate | dddd, mmmm d, yyyy | Saturday, June 9, 2007
| shortTime | h:MM TT | 5:46 PM |
| mediumTime | h:MM:ss TT | 5:46:21 PM |
| longTime | h:MM:ss TT Z | 5:46:21 PM EST |
| isoDate | yyyy-mm-dd | 2007-06-09 |
| isoTime | HH:MM:ss | 17:46:21 |
| isoDateTime | yyyy-mm-dd'T'HH:MM:ss | 2007-06-09T17:46:21 |
| isoUtcDateTime | UTC:yyyy-mm-dd'T'HH:MM:ss'Z' | 2007-06-09T22:46:21Z |
