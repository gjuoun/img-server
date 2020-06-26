CREATE TABLE user (
	id INT auto_increment NOT NULL,
	username varchar(255) NOT NULL,
	password varchar(255) NOT NULL,
	CONSTRAINT user_PK PRIMARY KEY (id)
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;

CREATE TABLE image (
	id INT auto_increment NOT NULL,
	user_id INT NOT NULL,
	filename varchar(255) NOT NULL,
	local_path TEXT NOT NULL,
	CONSTRAINT image_PK PRIMARY KEY (id),
	CONSTRAINT image_FK FOREIGN KEY (user_id) REFERENCES user(id) ON UPDATE CASCADE
)

ENGINE=InnoDB
DEFAULT CHARSET=utf8
COLLATE=utf8_general_ci;


