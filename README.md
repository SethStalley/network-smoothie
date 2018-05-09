# Smoothie

Easy network bonding. Increase your internet speed by blending multiple internet connections together.

Smoothie is a **work in progress and currently only supports Windows.** If the OS specific code allows for it, I will extend Smoothie to support other operating systems. Since this app is in early stages of development no binaries are available for download, however you can get it up an running as is by following the installation guide.

## Usage

Open Smoothie and flip the switch to start blending. That's it!

## Installation

**Note**: At present this project will only work on Windows. The app is built with electron so Mac/Linux support is planned. Send a pr if you want to help add it :wink:

You'll need Node and PowerShell installed on your system.

```sh
git clone https://github.com/SethStalley/network-smoothie.git
cd network-smoothie
npm install
npm start
```

## Who is this for?

Motivation for building this came out of my current internet woes. If you have a couple of bad ADSL connections or ADSL + 3G/4G, this will let you combine the bandwidth of those connections for most streaming services, websites and threaded download managers. :thumbsup:

You will need multiple network adapters on your computer (hint wifi + usb/bluetooth tethering).

## Disclaimer

Smoothie works thanks to the backend work done by Morhaus. This project aims to add an easy to use front-end to Morhaus's [dispatch-proxy](https://github.com/Morhaus/dispatch-proxy) as well as being a place where additions and improvements can be made to the original backend - since said project has not been active in years.
