-- INSERT into book
INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication)
VALUES (
	'9780007527533',
	1,
    'The ABC Murders',
    'Harper Collins',
    'https://www.skidrowcrack.com/download/2016/02/Agatha-Christie-The-ABC-Murders-CODEX-1.jpg',
    331,
    'The ABC Murders is a surprising novel tackling the modernfigure of the serial killer and the psychology behind it.There’s a serial killer on the loose, working his waythrough the alphabet - and the whole country is in a state of panic. A is forMrs Ascher in Andover, B is for Betty Barnard in Bexhill, C is for SirCarmichael Clarke in Churston. With each murder, the killer is getting moreconfident – but leaving a trail of deliberate clues to taunt the proud HerculePoirot might just prove to be the first, and fatal mistake. ',
    '2014/06/12'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication)
VALUES (
	'9780008129545',
	1,
    'Taken at the Flood',
    'Harper Collins',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KYfYOqaPqkksh0xNEJtAdwAAAA%26pid%3DApi&f=1',
    352,
    'A few weeks after marrying an attractive young widow, Gordon Cloade is tragically killed by a bomb blast in the London blitz. Overnight, the former Mrs Underhay finds herself in sole possession of the Cloade family fortune. Shortly afterwards, Hercule Poirot receives a visit from the dead man’s sister-in-law who claims she has been warned by ‘spirits’ that Mrs Underhay’s first husband is still alive. Poirot has his suspicions when he is asked to find a missing person guided only by the spirit world. Yet what mystifies Poirot most is the woman’s true motive for approaching him.  ',
    '2016/05/01'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication)
VALUES (
	'0140620427',
	1,
    'Sense and Sensibility',
    'Penguins',
    'https://www.weekendnotes.com/im/003/06/sense-and-sensibility-review-edition1.jpg',
    378,
    'Rich Mr. Dashwood dies, leaving his second wife and her three daughters poor by the rules of inheritance. The two eldest daughters are the title opposites.',
	'2016/12/10'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication)
VALUES (
	'9781509832101',
	1,
    'I am just a Person',
    'Bluebird',
    'https://t1.bookpage.com/books/images/a06ed12738d4a13b4c7c5e5582d40b48/large.jpg',
    237,
    'One of America’s most original comedic voices delivers a darkly funny, wryly observed, and emotionally raw account of her year of death, cancer, and epiphany. ',
    '2016/06/14'
);

-- INSERT into author

INSERT into author (Fname_auth,Lname_auth,bio)
VALUES ('Jane','Austen','Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century. Her plots often explore the dependence of women on marriage in the pursuit of favourable social standing and economic security.');

INSERT into author (Fname_auth,Lname_auth,bio)
VALUES ('Agatha','Christie','Dame Agatha Mary Clarissa Christie, Lady Mallowan, was an English writer known for her sixty-six detective novels and fourteen short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.');

INSERT into author (Fname_auth,Lname_auth,bio)
VALUES ('Tig', 'Notaro','Tig Notaro is an American stand-up comic, writer, radio contributor, and actress. She is known for her deadpan comedy. Her acclaimed album Live was nominated in 2014 for the Grammy Award for Best Comedy Album at the 56th Annual Grammy Awards.');


-- INSERT into genre

INSERT into genre (isbn,edition,genre)
VALUES ('0140620427',1,'Satire');

INSERT into genre (isbn,edition,genre)
VALUES ('0140620427',1,'Romance');

INSERT into genre (isbn,edition,genre)
VALUES ('9780007527533',1,'Crime');

INSERT into genre (isbn,edition,genre)
VALUES ('9780007527533',1,'Mystery');

INSERT into genre (isbn,edition,genre)
VALUES ('9780008129545',1,'Crime');

INSERT into genre (isbn,edition,genre)
VALUES ('9780008129545',1,'Mystery');

INSERT into genre (isbn,edition,genre)
VALUES ('9781509832101',1,'Biography');

-- INSERT into written_by

INSERT into written_by (isbn,edition,auth_id) 
VALUES ('0140620427', 1, 1) ;

INSERT into written_by (isbn,edition,auth_id) 
VALUES ('9780007527533', 1, 2) ;

INSERT into written_by (isbn,edition,auth_id) 
VALUES ('9780008129545', 1, 2) ;

INSERT into written_by (isbn,edition,auth_id) 
VALUES ('9781509832101', 1, 3) ;


-- INSERT into auth_reviews
INSERT into author_reviews (username,auth_id,review) 
VALUES ('jlilly',1, 'Amazing work');

INSERT into author_reviews (username,auth_id,review) 
VALUES ('toms',2, 'Nice read');









