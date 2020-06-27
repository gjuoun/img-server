CREATE TABLE user (
	id INT auto_increment NOT NULL,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	CONSTRAINT user_PK PRIMARY KEY (id)
);


CREATE TABLE image (
	id INT auto_increment NOT NULL,
	user_id INT NOT NULL,
	filename varchar(255) NOT NULL,
	local_path TEXT NOT NULL,
	CONSTRAINT image_PK PRIMARY KEY (id),
	CONSTRAINT image_FK FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE
);


CREATE TABLE token (
	id INT auto_increment NOT NULL,
	user_id INT NOT NULL,
	refresh_token TEXT NOT NULL,
	CONSTRAINT token_PK PRIMARY KEY (id),
	CONSTRAINT token_FK FOREIGN KEY (user_id) REFERENCES `user`(id) ON DELETE CASCADE ON UPDATE CASCADE
);