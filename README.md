# Misao-chan

An IRC bot for a certain channel on freenode. Written in JS for Node.js. Feel
free to use her for your own channel too!

She is a relatively advanced IRC bot, capable of hotloading modules (even through
code upgrades), and thus very expandable.

Built on top of [Jerk](https://github.com/gf3/Jerk).

## Project Goal

To create an IRC bot that makes life easier for everyone. For instance, a bot
to make important life decisions for us by randomly picking at things, or
telling us when the pizza is baked so we can eat to live another day.

## Core Requirements

    nodejs
    jerk
    
## Module Requirements

### Tell
    mongodb
    mongoose
    
## Installation

Copy/move config.example.js to config.js, edit its contents to suit your needs,
and then simply run

    node app.js

## Modules

### -Usage-

Misao-chan implements a hotloading modules system. If you're the administrator
(set via the config file, which is yet to be hotloadable), simply "load modulename"
or "unload modulename" to load and unload modules, respectably.

### Pizza

    Implemented: Yes
    Usage: pizza 10m "message goes here"

Pizza is basically a timer. 10m is an example time, meaning 10 minutes. After 10
minutes, bot will reply back with message you assigned it with. Anything between
the ""s will be parsed as the return message.

This feature does not yet rely on the mongodb to store pizza values in-case the bot
instance is closed.

### 8-ball

    Implemented: Yes
    Usage: 8-ball question

A very simple decision making module.

### Choose

    Implemented: Yes
    Usage: choose x or y [or z [or w [...]]]

Similar to 8-ball, except it picks out an answer you want from a given list.
Separate all your options with " or ".

### Fortune

    Implemented: Yes
    Usage: fortune

Tells you your daily fortune, Japanese style. Very random.

### Tell

	Implemented: Yes
	Usage: tell nickname message

With Tell, you can send another user a message through the bot, whether the
person is online or not. The person will receive the message the moment the bot
realises the person is online. Nickname is case sensitive.
