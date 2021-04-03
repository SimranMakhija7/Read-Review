CREATE DATABASE IF NOT EXISTS readnreview ;

USE readnreview;
CREATE TABLE reader(
	username VARCHAR(50) PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    profile_img VARCHAR(500),
    Fname VARCHAR(50) NOT NULL,
    Lname VARCHAR(50) NOT NULL,
    city VARCHAR(50),
    state VARCHAR(50)
);


CREATE TABLE book(
	isbn VARCHAR(13),
	edition INT,
    title VARCHAR(50) NOT NULL,
    publication_name VARCHAR(100) NOT NULL,
    cover_img VARCHAR(500),
    pages INT NOT NULL CHECK(pages>0) ,
    synopsis VARCHAR(700),
    date_of_publication DATE NOT NULL ,
    PRIMARY KEY (isbn,edition)
);

CREATE TABLE author(
	auth_id INT AUTO_INCREMENT,
    Fname_auth VARCHAR(50) NOT NULL,
    Lname_auth VARCHAR(50) NOT NULL,
    bio VARCHAR(500),
    PRIMARY KEY (auth_id)
);

CREATE TABLE book_ratings(
	username VARCHAR(50),
    isbn VARCHAR(13),
    edition INT,
    stars INT check (stars BETWEEN 1 and 5),
    PRIMARY KEY (username,isbn,edition),
    FOREIGN KEY (username) references reader (username) on delete cascade,
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade
);

CREATE TABLE book_reviews(
	username VARCHAR(50),
    isbn VARCHAR(13),
    edition INT,
    review VARCHAR(500),
    PRIMARY KEY (username,isbn,edition),
    FOREIGN KEY (username) references reader (username) on delete cascade,
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade
);

CREATE TABLE genre(
	isbn VARCHAR(13),
    edition INT,
    genre VARCHAR(50),
    PRIMARY KEY (isbn,genre,edition),
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade
);

CREATE TABLE written_by(
	isbn VARCHAR(13),
    edition INT,
    auth_id INT,
    PRIMARY KEY (isbn,edition,auth_id),
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade,
	FOREIGN KEY (auth_id) references author (auth_id) on delete cascade

);

CREATE TABLE author_ratings(
	username VARCHAR(50),
    auth_id INT,
    stars INT check (stars BETWEEN 1 and 5),
    PRIMARY KEY (username,auth_id),
    FOREIGN KEY (username) references reader (username) on delete cascade,
    FOREIGN KEY (auth_id) references author (auth_id) on delete cascade
);


CREATE TABLE author_reviews(
	username VARCHAR(50),
    auth_id INT,
    review VARCHAR(500),
    PRIMARY KEY (username,auth_id),
    FOREIGN KEY (username) references reader (username) on delete cascade,
    FOREIGN KEY (auth_id) references author (auth_id) on delete cascade
);

CREATE TABLE bookshop(
	email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(500) NOT NULL,
    shopname VARCHAR(50) NOT NULL,
    ownername VARCHAR(50) NOT NULL,
    street VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    PRIMARY KEY (email)
);

CREATE TABLE books_available(
	isbn VARCHAR(50),
    quantity INT,
    edition INT,
    email VARCHAR(100),
    PRIMARY KEY (isbn,edition,email),
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade,
    FOREIGN KEY (email) references bookshop (email) on delete cascade
);

CREATE TABLE list(
	isbn VARCHAR(50),
    edition INT,
    username VARCHAR(50),
    PRIMARY KEY (isbn,edition,username),
    FOREIGN KEY (isbn,edition) references book (isbn,edition) on delete cascade,
    FOREIGN KEY (username) references reader (username) on delete cascade
);

ALTER TABLE book
ADD author_name varchar(255);

