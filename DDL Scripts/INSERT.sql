-- INSERT into book
INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication, author_name)
VALUES (
	'9780007527533',
	1,
    'The ABC Murders',
    'Harper Collins',
    'https://www.skidrowcrack.com/download/2016/02/Agatha-Christie-The-ABC-Murders-CODEX-1.jpg',
    331,
    'The ABC Murders is a surprising novel tackling the modernfigure of the serial killer and the psychology behind it.There’s a serial killer on the loose, working his waythrough the alphabet - and the whole country is in a state of panic. A is forMrs Ascher in Andover, B is for Betty Barnard in Bexhill, C is for SirCarmichael Clarke in Churston. With each murder, the killer is getting moreconfident – but leaving a trail of deliberate clues to taunt the proud HerculePoirot might just prove to be the first, and fatal mistake. ',
    '2014/06/12',
    'Agatha Christie'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication, author_name)
VALUES (
	'9780008129545',
	1,
    'Taken at the Flood',
    'Harper Collins',
    'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.KYfYOqaPqkksh0xNEJtAdwAAAA%26pid%3DApi&f=1',
    352,
    'A few weeks after marrying an attractive young widow, Gordon Cloade is tragically killed by a bomb blast in the London blitz. Overnight, the former Mrs Underhay finds herself in sole possession of the Cloade family fortune. Shortly afterwards, Hercule Poirot receives a visit from the dead man’s sister-in-law who claims she has been warned by ‘spirits’ that Mrs Underhay’s first husband is still alive. Poirot has his suspicions when he is asked to find a missing person guided only by the spirit world. Yet what mystifies Poirot most is the woman’s true motive for approaching him.  ',
    '2016/05/01',
    'Agatha Christie'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication, author_name)
VALUES (
	'0140620427',
	1,
    'Sense and Sensibility',
    'Penguins',
    'https://www.weekendnotes.com/im/003/06/sense-and-sensibility-review-edition1.jpg',
    378,
    'Rich Mr. Dashwood dies, leaving his second wife and her three daughters poor by the rules of inheritance. The two eldest daughters are the title opposites.',
	'2016/12/10',
    'Jane Austen'
);

INSERT INTO book (isbn, edition, title, publication_name, cover_img, pages, synopsis, date_of_publication, author_name)
VALUES (
	'9781509832101',
	1,
    'I am just a Person',
    'Bluebird',
    'https://t1.bookpage.com/books/images/a06ed12738d4a13b4c7c5e5582d40b48/large.jpg',
    237,
    'One of America’s most original comedic voices delivers a darkly funny, wryly observed, and emotionally raw account of her year of death, cancer, and epiphany. ',
    '2016/06/14',
    'Tig Notaro'
);



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





-- INSERT into bookshop
insert into bookshop (name,street_no,street_name,city,state)
VALUES ('Book Mountains',4,'Gandhi Road','Indore','Madhya Pradesh');

insert into bookshop (name,street_no,street_name,city,state)
VALUES ('Book Paradise',40,'VLH Road','Bhopal','Madhya Pradesh');

insert into bookshop (name,street_no,street_name,city,state)
VALUES ('Reader Club',10,'Crawford Street','Mumbai','Maharashtra');

insert into bookshop (name,street_no,street_name,city,state)
VALUES ('Book n Coffee',13,'J19 Street','Indore','Madhya Pradesh');


-- INSERT into has
insert into has (isbn,edition,shop_id,quantity)
values ('0140620427',1,1,10);

insert into has (isbn,edition,shop_id,quantity)
values ('9780008129545',1,1,15);

insert into has (isbn,edition,shop_id,quantity)
values ('9780008129545',1,3,5);




