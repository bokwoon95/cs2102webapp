DROP TABLE IF EXISTS users, admin, lender, borrower, item, offer, basket, lender_review, borrower_review CASCADE;

CREATE TABLE users (
    usid SERIAL,
    name VARCHAR(60) NOT NULL,
    PRIMARY KEY (usid)
);

CREATE TABLE admin (
    usid INTEGER,
    PRIMARY KEY (usid),
    FOREIGN KEY (usid) REFERENCES users (usid) ON DELETE CASCADE
);

CREATE TABLE lender (
    usid INTEGER,
    PRIMARY KEY (usid),
    FOREIGN KEY (usid) REFERENCES users (usid) ON DELETE CASCADE
);

CREATE TABLE borrower (
    usid INTEGER,
    PRIMARY KEY (usid),
    FOREIGN KEY (usid) REFERENCES users (usid) ON DELETE CASCADE
);

CREATE TABLE item (
    iid SERIAL,
    lid INTEGER,
    name VARCHAR(60) NOT NULL,
    PRIMARY KEY (iid),
    FOREIGN KEY (lid) REFERENCES lender (usid) ON DELETE CASCADE
);

CREATE TABLE offer (
    oid SERIAL,
    lid INTEGER NOT NULL,
    bid INTEGER NOT NULL,
    iid INTEGER NOT NULL,
    price INTEGER NOT NULL,
    PRIMARY KEY (oid),
    FOREIGN KEY (lid) REFERENCES lender (usid) ON DELETE CASCADE,
    FOREIGN KEY (bid) REFERENCES borrower (usid) ON DELETE CASCADE,
    FOREIGN KEY (iid) REFERENCES item (iid) ON DELETE CASCADE
);

CREATE TABLE basket (
    usid INTEGER,
    iid INTEGER,
    PRIMARY KEY (usid),
    FOREIGN KEY (usid) REFERENCES borrower (usid) ON DELETE CASCADE,
    FOREIGN KEY (iid) REFERENCES item (iid) ON DELETE CASCADE
);

CREATE TABLE lender_review (
    lid INTEGER,
    bid INTEGER,
    review TEXT NOT NULL,
    PRIMARY KEY (lid, bid),
    FOREIGN KEY (lid) REFERENCES lender (usid) ON DELETE CASCADE,
    FOREIGN KEY (bid) REFERENCES borrower (usid) ON DELETE CASCADE
);

CREATE TABLE borrower_review (
    bid INTEGER,
    lid INTEGER,
    review TEXT NOT NULL,
    PRIMARY KEY (bid, lid),
    FOREIGN KEY (bid) REFERENCES borrower (usid) ON DELETE CASCADE,
    FOREIGN KEY (lid) REFERENCES lender (usid) ON DELETE CASCADE
);
