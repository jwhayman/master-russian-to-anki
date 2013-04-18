var mr2a = {
	data: null,
	processedData: [],
	cellCount: 0,
	
	initialize: function() {
		this.data = $('.topwords').first().find('tr.rowFirst, tr.rowSecond');
		this.cellCount = this.data.first().children('td').length;
		this.initWriters();
		this.initSelectors();
		this.processData();
	},
	
	initWriters: function() {
		$('.topwords').first().before('<pre id="mr2a-audio" class="mr2a-container"></pre>');
		$('.topwords').first().before('<pre id="mr2a-csv" class="mr2a-container"></pre>');
	},
	
	initSelectors: function() {
		$('.mr2a-container').click(function(e) {
			selectElementText(document.getElementById(e.currentTarget.id));
		});
	},
	
	processData: function() {
		$(this.data).each(function(index, row) {
			var cells = $(row).children('td');
			
			if (mr2a.cellCount == 5) {
				var word = {
					'audio': mr2a.processAudio(cells[1]),
					'russian': mr2a.processCell(cells[2]).toUpperCase(),
					'translation': mr2a.processCell(cells[3]),
					'speech': mr2a.processCell(cells[4])
				}
			}
			else if (mr2a.cellCount == 4) {
				var word = {
					'russian': mr2a.processCell(cells[1]),
					'translation': mr2a.processCell(cells[2]),
					'speech': mr2a.processCell(cells[3])
				}
			}
			
			mr2a.processedData[index] = word;
		});
	},
	
	processAudio: function(cell) {
		var url = $(cell).children('object').first().children('param').last().val();
		if (url) {
			return url.match(/http:\/\/.*\.mp3/).join();
		}
		
		return '';
	},
	
	processCell: function(cell) {
		return $(cell).text().trim();
	},
	
	writeAudioFiles: function() {
		if (mr2a.cellCount == 5) {
			for (var i = 0; i < this.processedData.length; i++) {
				var word = this.processedData[i];
				$('#mr2a-audio').append(word.audio + "\r\n");
			}
		}
		else if (mr2a.cellCount == 4) {
			$('#mr2a-audio').append("No Audio Files\r\n");
		}
	},
	
	writeToCSV: function() {
		if (mr2a.cellCount == 5) {
			for (var i = 0; i < this.processedData.length; i++) {
				var word = this.processedData[i];
				var audioFile = word.audio.match(/[^/]*$/);
				$('#mr2a-csv').append(word.russian + "\t" + word.translation + "\t" + word.speech + "\t" + audioFile + "\r\n");
			}
		}
		else if (mr2a.cellCount == 4) {
			for (var i = 0; i < this.processedData.length; i++) {
				var word = this.processedData[i];
				$('#mr2a-csv').append(word.russian + "\t" + word.translation + "\t" + word.speech + "\r\n");
			}
		}
	}
}

$(document).ready(function() {
	mr2a.initialize();
	mr2a.writeAudioFiles();
	mr2a.writeToCSV();
});

function selectElementText(el, win) {
    win = win || window;
    var doc = win.document, sel, range;
    if (win.getSelection && doc.createRange) {
        sel = win.getSelection();
        range = doc.createRange();
        range.selectNodeContents(el);
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (doc.body.createTextRange) {
        range = doc.body.createTextRange();
        range.moveToElementText(el);
        range.select();
    }
}