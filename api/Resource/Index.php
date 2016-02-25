<?php
namespace Hagane\Resource;

class Index extends AbstractResource {
	function load() {
		$this->get('/', function() {
			$this->message->append('haganeapi', 'ver 0.0.2 - suizo');
			echo $this->message->send();
		});
	}
}

?>
