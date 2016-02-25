<?php
namespace Hagane\Resource;

class User extends AbstractResource{
	private $sessionidLength = 60;

	function load() {
		//POST routes----------------------------------------------------------
		$this->post('/login', function() {
			$request = json_decode(file_get_contents("php://input"));

			//checar par de pass y user
			$data = array('username' => $request->username, 'password' => $request->password);
			$result = $this->db->getRow('SELECT * FROM user WHERE username=:username AND password=:password', $data);
			if (!empty ( $result )) {
				$this->message->append('user', array(
						'accessToken' => $this->generateAccessToken($result['id']),
						'id' => $result['id'],
						'role' => $result['role']
					)
				);
			} else {
				$this->message->appendError('login','usuario y/o contraseña inválidos.');
			}

			echo $this->message->send();
		});

		$this->post('/authorize', function() {
			$request = json_decode(file_get_contents("php://input"));

			//checar par de pass y user
			$data = array('accessToken' => $request->accessToken);
			$result = $this->db->getRow('SELECT * FROM User WHERE access_token=:access_token', $data);
			if (!empty ( $result )) {
				$this->message->append('user', array(
						'id' => $result['id'],
						'role' => $result['role']
					)
				);
			} else {
				$this->message->appendError('authorize','access_token inválido.');
			}

			echo $this->message->send();
		});

		$this->post('/logout', function() {
			$request = json_decode(file_get_contents("php://input"));

			$data = array('access_token' => null, 'active_access_token' => $request->accessToken);
			$this->db->query('UPDATE User SET access_token=:access_token WHERE sessionid=:active_access_token', $data);

			$this->message->append('logout','Successfully logged out');

			echo $this->message->send();
		});

		//GET routes ----------------------------------------------------------
		$this->get('/authorize/:accessToken', function() {
			$accessToken = $this->params['accessToken'];

			//checar par de pass y user
			$data = array('access_token' => $accessToken);
			$result = $this->db->getRow('SELECT * FROM User WHERE access_token=:access_token', $data);
			if (!empty ( $result )) {
				$this->message->append('user', array(
						'id' => $result['id'],
						'role' => $result['role']
					)
				);
			} else {
				$this->message->appendError('authorize','accessToken inválido.');
			}

			echo $this->message->send();
		});
	}

	private function generateAccessToken($userId){
		$token = $this->getToken($this->sessionidLength);
		$data = array('access_token' => $token);

		while ($this->db->rowCount('SELECT access_token FROM User WHERE access_token = :access_token', $data) > 0) {
			$data = array('access_token' => $this->getToken($this->accessTokenLength));
		}

		$data['id'] = $userId;
		$this->db->query('UPDATE User SET access_token = :access_token WHERE id = :id', $data);
		return $token;
	}

	private function crypto_rand_secure($min, $max) {
		$range = $max - $min;
		if ($range < 0) return $min; // not so random...
		$log = log($range, 2);
		$bytes = (int) ($log / 8) + 1; // length in bytes
		$bits = (int) $log + 1; // length in bits
		$filter = (int) (1 << $bits) - 1; // set all lower bits to 1
		do {
			$rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
			$rnd = $rnd & $filter; // discard irrelevant bits
		} while ($rnd >= $range);
		return $min + $rnd;
	}

	private function getToken($length){
		$token = "";
		$codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		$codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
		$codeAlphabet.= "0123456789";
		for($i=0;$i<$length;$i++){
			$token .= $codeAlphabet[$this->crypto_rand_secure(0,strlen($codeAlphabet))];
		}
		return $token;
	}
}

?>
