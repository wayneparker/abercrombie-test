/**
 * Task Tracker v2.0
 * Test Exercise for ABCB
 *
 * Created by Wayne Parker on 5/22/16
 */

(function () {

	'use strict';

	//
	//## Initialize globals

	var taskData = {}; // Local task data; will be populated with “server” data by loadData()
	var taskForm = document.querySelector('form.task-tracker__create'); // Reference to task entry form
	var taskList = document.querySelector('ul.task-list');              // Reference to task list


	//
	//## Main App initialization

	function taskTracker() {
		taskData = loadData('data.json'); // Get JSON data from (fake) XMLHttpRequest
		buildList(taskData);              // Convert JSON data to DOM objects, render to HTML
		window.onsubmit = addTask;        // Set event handler to process form when submitted
					console.log('Set-up complete, Task Tracker is now running!');
	}


	//
	//## Get JSON data from (fake) XMLHttpRequest, store in local taskData object

	function loadData(url) {

		var serverData = {};
		var request = new XMLHttpRequestFAKE();
		request.open('GET', url, true);

		request.onload = function() {
			if (this.status >= 200 && this.status < 400) {
				// Success!
				serverData = JSON.parse(this.response);
							console.log ('status: ' + this.statusText); // TESTING
							console.log ('response: ' + this.response); // TESTING
							console.log ('parsed response as Object:'); // TESTING
							console.log (serverData); // TESTING
			} else {
				window.alert('The server responded with an error. JSON data not loaded.');
			}
		};

		request.onerror = function() {
			window.alert('The server did not respond. JSON data not loaded.');
		};

		request.send();

		return serverData;
	}


	//
	//## Convert JSON data to list items, insert into DOM

	function buildList(tasks) {
		var ul = taskList;
		var li;
		// OK, docFrag is totally overkill for such a simple exercise, but hey, I’m a professional
		var frag = document.createDocumentFragment();
		// Create DOM elements for each task, append to documentFragment to avoid multiple DOM repaints
		for (var i = 0; i < tasks.length; i++) {
			li = createListItem(tasks[i].name, tasks[i].date, tasks[i].assigned);
			frag.appendChild(li);
		}
		// Update the DOM all at once, because performance!
		ul.appendChild(frag);
					console.log('Finished appending initial tasks to list');
	}


	//
	//## Create single task DOM element

	function createListItem(name, dateStr, assigned) {
		var item = document.createElement('li');
		item.innerHTML =
			'<span class="task-name">' + name + '</span>' +
			'<span class="task-date">' + dateStr + '</span>' +
			'<span class="task-assigned">' + assigned + '</span>' +
			'</li>\n';
					console.log('Task DOM element created: ');
					console.log(item);
		return item;
	}


	//
	//## Form Submit, create and add new task to data and DOM

	function addTask(event) {

		event.preventDefault();

		// Get form data and create new task object
		var name = document.getElementById('task-tracker__name').value;
		var dateStr = dateFormat(document.getElementById('task-tracker__date').value);
		var assigned = document.getElementById('task-tracker__assigned').value;
		var newTask = {
			'name': name,
			'date': dateStr,
			'assigned': assigned
		};
		// Prepend object element to taskData
		taskData.unshift(newTask);
					console.log('New task added to taskData: ');
					console.log(newTask);

		// Prepend new DOM element to task list
		var ul = taskList;
		var li = createListItem(name, dateStr, assigned);
		ul.insertBefore(li, ul.firstChild);

		// Reset form
		taskForm.reset();
	}


	//
	//## Utility functions


	// Coerce date into mm-dd-yyy format string
	function dateFormat(dateString) {
		var d = new Date(dateString);
		var month = d.getMonth() + 1;
		var day = d.getDate();
		var year = d.getFullYear();
		return month + "/" + day + "/" + year;
	}


	//
	//## Initialize when document is loaded

	// ($(document).ready() is a crutch. Just let go.)

	function ready(init) {
		if (document.readyState != 'loading'){
			init();
		} else {
			document.addEventListener('DOMContentLoaded', init);
		}
	}

	ready( taskTracker() );











	//
	//######### Do not look below. It is not the code you are looking for.
	//










	//
	//## XMLHttpRequestFAKE - Emulate AJAX behavior without a remote server
	//
	// TODO: make this a separate module for general XHR testing

	function XMLHttpRequestFAKE() {

		// Data provided by client for exercise:
		var fakeJSON =
			[
				{"name": "Test Task #1", "date": "12/01/2012", "assigned": "John Doe" },
				{"name": "Test Task #2", "date": "12/02/2012", "assigned": "John Doe" },
				{"name": "Test Task #3", "date": "12/03/2012", "assigned": "John Doe" },
				{"name": "Test Task #4", "date": "12/04/2012", "assigned": "John Doe" },
				{"name": "Test Task #5", "date": "12/05/2012", "assigned": "John Doe" },
				{"name": "Test Task #6", "date": "12/06/2012", "assigned": "John Doe" },
				{"name": "Test Task #7", "date": "12/07/2012", "assigned": "John Doe" }
			];

		return {
			onreadystatechange: function() { },
			onload: function() { },
			onerror: function() { },
			readyState: 0,
			response: null,
			responseText: null,
			responseXML: null,
			responseType: '',
			mimeType: 'text/text',
			status: 0,
			statusText: '',

			abort: function() {
				// nothing to do, ignore
			},

			open: function( method, url, async ) {
				// nothing to do, just log the call
				console.log('XMLHttpRequestFAKE.open(\'' + method + '\', \'' + url + '\', ' + async + '\')');
			},

			send: function() {
				// Just Do It
				this.status = 200;
				this.statusText = '200 OK';
				// convert data into text stream
				this.response = JSON.stringify(fakeJSON);
				this.responseText = this.response;
				this.readyState = 4;
				// All done, fire callbacks
				this.onreadystatechange();
				this.onload();
				// Th-th-that’s all, folks!
			},

			overrideMimeType: function(newMimeType) {
				this.mimeType = newMimeType; // not used
			}

		};
	}

})();
