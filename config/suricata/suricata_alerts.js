
var suricatatimer;
var suricataisBusy = false;
var suricataisPaused = false;

function suricata_alerts_fetch_new_rules_callback(callback_data) {
	var data_split;
	var new_data_to_add = Array();
	var data = callback_data.content;

	data_split = data.split("\n");

	// Loop through rows and generate replacement HTML
	for(var x=0; x<data_split.length-1; x++) {
		row_split = data_split[x].split("||");
		var line = '';
		line = '<td width="22%" class="listMRr" nowrap>' + row_split[0] + '<br/>' + row_split[1] + '</td>';		
		line += '<td width="39%" class="listMRr">' + row_split[2] + '<br/>' + row_split[3] + '</td>';
		line += '<td width="39%" class="listMRr">' + 'Pri: ' +  row_split[4] + '&nbsp;' + row_split[5] + '</td>';
		new_data_to_add[new_data_to_add.length] = line;
	}
	suricata_alerts_update_div_rows(new_data_to_add);
	suricataisBusy = false;
}
function suricata_alerts_update_div_rows(data) {
	if(suricataisPaused)
		return;

	var rows = jQuery('#suricata-alert-entries>tr');

	// Number of rows to move by
	var move = rows.length + data.length - suri_nentries;
	if (move < 0)
		move = 0;

	for (var i = rows.length - 1; i >= move; i--) {
		jQuery(rows[i]).html(jQuery(rows[i - move]).html());
	}

	var tbody = jQuery('#suricata-alert-entries');
	for (var i = data.length - 1; i >= 0; i--) {
		if (i < rows.length) {
			jQuery(rows[i]).html(data[i]);
		} else {
			jQuery(tbody).prepend('<tr>' + data[i] + '</tr>');
		}
	}

	// Add the even/odd class to each of the rows now
	// they have all been added.
	rows = jQuery('#suricata-alert-entries>tr');
	for (var i = 0; i < rows.length; i++) {
		rows[i].className = i % 2 == 0 ? 'listMRodd' : 'listMReven';
	}
}

function fetch_new_surialerts() {
	if(suricataisPaused)
		return;
	if(suricataisBusy)
		return;

	suricataisBusy = true;
	getURL('/widgets/widgets/suricata_alerts.widget.php?getNewAlerts=' + new Date().getTime(), suricata_alerts_fetch_new_rules_callback);
}

function suricata_alerts_toggle_pause() {
	if(suricataisPaused) {
		suricataisPaused = false;
		fetch_new_surialerts();
	} else {
		suricataisPaused = true;
	}
}
/* start local AJAX engine */
suricatatimer = setInterval('fetch_new_surialerts()', suricataupdateDelay);