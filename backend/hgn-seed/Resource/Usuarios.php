<?php
namespace Hagane\Resource;

class Usuarios extends AbstractResource{
	function load() {
		$this->get('/', function() {
			$data = array();
			$result = $this->db->query('SELECT * FROM User', $data);
			$this->message->append('usuarios', $result);
			echo $this->message->send();
		});
	}
}

?>