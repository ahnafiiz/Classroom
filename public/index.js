"use strict";

/**
 * @type {HTMLFormElement}
 */
const form = document.getElementById("sj-form");
/**
 * @type {HTMLInputElement}
 */
const address = document.getElementById("sj-address");
/**
 * @type {HTMLInputElement}
 */
const searchEngine = document.getElementById("sj-search-engine");
/**
 * @type {HTMLParagraphElement}
 */
const error = document.getElementById("sj-error");
/**
 * @type {HTMLPreElement}
 */
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

form.addEventListener("submit", async (event) => {
	event.preventDefault();

	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	const url = search(address.value, searchEngine.value);

	let wispUrl =
		(location.protocol === "https:" ? "wss" : "ws") +
		"://" +
		location.host +
		"/wisp/";
	if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
		await connection.setTransport("/libcurl/index.mjs", [
			{ websocket: wispUrl },
		]);
	}
	const frame = scramjet.createFrame();
	frame.frame.id = "sj-frame";
	document.body.appendChild(frame.frame);
	frame.go(url);
});

/* ==========================================================================
   DYNAMIC SUBTITLE ROTATION LOGIC
   ========================================================================== */

// Easily add, remove, or modify your custom subtitles inside this array.
const subTitlesList = [
	"i will change the url if yall leak (looking at u connor chawke)",
	"u can bypass the captcha.",
	"u can bypass the captcha..",
	"u can bypass the captcha...",
	"u can bypass the captcha....",
	"u can bypass the captcha.....",
	"dont tell the teachers",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"DONT LEAK THE LINK",
	"chromebook corner sucks",
	"chromebook corner sucks",
	"chromebook corner sucks",
];

/**
 * Chooses a random subtitle from the list and injects it into the DOM.
 */
function initializeDynamicSubtitle() {
	const targetElement = document.getElementById('dynamic-subtitle');
	if (targetElement) {
		const randomIndex = Math.floor(Math.random() * subTitlesList.length);
		targetElement.textContent = subTitlesList[randomIndex];
	}
}

// Executes immediately if DOM is ready, otherwise waits for parser lifecycle completion.
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initializeDynamicSubtitle);
} else {
	initializeDynamicSubtitle();
}
