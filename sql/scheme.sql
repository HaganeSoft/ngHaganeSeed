CREATE TABLE User (
	id int(11) NOT NULL AUTO_INCREMENT,
	username varchar(50) NOT NULL,
	password varchar(50) NOT NULL,
	role enum('Administrador') NOT NULL,
	accessToken varchar(60) DEFAULT NULL,
	PRIMARY KEY (id),
	UNIQUE KEY username (username),
	UNIQUE KEY accessToken (accessToken)
);