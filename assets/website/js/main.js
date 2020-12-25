// This is the main file for the javascript.
import './polyfills'; // Should stay as first imported file.
import web from 'massive-web';
import $ from 'jquery';

window.$ = window.jQuery = $;
window.web = web;

// Require your components here.
import './components/timeline';
import './components/navigation';
